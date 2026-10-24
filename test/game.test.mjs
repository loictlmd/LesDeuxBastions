import test from 'node:test';
import assert from 'node:assert/strict';
import { GameService } from '../src/game.mjs';
import { RULES, ITEMS } from '../src/catalog.mjs';
import { QUESTIONS } from '../src/questions.mjs';

function setup({ unlocked = true } = {}) {
  let clock = 1_000_000;
  const service = new GameService({ now: () => clock });
  const a = service.create('Les Sauges'), b = service.join(a.code, 'Les Coraux');
  const act = (who, type, extra = {}) => service.action(who.code, who.token, { type, ...extra });
  act(a, 'ready'); act(b, 'ready'); act(a, 'start'); act(a, 'briefed'); act(b, 'briefed');
  const room = service.room(a.code);
  // Prebuilt attacks isolate the legacy combat tests from the research economy.
  if (unlocked) for (const p of room.teams) for (const item of ITEMS.filter(i => i.kind === 'attack')) p.unlocks[item.id] = { startedAt: clock - item.unlockMs, readyAt: clock };
  return { service, a, b, room, act, advance(ms, connected = true) { clock += ms; if (connected) room.teams.forEach(p => { p.lastSeen = clock; p.lastActiveAt = service.gameNow(room); }); service.tickAll(); }, get time() { return clock; } };
}
test('1500 questions, four distinct options and a valid solution', () => { assert.equal(QUESTIONS.length, 1500); for (const q of QUESTIONS) { assert.equal(q.options.length, 4); assert.equal(new Set(q.options).size, 4); assert.ok(q.correct >= 0 && q.correct < 4); assert.ok(q.explanation); } });
test('two authenticated teams, shared question, no early answer or token leaks', () => {
  const { service, a, b } = setup();
  assert.throws(() => service.state(a.code, 'wrong'), /accès/);
  assert.throws(() => service.join(a.code, 'Troisième équipe'), /commencé/);
  const one = service.state(a.code, a.token), two = service.state(b.code, b.token);
  assert.deepEqual(one.question, two.question); assert.equal(one.question.correct, undefined);
  assert.ok(one.teams.every(p => !('token' in p))); assert.equal(one.teams.find(p => p.id !== one.me).coins, undefined);
});
test('start requires readiness, two teams and host; room capacity enforced', () => {
  const service = new GameService(); const a = service.create('Équipe A');
  assert.throws(() => service.action(a.code, a.token, { type: 'start' }), /prêtes/);
  const b = service.join(a.code, 'Équipe B');
  assert.throws(() => service.join(a.code, 'Équipe C'), /deux équipes/);
  assert.throws(() => service.action(b.code, b.token, { type: 'start' }), /Seule/);
});
test('correct answer pays once, wrong answer pays nothing, rounds expire at 25 seconds', () => {
  const s = setup(), correct = s.room.question.correct;
  const state = s.act(s.a, 'answer', { round: 1, choice: correct });
  assert.equal(state.teams[0].coins, RULES.startingCoins + RULES.maxReward); assert.equal(state.answer.correct, true);
  assert.throws(() => s.act(s.a, 'answer', { round: 1, choice: correct }), /déjà/);
  s.act(s.b, 'answer', { round: 1, choice: (correct + 1) % 4 }); assert.equal(s.room.teams[1].coins, 12);
  s.advance(3000); assert.equal(s.room.round, 2); assert.equal(s.room.teams[0].coins, RULES.startingCoins + RULES.maxReward + RULES.supply);
  assert.throws(() => s.act(s.a, 'answer', { round: 1, choice: 0 }), /nouvelle/);
  s.advance(25_000); assert.throws(() => s.act(s.a, 'answer', { round: 2, choice: 0 }), /écoulé/);
  assert.equal(s.service.state(s.a.code, s.a.token).question.correct, s.room.question.correct);
});
test('attack impacts only at its scheduled time and defense can react', () => {
  const s = setup(); s.act(s.a, 'buy', { item: 'arrows' }); s.act(s.b, 'buy', { item: 'shield' });
  s.advance(3999); assert.equal(s.room.teams[1].hp, RULES.hp); assert.equal(s.room.teams[1].shield, 18);
  s.advance(1); assert.equal(s.room.teams[1].hp, RULES.hp); assert.equal(s.room.teams[1].shield, 6); assert.equal(s.room.projectiles.length, 0);
});
test('cooldowns and lack of funds prevent duplicate spending', () => {
  const s = setup(); s.act(s.a, 'buy', { item: 'arrows' });
  assert.throws(() => s.act(s.a, 'buy', { item: 'arrows' }), /prépare/);
  assert.equal(s.room.teams[0].coins, 4); s.advance(4000);
  assert.throws(() => s.act(s.a, 'buy', { item: 'arrows' }), /assez/); assert.equal(s.room.teams[0].coins, 4);
});
test('piercing lightning ignores shields', () => {
  const s = setup(); s.room.teams[0].coins = 100; s.act(s.a, 'buy', { item: 'lightning' }); s.act(s.b, 'buy', { item: 'shield' }); s.advance(6000);
  assert.equal(s.room.teams[1].hp, RULES.hp - 18); assert.equal(s.room.teams[1].shield, 18);
});
test('sabotage breaks shields before its regular damage', () => {
  const s = setup(); s.act(s.a, 'buy', { item: 'sabotage' }); s.act(s.b, 'buy', { item: 'shield' }); s.advance(5000);
  assert.equal(s.room.teams[1].hp, RULES.hp - 6); assert.equal(s.room.teams[1].shield, 0);
});
test('mirror blocks and reflects 40 percent once without recursion', () => {
  const s = setup(); s.act(s.a, 'buy', { item: 'arrows' }); s.act(s.b, 'buy', { item: 'mirror' }); s.advance(4000);
  assert.equal(s.room.teams[0].hp, RULES.hp - 5); assert.equal(s.room.teams[1].hp, RULES.hp - 7); assert.equal(s.room.teams[1].mirrorUntil, 0);
});
test('shield cap, expiration, repair cap and cooldown', () => {
  const s = setup(); const player = s.room.teams[0]; player.coins = 200;
  assert.throws(() => s.act(s.a, 'buy', { item: 'repair' }), /pleine forme/);
  s.act(s.a, 'buy', { item: 'shield' }); s.advance(8000); s.act(s.a, 'buy', { item: 'shield' }); assert.equal(player.shield, 36);
  s.advance(8000); assert.throws(() => s.act(s.a, 'buy', { item: 'shield' }), /36/);
  s.advance(37_000); assert.equal(player.shield, 0);
  player.hp = RULES.hp - 5; s.act(s.a, 'buy', { item: 'repair' }); assert.equal(player.hp, RULES.hp); player.hp = RULES.hp - 10;
  s.advance(3000); assert.throws(() => s.act(s.a, 'buy', { item: 'repair' }), /prépare/);
});
test('siege multiplier applies to new attacks from 8 minutes', () => {
  const s = setup(); s.advance(RULES.siegeMs); assert.equal(s.room.round, 1 + RULES.siegeMs / RULES.roundMs);
  s.act(s.a, 'buy', { item: 'arrows' }); assert.equal(s.room.projectiles[0].damage, 18);
});
test('storm prevents infinite defense and handles simultaneous destruction', () => {
  const s = setup(); s.advance(RULES.stormMs); assert.equal(s.room.round, 1 + RULES.stormMs / RULES.roundMs);
  s.room.teams[0].hp = 119;
  assert.throws(() => s.act(s.a, 'buy', { item: 'repair' }), /fermées/);
  s.room.teams.forEach(p => { p.hp = 16; p.shield = 36; p.shieldUntil = s.time + 200_000; });
  s.advance(20_000); assert.equal(s.room.status, 'finished'); assert.equal(s.room.winner, null); assert.deepEqual(s.room.teams.map(p => p.hp), [0, 0]);
});
test('simultaneous lethal attacks give a draw, and both votes restart cleanly', () => {
  const s = setup(); s.room.teams.forEach(p => { p.hp = 12; });
  s.act(s.a, 'buy', { item: 'arrows' }); s.act(s.b, 'buy', { item: 'arrows' }); s.advance(4000);
  assert.equal(s.room.status, 'finished'); assert.equal(s.room.winner, null);
  s.act(s.a, 'rematch'); assert.equal(s.room.status, 'finished'); s.act(s.b, 'rematch');
  assert.equal(s.room.status, 'briefing'); assert.deepEqual(s.room.teams[0].unlocks, {});
  s.act(s.a, 'briefed'); s.act(s.b, 'briefed');
  assert.equal(s.room.status, 'playing'); assert.equal(s.room.round, 1); assert.equal(s.room.finishedAt, null);
  assert.deepEqual(s.room.teams.map(p => p.hp), [RULES.hp, RULES.hp]); assert.deepEqual(s.room.teams.map(p => p.coins), [12, 12]);
  assert.ok(s.service.state(s.a.code, s.a.token));
});
test('reconnection preserves identity and purchases; a 90s absence gives a forfeit', () => {
  const s = setup(); s.act(s.a, 'buy', { item: 'arrows' }); s.advance(5000);
  assert.equal(s.service.state(s.a.code, s.a.token).teams[0].coins, 4);
  s.advance(89_999, false); s.service.state(s.a.code, s.a.token); assert.equal(s.room.status, 'playing');
  s.advance(1, false); assert.equal(s.room.status, 'finished'); assert.equal(s.room.winner, 0); assert.equal(s.room.endReason, 'disconnect');
});
test('waiting host can leave, then a new team can join and the remaining team hosts', () => {
  const service = new GameService(); const a = service.create('Équipe A'), b = service.join(a.code, 'Équipe B');
  service.action(a.code, a.token, { type: 'leave' }); const c = service.join(a.code, 'Équipe C');
  const state = service.state(c.code, c.token); assert.equal(state.host, 1); assert.equal(state.me, 0); assert.equal(state.teams.length, 2);
});
test('1500 rounds never repeat a question within the shuffled deck', () => {
  const s = setup(), ids = new Set(); s.room.deck = [];
  for (let i = 0; i < QUESTIONS.length; i++) { s.service.newQuestion(s.room); ids.add(s.room.question.id); }
  assert.equal(ids.size, QUESTIONS.length);
});

