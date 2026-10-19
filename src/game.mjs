import { randomBytes, randomInt } from 'node:crypto';
import { RULES, ITEMS } from './catalog.mjs';
import { QUESTIONS } from './questions.mjs';

export class GameError extends Error {
  constructor(message, status = 400) { super(message); this.status = status; }
}
const fail = (condition, message, status) => { if (condition) throw new GameError(message, status); };
const shuffle = values => { const result = [...values]; for (let i = result.length - 1; i > 0; i--) { const j = randomInt(i + 1); [result[i], result[j]] = [result[j], result[i]]; } return result; };
const nameOf = name => {
  fail(typeof name !== 'string', 'Donnez un nom à votre équipe.');
  const clean = name.normalize('NFC').replace(/[\p{Cc}\p{Cf}]/gu, '').trim().slice(0, 24);
  fail(clean.length < 2, 'Le nom doit contenir au moins 2 caractères.');
  return clean;
};
function team(name, id, now, bot = false) {
  return { id, name: nameOf(name), token: randomBytes(24).toString('hex'), bot, lastSeen: now, ready: bot, hp: RULES.hp, coins: RULES.startingCoins, shield: 0, shieldUntil: 0, mirrorUntil: 0, cooldowns: {}, nextAction: 0, answer: null, rematch: false, stats: { correct: 0, answered: 0, damage: 0, spent: 0 } };
}

