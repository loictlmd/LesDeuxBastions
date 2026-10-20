import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import pg from 'pg';
import { DatabaseGameService } from '../src/database.mjs';

// Use a disposable database only; the test creates its own isolated schema.
test('Postgres: independent instances, atomic actions, expiry, rematch and rollback', { skip: !process.env.TEST_DATABASE_URL }, async t => {
  const schema = `bastions_test_${Date.now()}`;
  const admin = new pg.Pool({ connectionString: process.env.TEST_DATABASE_URL });
  await admin.query(`CREATE SCHEMA ${schema}`);
  const options = { connectionString: process.env.TEST_DATABASE_URL, options: `-c search_path=${schema}`, max: 4 };
  const poolA = new pg.Pool(options), poolB = new pg.Pool(options);
  t.after(async () => { await poolA.end(); await poolB.end(); await admin.query(`DROP SCHEMA ${schema} CASCADE`); await admin.end(); });
  await poolA.query(await readFile(new URL('../sql/schema.sql', import.meta.url), 'utf8'));
  let now = 1_000_000;
  const a = new DatabaseGameService(poolA, { now: () => now });
  const b = new DatabaseGameService(poolB, { now: () => now });
  const first = await a.create('Équipe A');
  const joins = await Promise.allSettled([a.join(first.code, 'Équipe B'), b.join(first.code, 'Équipe C')]);
  assert.equal(joins.filter(r => r.status === 'fulfilled').length, 1);
  const second = joins.find(r => r.status === 'fulfilled').value;
  const action = (service, player, type, details = {}) => service.action(player.code, player.token, { type, ...details });
  await Promise.all([action(a, first, 'ready'), action(b, second, 'ready')]);
  await action(a, first, 'start');
  await Promise.all([action(a, first, 'briefed'), action(b, second, 'briefed')]);
  const room = (await poolA.query('SELECT state FROM bastion_rooms WHERE code=$1', [first.code])).rows[0].state;
  assert.equal(typeof room.deck[0], 'number');
  const duplicate = await Promise.allSettled([
    action(a, first, 'answer', { round: 1, choice: room.question.correct }),
    action(b, first, 'answer', { round: 1, choice: room.question.correct })
  ]);
  assert.equal(duplicate.filter(r => r.status === 'fulfilled').length, 1);
  assert.equal((await b.state(first.code, first.token)).teams[0].coins, 18);
  const watch = await b.watch(first.code);
  assert.equal(watch.question.correct, undefined);
  assert.ok(watch.teams.every(p => !('token' in p) && !('coins' in p)));
  await action(b, second, 'answer', { round: 1, choice: room.question.correct });
  assert.equal((await a.watch(first.code)).answersClosed, true);
  const buys = await Promise.allSettled([action(a, first, 'unlock', { item: 'arrows' }), action(b, first, 'unlock', { item: 'arrows' })]);
  assert.equal(buys.filter(r => r.status === 'fulfilled').length, 1);
  assert.equal((await a.state(first.code, first.token)).teams[0].coins, 12);
  const paused = await action(a, first, 'pause'); now += 120_000;
  assert.equal((await b.state(first.code, first.token)).gameNow, paused.gameNow);
  await action(a, first, 'resume'); await action(b, second, 'resume');
  assert.equal((await b.state(first.code, first.token)).paused, false);
  now += 6000;
  const shot = await action(a, first, 'buy', { item: 'arrows' }); assert.equal(shot.projectiles.length, 1);
  now += 4000;
  assert.equal((await b.state(first.code, first.token)).teams[1].hp, 288);
  await assert.rejects(a.state(first.code, 'wrong-token'), { status: 401 });
  await action(b, second, 'leave');
  await Promise.all([action(a, first, 'rematch'), action(b, second, 'rematch')]);
  assert.equal((await a.state(first.code, first.token)).status, 'briefing');
  // A failed transaction cannot leak mutations.
  await assert.rejects(a.transaction(async client => { await client.query('DELETE FROM bastion_rooms'); throw new Error('rollback'); }));
  assert.equal((await b.state(first.code, first.token)).status, 'briefing');
  now += 7_200_001;
  await assert.rejects(b.watch(first.code), { status: 404 });
  await a.cleanup();
  assert.equal((await poolA.query('SELECT count(*) FROM bastion_rooms')).rows[0].count, '0');
  const practice = await a.create('Solo', true);
  await action(a, practice, 'ready'); await action(a, practice, 'start'); await action(a, practice, 'briefed');
  now += 10_000;
  assert.equal((await b.state(practice.code, practice.token)).teams[1].answered, true);
  await action(a, practice, 'leave');
  const expiry = (await poolA.query('SELECT expires_at FROM bastion_rooms WHERE code=$1', [practice.code])).rows[0].expires_at;
  now += 1_000_000; await b.state(practice.code, practice.token);
  assert.equal((await poolA.query('SELECT expires_at FROM bastion_rooms WHERE code=$1', [practice.code])).rows[0].expires_at, expiry);
  now += 800_001; await assert.rejects(a.watch(practice.code), { status: 404 });
  await b.cleanup();
  assert.equal((await poolA.query('SELECT count(*) FROM bastion_rooms')).rows[0].count, '0');
});