test('briefing pauses the game until both teams acknowledge, including after reconnect', () => {
  let clock = 1000000;
  const service = new GameService({ now: () => clock });
  const a = service.create('Alpha'), b = service.join(a.code, 'Bravo');
  const act = (p, type, extra = {}) => service.action(p.code, p.token, { type, ...extra });
  act(a, 'ready'); act(b, 'ready'); act(a, 'start');
  clock += 60000;
  const state = service.state(a.code, a.token);
  assert.equal(state.status, 'briefing'); assert.equal(state.question, null); assert.equal(state.round, 0);
  assert.throws(() => act(a, 'unlock', { item: 'arrows' }), /pas en cours/);
  act(a, 'briefed'); assert.equal(service.state(a.code, a.token).teams[0].briefed, true);
  const started = act(b, 'briefed');
  assert.equal(started.status, 'playing'); assert.equal(started.roundStartedAt, clock);
  assert.equal(started.answerUntil, clock + 25000);
});
test('briefing supports practice and leaving returns the remaining team to the lobby', () => {
  const service = new GameService();
  const a = service.create('Alpha'), b = service.join(a.code, 'Bravo');
  for (const p of [a, b]) service.action(p.code, p.token, { type: 'ready' });
  service.action(a.code, a.token, { type: 'start' });
  service.action(a.code, a.token, { type: 'leave' });
  const waiting = service.state(b.code, b.token);
  assert.equal(waiting.status, 'waiting'); assert.equal(waiting.host, 1); assert.equal(waiting.teams[0].ready, false);
  const demo = service.create('Démo', true);
  service.action(demo.code, demo.token, { type: 'ready' }); service.action(demo.code, demo.token, { type: 'start' });
  assert.equal(service.action(demo.code, demo.token, { type: 'briefed' }).status, 'playing');
});
test('server time sets reduced speed rewards and invalid answers cannot earn twice', () => {
  const fast = setup(), slow = setup();
  fast.advance(RULES.rewardStepMs - 1); slow.advance(24999);
  const f = fast.act(fast.a, 'answer', { round: 1, choice: fast.room.question.correct, elapsedMs: 24999 });
  const s = slow.act(slow.a, 'answer', { round: 1, choice: slow.room.question.correct, elapsedMs: 0 });
  assert.equal(f.answer.reward, RULES.maxReward); assert.equal(s.answer.reward, RULES.minReward);
  assert.equal(s.teams[0].coins, RULES.startingCoins + RULES.minReward); assert.equal(s.lastResult.elapsedMs, 24999);
  assert.throws(() => slow.act(slow.a, 'answer', { round: 1, choice: 0 }), /déjà/);
  const edge = setup(); edge.advance(RULES.rewardStepMs);
  assert.equal(edge.act(edge.a, 'answer', { round: 1, choice: edge.room.question.correct }).answer.reward, RULES.maxReward - 1);
  const expired = setup(); expired.advance(25000);
  assert.throws(() => expired.act(expired.a, 'answer', { round: 1, choice: expired.room.question.correct }), /écoulé/);
  assert.equal(expired.room.teams[0].coins, 12);
});
test('two answers skip the remaining timer with a three-second result, once only', () => {
  const s = setup(); s.advance(5000);
  s.act(s.a, 'answer', { round: 1, choice: s.room.question.correct });
  assert.equal(s.room.nextRoundAt, s.room.startedAt + 30000);
  const last = s.act(s.b, 'answer', { round: 1, choice: (s.room.question.correct + 1) % 4 });
  assert.equal(last.answersClosed, true); assert.equal(last.nextRoundAt, s.time + 3000);
  const coins = s.room.teams.map(p => p.coins), result = last.lastResult;
  s.advance(2999); assert.equal(s.room.round, 1);
  s.advance(1); assert.equal(s.room.round, 2);
  assert.deepEqual(s.room.teams.map(p => p.coins), coins.map(n => n + RULES.supply));
  const state = s.service.state(s.b.code, s.b.token);
  assert.equal(state.answer, null); assert.deepEqual(state.lastResult, result);
  assert.equal(state.answerUntil, s.time + 25000);
  s.service.state(s.a.code, s.a.token); s.service.tickAll();
  assert.deepEqual(s.room.teams.map(p => p.coins), coins.map(n => n + RULES.supply));
});
test('timeouts create one zero-coin result and keep the original next-round deadline', () => {
  const s = setup(); s.advance(25000);
  const first = s.service.state(s.a.code, s.a.token);
  assert.deepEqual(first.lastResult, { round: 1, correct: false, reward: 0, elapsedMs: 25000, answered: false });
  assert.equal(first.nextRoundAt, s.room.startedAt + 30000);
  s.advance(1000); assert.deepEqual(s.service.state(s.a.code, s.a.token).lastResult, first.lastResult);
  assert.equal(s.room.teams[0].coins, 12);
});
test('accelerated rounds do not accelerate siege or storm', () => {
  const s = setup();
  for (let i = 0; i < 14; i++) {
    const round = s.room.round, correct = s.room.question.correct;
    s.act(s.a, 'answer', { round, choice: correct }); s.act(s.b, 'answer', { round, choice: correct }); s.advance(3000);
  }
  assert.equal(s.room.round, 15); assert.equal(s.room.siege, false); assert.equal(s.room.storm, false);
  s.advance(RULES.siegeMs - (s.time - s.room.startedAt)); assert.equal(s.room.siege, true); assert.equal(s.room.storm, false);
  s.advance(RULES.stormMs - RULES.siegeMs); assert.equal(s.room.storm, true); assert.equal(s.room.teams[0].hp, RULES.hp);
  s.advance(10000); assert.equal(s.room.teams[0].hp, RULES.hp - RULES.stormDamage);
});
test('unlock charges once, is visible to the opponent, and firing waits for construction', () => {
  const s = setup({ unlocked: false }), player = s.room.teams[0];
  assert.throws(() => s.act(s.a, 'buy', { item: 'arrows' }), /Débloquez/);
  assert.throws(() => s.act(s.a, 'unlock', { item: 'catapult' }), /assez/);
  assert.throws(() => s.act(s.a, 'unlock', { item: 'shield' }), /n’existe/);
  s.act(s.a, 'unlock', { item: 'arrows' });
  assert.equal(player.coins, 6); assert.equal(player.stats.spent, 6); assert.equal(s.room.projectiles.length, 0);
  assert.throws(() => s.act(s.a, 'unlock', { item: 'arrows' }), /déjà/); assert.equal(player.coins, 6);
  const enemy = s.service.state(s.b.code, s.b.token).teams.find(p => p.id === player.id);
  assert.deepEqual(enemy.unlocks.arrows, { startedAt: s.time, readyAt: s.time + 5000 });
  assert.equal(enemy.coins, undefined); assert.equal(enemy.token, undefined);
  s.act(s.a, 'answer', { round: 1, choice: s.room.question.correct });
  s.advance(4999); assert.throws(() => s.act(s.a, 'buy', { item: 'arrows' }), /construction/);
  s.advance(1); s.act(s.a, 'buy', { item: 'arrows' });
  assert.equal(s.room.projectiles.length, 1); assert.equal(player.coins, 12 - 6 + RULES.maxReward - 8);
  s.advance(4000); assert.equal(s.room.teams[1].hp, RULES.hp - 12);
  assert.ok(s.service.state(s.a.code, s.a.token).teams[0].unlocks.arrows);
});
test('research and defense share the purchase cooldown', () => {
  const s = setup({ unlocked: false }); s.room.teams[0].coins = 100;
  s.act(s.a, 'unlock', { item: 'catapult' });
  assert.throws(() => s.act(s.a, 'unlock', { item: 'lightning' }), /prépare/);
  assert.throws(() => s.act(s.a, 'buy', { item: 'shield' }), /prépare/);
  s.advance(2000); s.act(s.a, 'buy', { item: 'shield' });
  assert.equal(s.room.teams[0].coins, 72); assert.equal(s.room.teams[0].shield, 18);
});
test('the question bank has unique prompts and eight balanced categories', () => {
  assert.equal(new Set(QUESTIONS.map(q => q.text)).size, 1500);
  assert.equal(new Set(QUESTIONS.map(q => q.id)).size, 1500);
  const counts = QUESTIONS.reduce((groups, q) => { (groups[q.category] ||= []).push(q); return groups; }, {});
  assert.equal(Object.keys(counts).length, 8); assert.ok(Object.values(counts).every(qs => qs.length >= 187 && qs.length <= 188));
});

