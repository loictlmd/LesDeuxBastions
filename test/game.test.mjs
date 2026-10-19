import test from 'node:test';
import assert from 'node:assert/strict';
import { GameService } from '../src/game.mjs';
import { QUESTIONS } from '../src/questions.mjs';

function setup() {
  let clock = 1_000_000;
  const service = new GameService({ now: () => clock });
  const a = service.create('Les Sauges'), b = service.join(a.code, 'Les Coraux');
  const act = (who, type, extra = {}) => service.action(who.code, who.token, { type, ...extra });
  act(a, 'ready'); act(b, 'ready'); act(a, 'start');
  const room = service.room(a.code);
  return { service, a, b, room, act, advance(ms, connected = true) { clock += ms; if (connected) room.teams.forEach(p => { p.lastSeen = clock; }); service.tickAll(); }, get time() { return clock; } };
}
test('72 questions, four distinct options and a valid solution', () => { assert.equal(QUESTIONS.length, 72); for (const q of QUESTIONS) { assert.equal(q.options.length, 4); assert.equal(new Set(q.options).size, 4); assert.ok(q.correct >= 0 && q.correct < 4); assert.ok(q.explanation); } });
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
  assert.equal(state.teams[0].coins, 24); assert.equal(state.answer.correct, true);
  assert.throws(() => s.act(s.a, 'answer', { round: 1, choice: correct }), /déjà/);
  s.act(s.b, 'answer', { round: 1, choice: (correct + 1) % 4 }); assert.equal(s.room.teams[1].coins, 12);
  s.advance(30_000); assert.equal(s.room.round, 2); assert.equal(s.room.teams[0].coins, 27);
  assert.throws(() => s.act(s.a, 'answer', { round: 1, choice: 0 }), /nouvelle/);
  s.advance(25_000); assert.throws(() => s.act(s.a, 'answer', { round: 2, choice: 0 }), /écoulé/);
  assert.equal(s.service.state(s.a.code, s.a.token).question.correct, s.room.question.correct);
});
test('attack impacts only at its scheduled time and defense can react', () => {
  const s = setup(); s.act(s.a, 'buy', { item: 'arrows' }); s.act(s.b, 'buy', { item: 'shield' });
  s.advance(3999); assert.equal(s.room.teams[1].hp, 120); assert.equal(s.room.teams[1].shield, 18);
  s.advance(1); assert.equal(s.room.teams[1].hp, 120); assert.equal(s.room.teams[1].shield, 6); assert.equal(s.room.projectiles.length, 0);
});
test('cooldowns and lack of funds prevent duplicate spending', () => {
  const s = setup(); s.act(s.a, 'buy', { item: 'arrows' });
  assert.throws(() => s.act(s.a, 'buy', { item: 'arrows' }), /prépare/);
  assert.equal(s.room.teams[0].coins, 4); s.advance(4000);
  assert.throws(() => s.act(s.a, 'buy', { item: 'arrows' }), /assez/); assert.equal(s.room.teams[0].coins, 4);
});
test('piercing lightning ignores shields', () => {
  const s = setup(); s.room.teams[0].coins = 100; s.act(s.a, 'buy', { item: 'lightning' }); s.act(s.b, 'buy', { item: 'shield' }); s.advance(6000);
  assert.equal(s.room.teams[1].hp, 102); assert.equal(s.room.teams[1].shield, 18);
});
test('sabotage breaks shields before its regular damage', () => {
  const s = setup(); s.act(s.a, 'buy', { item: 'sabotage' }); s.act(s.b, 'buy', { item: 'shield' }); s.advance(5000);
  assert.equal(s.room.teams[1].hp, 114); assert.equal(s.room.teams[1].shield, 0);
});
test('mirror blocks and reflects 40 percent once without recursion', () => {
  const s = setup(); s.act(s.a, 'buy', { item: 'arrows' }); s.act(s.b, 'buy', { item: 'mirror' }); s.advance(4000);
  assert.equal(s.room.teams[0].hp, 115); assert.equal(s.room.teams[1].hp, 113); assert.equal(s.room.teams[1].mirrorUntil, 0);
});
test('shield cap, expiration, repair cap and cooldown', () => {
  const s = setup(); const player = s.room.teams[0]; player.coins = 200;
  assert.throws(() => s.act(s.a, 'buy', { item: 'repair' }), /pleine forme/);
  s.act(s.a, 'buy', { item: 'shield' }); s.advance(8000); s.act(s.a, 'buy', { item: 'shield' }); assert.equal(player.shield, 36);
  s.advance(8000); assert.throws(() => s.act(s.a, 'buy', { item: 'shield' }), /36/);
  s.advance(37_000); assert.equal(player.shield, 0);
  player.hp = 110; s.act(s.a, 'buy', { item: 'repair' }); assert.equal(player.hp, 120); player.hp = 110;
  s.advance(3000); assert.throws(() => s.act(s.a, 'buy', { item: 'repair' }), /prépare/);
});
test('siege multiplier applies to new attacks from 4 minutes', () => {
  const s = setup(); s.advance(240_000); assert.equal(s.room.round, 9);
  s.act(s.a, 'buy', { item: 'arrows' }); assert.equal(s.room.projectiles[0].damage, 18);
});
test('storm prevents infinite defense and handles simultaneous destruction', () => {
  const s = setup(); s.advance(360_000); assert.equal(s.room.round, 13);
  s.room.teams[0].hp = 119;
  assert.throws(() => s.act(s.a, 'buy', { item: 'repair' }), /fermées/);
  s.room.teams.forEach(p => { p.hp = 120; p.shield = 36; p.shieldUntil = s.time + 200_000; });
  s.advance(150_000); assert.equal(s.room.status, 'finished'); assert.equal(s.room.winner, null); assert.deepEqual(s.room.teams.map(p => p.hp), [0, 0]);
});
test('simultaneous lethal attacks give a draw, and both votes restart cleanly', () => {
  const s = setup(); s.room.teams.forEach(p => { p.hp = 12; });
  s.act(s.a, 'buy', { item: 'arrows' }); s.act(s.b, 'buy', { item: 'arrows' }); s.advance(4000);
  assert.equal(s.room.status, 'finished'); assert.equal(s.room.winner, null);
  s.act(s.a, 'rematch'); assert.equal(s.room.status, 'finished'); s.act(s.b, 'rematch');
  assert.equal(s.room.status, 'playing'); assert.equal(s.room.round, 1); assert.equal(s.room.finishedAt, null);
  assert.deepEqual(s.room.teams.map(p => p.hp), [120, 120]); assert.deepEqual(s.room.teams.map(p => p.coins), [12, 12]);
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
test('72 rounds never repeat a question within the shuffled deck', () => {
  const s = setup(), ids = new Set(); s.room.deck = [];
  for (let i = 0; i < 72; i++) { s.service.newQuestion(s.room); ids.add(s.room.question.id); }
  assert.equal(ids.size, 72);
});
