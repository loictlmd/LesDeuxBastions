import test from 'node:test';
import assert from 'node:assert/strict';
import { createGameServer } from '../server.mjs';

test('the server permits only explicitly configured frontend origins in addition to its own origin', async t => {
  const server = createGameServer({ allowedOrigins: ['https://bastions.example.vercel.app'] });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  const base = `http://127.0.0.1:${server.address().port}`;
  const create = origin => fetch(base + '/api/rooms', { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' }, body: JSON.stringify({ name: 'Team' }) });
  assert.equal((await create('https://other.vercel.app')).status, 403);
  assert.equal((await create('https://bastions.example.vercel.app.attacker.example')).status, 403);
  const result = await create('https://bastions.example.vercel.app'); assert.equal(result.status, 201);
  const credentials = await result.json(); assert.ok(credentials.token);
  const state = await fetch(base + `/api/state?code=${credentials.code}`, { headers: { Origin: 'https://bastions.example.vercel.app' } });
  assert.equal(state.status, 401);
  assert.equal((await create(base)).status, 201);
});
