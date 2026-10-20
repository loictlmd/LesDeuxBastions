import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, readdir, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { buildVercel, deploymentConfig } from '../scripts/build-vercel.mjs';
import { createGameServer } from '../server.mjs';

test('Vercel build validates its backend and includes static assets plus uncached API and coloured arena routes', async t => {
  for (const value of [undefined, 'wrong', 'http://example.com', 'https://user:password@example.com', 'https://example.com/api', 'https://example.com/?key=secret']) assert.throws(() => deploymentConfig(value));
  const output = await mkdtemp(path.join(os.tmpdir(), 'bastions-vercel-'));
  t.after(() => rm(output, { recursive: true, force: true }));
  const config = await buildVercel({ serverUrl: 'https://bastions-example.onrender.com', output });
  assert.equal(config.version, 3);
  assert.equal(config.routes[0].dest, 'https://bastions-example.onrender.com/api/$1');
  assert.equal(config.routes[0].headers['Cache-Control'], 'no-store');
  assert.equal(config.routes[1].dest, 'https://bastions-example.onrender.com/assets/arena.svg');
  assert.ok(new RegExp(`^${config.routes[1].src}$`).test('/assets/arena.svg'));
  assert.match(await readFile(path.join(output, 'static/index.html'), 'utf8'), /language-button/);
  assert.match(await readFile(path.join(output, 'static/i18n.js'), 'utf8'), /localizeState/);
  assert.ok(!(await readdir(output)).includes('src'));
  assert.deepEqual(JSON.parse(await readFile(path.join(output, 'config.json'), 'utf8')), config);
});
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