test('repeated shots get more expensive per attack and per team, failed purchases do not increase price', () => {
  const s = setup(), p = s.room.teams[0], arrows = ITEMS.find(i => i.id === 'arrows'); p.coins = 200;
  s.act(s.a, 'buy', { item: 'arrows', cost: 0 });
  assert.equal(p.coins, 192); assert.equal(p.purchases.arrows, 1);
  assert.equal(s.service.state(s.a.code, s.a.token).teams[0].prices.arrows, 8 + arrows.costStep);
  assert.equal(s.service.state(s.b.code, s.b.token).teams[1].prices.arrows, 8);
  assert.throws(() => s.act(s.a, 'buy', { item: 'arrows' }), /prépare/);
  assert.equal(p.purchases.arrows, 1);
  s.advance(4000); s.act(s.a, 'buy', { item: 'arrows' });
  assert.equal(p.coins, 192 - 8 - arrows.costStep); assert.equal(p.purchases.arrows, 2);
  assert.equal(s.service.state(s.a.code, s.a.token).teams[0].prices.catapult, 18);
  s.advance(4000); p.coins = 0;
  assert.throws(() => s.act(s.a, 'buy', { item: 'arrows' }), /assez/);
  assert.equal(p.purchases.arrows, 2);
  p.coins = 100; s.act(s.a, 'buy', { item: 'shield' });
  assert.equal(s.service.state(s.a.code, s.a.token).teams[0].prices.shield, 10);
});
test('either team can pause; all combat timers freeze until both agree to resume', () => {
  const s = setup({ unlocked: false }); s.room.teams.forEach(p => { p.coins = 200; });
  s.act(s.a, 'unlock', { item: 'arrows' }); s.advance(5000);
  s.act(s.a, 'buy', { item: 'arrows' }); s.act(s.b, 'buy', { item: 'shield' });
  s.advance(2000); s.act(s.a, 'unlock', { item: 'catapult' });
  const paused = s.act(s.b, 'pause'), gameTime = paused.gameNow;
  assert.equal(paused.paused, true); assert.equal(paused.pausedBy, 1);
  const impactAt = paused.projectiles[0].impactAt, buildAt = s.room.teams[0].unlocks.catapult.readyAt;
  s.advance(120000);
  const frozen = s.service.state(s.a.code, s.a.token);
  assert.equal(frozen.gameNow, gameTime); assert.equal(frozen.projectiles[0].impactAt, impactAt);
  assert.equal(frozen.nextRoundAt, paused.nextRoundAt); assert.equal(s.room.teams[1].shield, 18);
  assert.equal(s.room.teams[0].unlocks.catapult.readyAt, buildAt);
  assert.throws(() => s.act(s.a, 'answer', { round: 1, choice: 0 }), /pause/);
  assert.throws(() => s.act(s.a, 'buy', { item: 'shield' }), /pause/);
  assert.throws(() => s.act(s.a, 'unlock', { item: 'lightning' }), /pause/);
  s.act(s.a, 'resume'); s.advance(60000); assert.equal(s.room.pausedAt !== null, true);
  const resumed = s.act(s.b, 'resume'); assert.equal(resumed.paused, false); assert.equal(resumed.gameNow, gameTime);
  assert.equal(s.room.pausedMs, 180000);
  assert.throws(() => s.act(s.a, 'buy', { item: 'arrows' }), /prépare/);
  s.advance(1999); assert.equal(s.room.teams[1].shield, 18);
  s.advance(1); assert.equal(s.room.teams[1].shield, 6); assert.equal(s.room.projectiles.length, 0);
  const answered = s.act(s.a, 'answer', { round: 1, choice: s.room.question.correct });
  assert.equal(answered.answer.elapsedMs, 9000); assert.equal(answered.answer.reward, RULES.maxReward - 1);
  const again = s.act(s.a, 'pause'); s.advance(30000); s.act(s.b, 'resume'); s.act(s.a, 'resume');
  assert.equal(s.service.gameNow(s.room), again.gameNow); assert.equal(s.room.pausedMs, 210000);
});
test('pause preserves the result interval, prevents disconnect forfeits and restores after reload', () => {
  const s = setup();
  for (const p of [s.a,s.b]) s.act(p, 'answer', { round: 1, choice: s.room.question.correct });
  s.advance(1000); const pause = s.act(s.a, 'pause');
  s.advance(180000, false); s.service.tickAll();
  assert.equal(s.room.status, 'playing'); assert.equal(s.room.round, 1);
  const restored = s.service.state(s.b.code, s.b.token);
  assert.equal(restored.paused, true); assert.equal(restored.gameNow, pause.gameNow); assert.equal(restored.answer.reward, RULES.maxReward);
  s.act(s.b, 'resume'); s.act(s.a, 'resume'); s.advance(1999); assert.equal(s.room.round, 1);
  s.advance(1); assert.equal(s.room.round, 2);
});
test('pause also freezes temporary defenses, bot actions, siege and the fifteen-minute deadline', () => {
  const s = setup(); s.advance(RULES.siegeMs - 1000);
  s.room.teams[0].coins = 100; s.act(s.a, 'buy', { item: 'shield' }); s.act(s.b, 'buy', { item: 'mirror' });
  s.act(s.a, 'pause'); s.advance(RULES.matchMs);
  assert.equal(s.room.siege, false); assert.equal(s.room.storm, false); assert.equal(s.room.teams[0].shield, 18);
  assert.ok(s.room.teams[1].mirrorUntil > s.service.gameNow(s.room));
  s.act(s.a, 'resume'); s.act(s.b, 'resume'); s.advance(1000); assert.equal(s.room.siege, true);
  s.advance(11000); assert.ok(s.room.teams[1].mirrorUntil <= s.service.gameNow(s.room));
  assert.equal(s.room.status, 'playing');
});
test('practice allows pause and resumes without waiting for an impossible bot click', () => {
  let clock = 1000000;
  const service = new GameService({ now: () => clock }); const a = service.create('Solo', true);
  const act = type => service.action(a.code, a.token, { type });
  act('ready'); act('start'); act('briefed'); act('pause');
  const room = service.room(a.code), initialUnlocks = structuredClone(room.teams[1].unlocks); clock += 180000; service.tickAll();
  assert.equal(room.teams[1].answer, null); assert.deepEqual(room.teams[1].unlocks, initialUnlocks);
  assert.equal(act('resume').paused, false);
});
test('the match ends at exactly fifteen active minutes and compares remaining HP', () => {
  for (const leading of [0,1,null]) {
    const s = setup(); if (leading !== null) s.room.teams[1-leading].hp -= 10;
    s.advance(RULES.matchMs + 10000);
    assert.equal(s.room.status, 'finished'); assert.equal(s.room.endReason, 'time'); assert.equal(s.room.winner, leading);
    assert.equal(s.room.finishedAt - s.room.startedAt, RULES.matchMs);
    assert.throws(() => s.act(s.a, 'pause'), /pas en cours/);
    assert.throws(() => s.act(s.a, 'buy', { item: 'arrows' }), /pas en cours/);
  }
});
test('a destruction exactly at the time limit is resolved before the HP comparison', () => {
  const s = setup(); s.advance(RULES.matchMs - 4000);
  s.room.teams[1].hp = 18; s.room.teams[0].coins = 100;
  s.act(s.a, 'buy', { item: 'arrows' }); s.advance(4000);
  assert.equal(s.room.winner, 0); assert.equal(s.room.endReason, 'destroyed');
});
test('colors are shared, validated, exclusive per team and survive rematches', () => {
  const s = setup(); const next = s.act(s.a, 'color', { color: 'purple' });
  assert.equal(next.teams[0].color, 'purple');
  assert.equal(s.service.state(s.b.code, s.b.token).teams[0].color, 'purple');
  assert.throws(() => s.act(s.b, 'color', { color: 'purple' }), /autre équipe/);
  for (const color of ['#bad', '<script>', null]) assert.throws(() => s.act(s.a, 'color', { color }), /n’existe/);
  assert.equal(s.room.teams[1].color, 'coral');
  s.act(s.a, 'buy', { item: 'arrows' }); s.act(s.b, 'leave');
  for (const p of [s.a,s.b]) s.act(p, 'rematch');
  assert.equal(s.room.teams[0].color, 'purple'); assert.deepEqual(s.room.teams[0].purchases, {});
  s.act(s.a, 'briefed'); s.act(s.b, 'briefed');
  assert.equal(s.service.state(s.a.code, s.a.token).teams[0].prices.arrows, 8);
});
test('new teams get an available color even after the old host leaves', () => {
  const service = new GameService(), a = service.create('Alpha'), b = service.join(a.code, 'Bravo');
  service.action(a.code, a.token, { type: 'leave' });
  service.action(b.code, b.token, { type: 'color', color: 'sage' });
  const c = service.join(a.code, 'Charlie');
  const teams = service.state(c.code, c.token).teams;
  assert.notEqual(teams[0].color, teams[1].color);
});