export class GameService {
  constructor({ now = () => Date.now() } = {}) { this.rooms = new Map(); this.now = now; }
  event(room, message, kind = 'info', at = this.now()) { room.events.unshift({ id: ++room.eventId, message, kind, at }); room.events = room.events.slice(0, 24); }
  create(name, practice = false) {
    this.cleanup();
    fail(this.rooms.size >= 200, 'Le serveur accueille déjà beaucoup de parties. Réessayez plus tard.', 503);
    let code;
    do { code = Array.from({ length: 6 }, () => 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[randomInt(31)]).join(''); } while (this.rooms.has(code));
    const now = this.now();
    const room = { code, host: 0, status: 'waiting', createdAt: now, updatedAt: now, teams: [team(name, 0, now)], practice: !!practice, events: [], eventId: 0, projectiles: [], round: 0, startedAt: 0, winner: null, endReason: null, question: null, deck: [], lastStorm: 0 };
    if (practice) room.teams.push(team('Les Veilleurs', 1, now, true));
    this.rooms.set(code, room);
    this.event(room, `${room.teams[0].name} a ouvert le camp.`);
    return { code, token: room.teams[0].token };
  }
  room(code) {
    fail(typeof code !== 'string' || !/^[A-Z2-9]{6}$/.test(code), 'Le code comporte 6 lettres ou chiffres.');
    const room = this.rooms.get(code);
    fail(!room, 'Cette partie est introuvable ou a expiré. Créez-en une nouvelle.', 404);
    return room;
  }
  join(code, name) {
    const room = this.room(code);
    fail(room.status !== 'waiting', 'Cette partie a déjà commencé.', 409);
    fail(room.teams.length >= 2, 'Cette partie a déjà ses deux équipes.', 409);
    const player = team(name, room.teams[0]?.id === 0 ? 1 : 0, this.now());
    room.teams.push(player); room.updatedAt = this.now();
    this.event(room, `${player.name} a rejoint le camp.`);
    return { code, token: player.token };
  }
  authorize(code, token) {
    const room = this.room(code);
    const player = room.teams.find(p => p.token === token && !p.bot);
    fail(!player, 'Votre accès à cette partie a expiré. Rejoignez une nouvelle partie.', 401);
    player.lastSeen = this.now(); room.updatedAt = this.now();
    this.tick(room);
    return { room, player };
  }
  newQuestion(room) {
    if (!room.deck.length) room.deck = shuffle(QUESTIONS);
    const source = room.deck.pop();
    const order = shuffle([0, 1, 2, 3]);
    room.question = { ...source, options: order.map(i => source.options[i]), correct: order.indexOf(source.correct) };
    room.teams.forEach(p => { p.answer = null; });
  }
  start(room) {
    const now = this.now();
    room.status = 'playing'; room.startedAt = now; room.round = 1; room.lastStorm = now + (RULES.stormRound - 1) * RULES.roundMs; room.events = []; room.eventId = 0; room.projectiles = []; room.deck = []; room.winner = null; room.endReason = null; room.finishedAt = null;
    room.teams = room.teams.map(p => ({ ...team(p.name, p.id, now, p.bot), token: p.token, ready: true }));
    this.newQuestion(room);
    this.event(room, 'Les bastions sont prêts. Que la bataille des idées commence !', 'start');
  }
  action(code, token, action) {
    const { room, player } = this.authorize(code, token);
    const now = this.now();
    if (action.type === 'ready') { fail(room.status !== 'waiting', 'La partie a déjà commencé.'); player.ready = !player.ready; }
    else if (action.type === 'start') {
      fail(room.status !== 'waiting', 'La partie a déjà commencé.');
      fail(player.id !== room.host, 'Seule l’équipe qui a créé le camp peut lancer la partie.');
      fail(room.teams.length !== 2 || !room.teams.every(p => p.ready), 'Les deux équipes doivent être prêtes.');
      fail(room.teams.some(p => !p.bot && now - p.lastSeen > 15_000), 'Attendez que les deux équipes soient connectées.');
      this.start(room);
    } else if (action.type === 'answer') this.answer(room, player, action.round, action.choice);
    else if (action.type === 'buy') this.buy(room, player, action.item);
    else if (action.type === 'rematch') {
      fail(room.status !== 'finished', 'La partie n’est pas terminée.');
      player.rematch = true;
      if (room.practice) room.teams.find(p => p.bot).rematch = true;
      if (room.teams.every(p => p.rematch)) this.start(room);
    } else if (action.type === 'leave') {
      if (room.status === 'playing') this.finish(room, room.teams.find(p => p.id !== player.id).id, 'forfeit');
      else if (room.status === 'waiting') {
        room.teams = room.teams.filter(p => p.id !== player.id);
        if (!room.teams.length || room.practice) this.rooms.delete(code);
        else { room.host = room.teams[0].id; this.event(room, `${player.name} a quitté le camp.`); }
      }
      return { left: true };
    } else throw new GameError('Cette action n’existe pas.');
    return this.snapshot(room, room.teams.find(p => p.token === token));
  }
  answer(room, player, round, choice) {
    fail(room.status !== 'playing', 'La partie n’est pas en cours.');
    fail(round !== room.round, 'Une nouvelle question est arrivée.');
    fail(this.now() >= room.startedAt + (room.round - 1) * RULES.roundMs + RULES.answerMs, 'Le temps de réponse est écoulé.');
    fail(player.answer !== null, 'Votre réponse est déjà enregistrée.');
    fail(!Number.isInteger(choice) || choice < 0 || choice > 3, 'Choisissez une réponse valide.');
    const correct = choice === room.question.correct;
    player.answer = { choice, correct };
    player.stats.answered++;
    if (correct) { player.coins += RULES.correctReward; player.stats.correct++; }
  }
  buy(room, player, itemId) {
    const now = this.now();
    fail(room.status !== 'playing', 'La partie n’est pas en cours.');
    const item = ITEMS.find(i => i.id === itemId);
    fail(!item, 'Cet équipement n’existe pas.');
    fail(player.nextAction > now || (player.cooldowns[item.id] || 0) > now, 'Cet équipement se prépare encore.');
    fail(player.coins < item.cost, 'Vous n’avez pas assez de pièces.');
    fail(item.heal && room.round >= RULES.stormRound, 'Les réparations sont fermées pendant la tempête.');
    fail(item.heal && player.hp >= RULES.hp, 'Votre bastion est déjà en pleine forme.');
    fail(item.shield && player.shield >= 36, 'Votre bouclier a déjà atteint 36 points.');
    fail(item.id === 'mirror' && player.mirrorUntil > now, 'Votre miroir est déjà actif.');
    player.coins -= item.cost; player.stats.spent += item.cost; player.nextAction = now + RULES.actionCooldownMs; player.cooldowns[item.id] = now + item.cooldown;
    if (item.kind === 'attack') {
      const enemy = room.teams.find(p => p.id !== player.id);
      room.projectiles.push({ id: randomBytes(6).toString('hex'), item: item.id, from: player.id, to: enemy.id, launchAt: now, impactAt: now + item.flight, damage: Math.round(item.damage * (room.round >= RULES.siegeRound ? 1.5 : 1)) });
      this.event(room, `${player.name} lance ${item.name.toLocaleLowerCase('fr')}.`, 'attack');
    } else {
      if (item.shield) { player.shield = Math.min(36, player.shield + item.shield); player.shieldUntil = now + item.duration; }
      if (item.heal) player.hp = Math.min(RULES.hp, player.hp + item.heal);
      if (item.id === 'mirror') player.mirrorUntil = now + item.duration;
      this.event(room, `${player.name} active ${item.name.toLocaleLowerCase('fr')}.`, 'defense');
    }
  }
  damage(player, amount, pierce = false) {
    let remaining = amount;
    if (!pierce) { const absorbed = Math.min(player.shield, amount); player.shield -= absorbed; remaining -= absorbed; }
    const dealt = Math.min(player.hp, remaining); player.hp -= dealt;
    return dealt;
  }
  resolve(room, projectile) {
    const item = ITEMS.find(i => i.id === projectile.item);
    const target = room.teams.find(p => p.id === projectile.to);
    const attacker = room.teams.find(p => p.id === projectile.from);
    // Effects are evaluated at impact time, even when a tick runs slightly late.
    if (target.shieldUntil <= projectile.impactAt) target.shield = 0;
    if (attacker.shieldUntil <= projectile.impactAt) attacker.shield = 0;
    if (item.shieldDamage) target.shield = Math.max(0, target.shield - item.shieldDamage);
    let amount = projectile.damage;
    if (target.mirrorUntil > projectile.impactAt) {
      const reflected = Math.round(amount * 0.4); amount -= reflected; target.mirrorUntil = 0;
      target.stats.damage += this.damage(attacker, reflected);
      this.event(room, `${target.name} renvoie ${reflected} dégâts avec son miroir !`, 'defense', projectile.impactAt);
    }
    const dealt = this.damage(target, amount, item.pierce);
    attacker.stats.damage += dealt;
    this.event(room, `${item.name} : ${target.name} perd ${dealt} PV${dealt === 0 ? ' · attaque absorbée' : ''}.`, 'impact', projectile.impactAt);
  }
  finish(room, winner, reason = 'destroyed') {
    room.status = 'finished'; room.winner = winner; room.endReason = reason; room.finishedAt = this.now(); room.projectiles = [];
    const name = room.teams.find(p => p.id === winner)?.name;
    this.event(room, name ? `${name} remporte la bataille !` : 'Les deux bastions tombent ensemble. Égalité !', 'finish');
  }
  tick(room) {
    if (room.status !== 'playing') return;
    const now = this.now();
    // Process all timed events chronologically; simultaneous impacts share the same outcome check.
    let eventTime;
    while (room.status === 'playing') {
      const nextRound = room.startedAt + room.round * RULES.roundMs;
      const nextImpact = room.projectiles.length ? Math.min(...room.projectiles.map(p => p.impactAt)) : Infinity;
      const nextStorm = room.round >= RULES.stormRound ? room.lastStorm + RULES.stormIntervalMs : Infinity;
      eventTime = Math.min(nextRound, nextImpact, nextStorm);
      if (eventTime > now) break;
      if (nextRound === eventTime) {
        room.round++;
        room.teams.forEach(p => { p.coins += RULES.supply; });
        this.newQuestion(room);
        if (room.round === RULES.siegeRound) this.event(room, 'Le siège commence : toutes les nouvelles attaques infligent 50 % de dégâts supplémentaires.', 'siege', eventTime);
        if (room.round === RULES.stormRound) this.event(room, 'La tempête arrive : −8 PV toutes les 10 s. Les réparations sont fermées !', 'siege', eventTime);
      }
      const due = room.projectiles.filter(p => p.impactAt === eventTime);
      room.projectiles = room.projectiles.filter(p => p.impactAt !== eventTime);
      due.forEach(p => this.resolve(room, p));
      if (nextStorm === eventTime) { room.lastStorm = eventTime; room.teams.forEach(p => this.damage(p, RULES.stormDamage, true)); this.event(room, 'La tempête frappe les deux villages : −8 PV.', 'impact', eventTime); }
      const alive = room.teams.filter(p => p.hp > 0);
      if (alive.length < 2) this.finish(room, alive[0]?.id ?? null);
    }
    room.teams.forEach(p => { if (p.shieldUntil <= now) p.shield = 0; });
    if (room.status !== 'playing') return;
    const absent = room.teams.filter(p => !p.bot && now - p.lastSeen >= RULES.disconnectMs);
    if (absent.length === 1 && room.teams.some(p => p.id !== absent[0].id && (p.bot || now - p.lastSeen < 15_000))) { this.finish(room, room.teams.find(p => p.id !== absent[0].id).id, 'disconnect'); return; }
    const bot = room.teams.find(p => p.bot);
    if (bot) {
      bot.lastSeen = now;
      if (!bot.answer && now >= room.startedAt + (room.round - 1) * RULES.roundMs + 9000 && now < room.startedAt + (room.round - 1) * RULES.roundMs + RULES.answerMs) this.answer(room, bot, room.round, randomInt(100) < 65 ? room.question.correct : (room.question.correct + 1) % 4);
      if (now >= (bot.botNext || 0)) {
        bot.botNext = now + 9000;
        const incoming = room.projectiles.some(p => p.to === bot.id);
        const id = incoming && !bot.shield && bot.coins >= 10 ? 'shield' : bot.coins >= 18 ? 'catapult' : 'arrows';
        try { this.buy(room, bot, id); } catch (error) { if (!(error instanceof GameError)) throw error; }
      }
    }
  }
  snapshot(room, player) {
    const now = this.now();
    const roundStart = room.startedAt + (room.round - 1) * RULES.roundMs;
    const reveal = player.answer !== null || now >= roundStart + RULES.answerMs || room.status === 'finished';
    const question = room.question ? { id: room.question.id, category: room.question.category, text: room.question.text, options: room.question.options, ...(reveal ? { correct: room.question.correct, explanation: room.question.explanation } : {}) } : null;
    return { code: room.code, status: room.status, host: room.host, me: player.id, practice: room.practice, serverNow: now, round: room.round, startedAt: room.startedAt, answerUntil: roundStart + RULES.answerMs, nextRoundAt: roundStart + RULES.roundMs, siege: room.round >= RULES.siegeRound, storm: room.round >= RULES.stormRound, winner: room.winner, endReason: room.endReason, finishedAt: room.finishedAt, question, answer: player.answer, rules: RULES, items: ITEMS, teams: room.teams.map(p => ({ id: p.id, name: p.name, hp: p.hp, shield: p.shield, shieldUntil: p.shieldUntil, mirrorUntil: p.mirrorUntil, ready: p.ready, online: p.bot || now - p.lastSeen < 15_000, lastSeen: p.lastSeen, bot: p.bot, answered: !!p.answer, rematch: p.rematch, stats: p.stats, ...(p.id === player.id ? { coins: p.coins, cooldowns: p.cooldowns, nextAction: p.nextAction } : {}) })), projectiles: room.projectiles, events: room.events };
  }
  state(code, token) { const { room, player } = this.authorize(code, token); return this.snapshot(room, player); }
  tickAll() { for (const room of this.rooms.values()) this.tick(room); }
  cleanup() { const now = this.now(); for (const [code, room] of this.rooms) if (now - room.updatedAt > 7_200_000 || (room.finishedAt && now - room.finishedAt > 1_800_000)) this.rooms.delete(code); }
}
