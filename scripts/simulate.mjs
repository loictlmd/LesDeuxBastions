import { ITEMS, RULES, itemPrice } from '../src/catalog.mjs';
import { GameService } from '../src/game.mjs';
// Simulations de stratégies simples : une aide à l'équilibrage, pas un test utilisateur.
let seed = 20261019;
const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
function match(strategies, skill, responseMs = 10000) {
  let time = 1_000_000;
  const game = new GameService({ now: () => time });
  const a = game.create('Sauge'), b = game.join(a.code, 'Corail');
  for (const p of [a, b]) game.action(p.code, p.token, { type: 'ready' });
  game.action(a.code, a.token, { type: 'start' });
  for (const p of [a, b]) game.action(p.code, p.token, { type: 'briefed' });
  const room = game.room(a.code), started = time;
  for (let step = 0; step < 1300 && room.status === 'playing'; step++) {
    time += 500;
    room.teams.forEach(p => { p.lastSeen = time; p.lastActiveAt = time; });
    game.tickAll();
    if (room.status !== 'playing') break;
    // Alternating order avoids favoring the first team at every step.
    for (const i of step % 2 ? [0, 1] : [1, 0]) {
      const player = room.teams[i], opponent = room.teams[1 - i];
      if (!player.answer && time >= room.roundStartedAt + responseMs && time < room.roundStartedAt + 25_000) game.answer(room, player, room.round, random() < skill[i] ? room.question.correct : (room.question.correct + 1) % 4);
      const incoming = room.projectiles.filter(p => p.to === player.id && p.impactAt - time <= 3000);
      let items;
      if (strategies[i] === 'defense') items = [...(incoming.length && player.shield < 18 ? ['shield'] : []), ...(player.hp <= RULES.hp - 25 ? ['repair'] : []), 'catapult'];
      else if (strategies[i] === 'arrows') items = ['arrows'];
      else if (strategies[i] === 'varied') items = ITEMS.filter(item => item.kind === 'attack').sort((a,b) => b.damage / (itemPrice(b, player.purchases) + (player.unlocks[b.id] ? 0 : b.unlockCost / 2)) - a.damage / (itemPrice(a, player.purchases) + (player.unlocks[a.id] ? 0 : a.unlockCost / 2))).map(item => item.id);
      else items = [...(incoming.some(p => p.damage >= 24) && player.shield < 6 ? ['shield'] : []), ...(opponent.shield >= 18 ? ['lightning'] : ['catapult'])];
      for (const item of items) { try { if (ITEMS.find(i => i.id === item).kind === 'attack' && !player.unlocks[item]) game.unlock(room, player, item); else game.buy(room, player, item); break; } catch { /* Wait for funds or a cooldown. */ } }
    }
  }
  return { seconds: (time - started) / 1000, winner: room.winner, status: room.status };
}
const cases = [
  { strategies: ['balanced', 'balanced'], skill: [.65, .65] },
  { strategies: ['arrows', 'balanced'], skill: [.65, .65] },
  { strategies: ['defense', 'balanced'], skill: [.65, .65] },
  { strategies: ['balanced', 'balanced'], skill: [.8, .4] },
  { strategies: ['balanced', 'balanced'], skill: [0, 0] },
  { strategies: ['varied', 'varied'], skill: [.65, .65] },
  { strategies: ['varied', 'balanced'], skill: [.65, .65] },
  { strategies: ['varied', 'varied'], skill: [1, 1], responseMs: 2000 },
  { strategies: ['varied', 'varied'], skill: [.65, .65], responseMs: 20000 }
];
const output = cases.map(c => {
  const results = Array.from({ length: 100 }, () => match(c.strategies, c.skill, c.responseMs));
  const durations = results.map(r => r.seconds).sort((a, b) => a - b);
  return { strategies: c.strategies, correctProbability: c.skill, responseMs: c.responseMs || 10000, games: results.length, minSeconds: durations[0], winsA: results.filter(r => r.winner === 0).length, winsB: results.filter(r => r.winner === 1).length, draws: results.filter(r => r.winner === null).length, medianSeconds: durations[50], maxSeconds: durations.at(-1), allFinished: results.every(r => r.status === 'finished') };
});
console.log(JSON.stringify(output, null, 2));
if (output.some(r => !r.allFinished)) process.exitCode = 1;
