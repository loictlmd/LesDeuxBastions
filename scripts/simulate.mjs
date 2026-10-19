import { GameService } from '../src/game.mjs';
// Simulations de stratégies simples : une aide à l'équilibrage, pas un test utilisateur.
let seed = 20261019;
const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
function match(strategies, skill) {
  let time = 1_000_000;
  const game = new GameService({ now: () => time });
  const a = game.create('Sauge'), b = game.join(a.code, 'Corail');
  for (const p of [a, b]) game.action(p.code, p.token, { type: 'ready' });
  game.action(a.code, a.token, { type: 'start' });
  const room = game.room(a.code), started = time;
  for (let step = 0; step < 1100 && room.status === 'playing'; step++) {
    time += 500;
    room.teams.forEach(p => { p.lastSeen = time; });
    game.tickAll();
    if (room.status !== 'playing') break;
    // Alternating order avoids favoring the first team at every step.
    for (const i of step % 2 ? [0, 1] : [1, 0]) {
      const player = room.teams[i], opponent = room.teams[1 - i];
      if (!player.answer && time >= room.startedAt + (room.round - 1) * 30000 + 10_000 && time < room.startedAt + (room.round - 1) * 30000 + 25_000) game.answer(room, player, room.round, random() < skill[i] ? room.question.correct : (room.question.correct + 1) % 4);
      const incoming = room.projectiles.filter(p => p.to === player.id && p.impactAt - time <= 3000);
      let items;
      if (strategies[i] === 'defense') items = [...(incoming.length && player.shield < 18 ? ['shield'] : []), ...(player.hp <= 95 ? ['repair'] : []), 'catapult'];
      else if (strategies[i] === 'arrows') items = ['arrows'];
      else items = [...(incoming.some(p => p.damage >= 24) && player.shield < 6 ? ['shield'] : []), ...(opponent.shield >= 18 ? ['lightning'] : ['catapult'])];
      for (const item of items) { try { game.buy(room, player, item); break; } catch { /* Wait for funds or a cooldown. */ } }
    }
  }
  return { seconds: (time - started) / 1000, winner: room.winner, status: room.status };
}
const cases = [
  { strategies: ['balanced', 'balanced'], skill: [.65, .65] },
  { strategies: ['arrows', 'balanced'], skill: [.65, .65] },
  { strategies: ['defense', 'balanced'], skill: [.65, .65] },
  { strategies: ['balanced', 'balanced'], skill: [.8, .4] },
  { strategies: ['balanced', 'balanced'], skill: [0, 0] }
];
const output = cases.map(c => {
  const results = Array.from({ length: 100 }, () => match(c.strategies, c.skill));
  const durations = results.map(r => r.seconds).sort((a, b) => a - b);
  return { strategies: c.strategies, correctProbability: c.skill, games: results.length, winsA: results.filter(r => r.winner === 0).length, winsB: results.filter(r => r.winner === 1).length, draws: results.filter(r => r.winner === null).length, medianSeconds: durations[50], maxSeconds: durations.at(-1), allFinished: results.every(r => r.status === 'finished') };
});
console.log(JSON.stringify(output, null, 2));
if (output.some(r => !r.allFinished)) process.exitCode = 1;