test('spectators are read-only, do not occupy a team and cannot see private resources or early solutions', () => {
  const s = setup(); const publicState = s.service.watch(s.a.code);
  assert.equal(publicState.me, null); assert.equal(publicState.spectator, true);
  assert.equal(publicState.answer, null); assert.equal(publicState.lastResult, null);
  assert.equal(publicState.question.correct, undefined); assert.equal(publicState.question.explanation, undefined);
  for (const p of publicState.teams) for (const key of ['token','answer','coins','purchases','prices','cooldowns','nextAction']) assert.equal(key in p, false);
  s.act(s.a, 'answer', { round: 1, choice: s.room.question.correct });
  assert.equal(s.service.watch(s.a.code).question.correct, undefined);
  s.act(s.b, 'answer', { round: 1, choice: (s.room.question.correct + 1) % 4 });
  const reveal = s.service.watch(s.a.code);
  assert.equal(reveal.question.correct, s.room.question.correct); assert.ok(reveal.question.explanation);
  for (const token of [s.a.token,s.b.token]) assert.equal(JSON.stringify(reveal).includes(token), false);
  s.advance(RULES.resultMs); assert.equal(s.service.watch(s.a.code).question.correct, undefined);
  for (const type of ['answer','buy','unlock','pause','resume','color','leave','rematch']) assert.throws(() => s.service.action(s.a.code, 'spectator', { type }), /accès/);
  const other = new GameService(); const a = other.create('Alpha');
  other.watch(a.code); other.watch(a.code); other.join(a.code, 'Bravo');
  assert.equal(other.watch(a.code).teams.length, 2);
});
test('spectator polling cannot prevent a disconnect forfeit or extend the room lifetime', () => {
  const s = setup(), initial = s.room.updatedAt;
  s.advance(89999, false); s.service.watch(s.a.code);
  assert.equal(s.room.updatedAt, initial);
  assert.equal(s.room.teams[0].lastSeen, s.room.startedAt);
  s.service.state(s.a.code, s.a.token); s.advance(1, false);
  assert.equal(s.service.watch(s.a.code).endReason, 'disconnect');
  assert.equal(s.room.winner, 0);
  assert.throws(() => s.service.watch('123'), /6 lettres/);
  assert.throws(() => s.service.watch('AAAAAA'), /introuvable/);
});
test('spectators follow timeouts, pauses, results and rematches without receiving player rights', () => {
  const s = setup(); s.advance(25000);
  assert.equal(s.service.watch(s.a.code).question.correct, s.room.question.correct);
  const paused = s.act(s.a, 'pause'); s.advance(120000, false);
  const watched = s.service.watch(s.a.code);
  assert.equal(watched.paused, true); assert.equal(watched.gameNow, paused.gameNow);
  assert.equal(watched.lastResult, null); assert.equal(watched.spectator, true);
  s.act(s.a, 'resume'); s.act(s.b, 'resume');
  s.act(s.a, 'leave'); const final = s.service.watch(s.a.code);
  assert.equal(final.status, 'finished'); assert.equal(final.question.correct, s.room.question.correct);
  s.act(s.a, 'rematch'); s.act(s.b, 'rematch');
  const briefing = s.service.watch(s.a.code);
  assert.equal(briefing.status, 'briefing'); assert.equal(briefing.question, null); assert.equal(briefing.spectator, true);
});
