import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import pg from 'pg';
import QRCode from 'qrcode';

test('Vercel entrypoint: rewritten routes, parsed bodies, persistent sessions, QR and protected cleanup', { skip: !process.env.TEST_DATABASE_URL }, async t => {
  const schema = `bastions_api_${Date.now()}`;
  const admin = new pg.Pool({ connectionString: process.env.TEST_DATABASE_URL });
  await admin.query(`CREATE SCHEMA ${schema}`);
  const url = new URL(process.env.TEST_DATABASE_URL);
  url.searchParams.set('options', `-c search_path=${schema}`);
  const setup = new pg.Pool({ connectionString: url.href });
  await setup.query(await readFile(new URL('../sql/schema.sql', import.meta.url), 'utf8')); await setup.end();
  process.env.DATABASE_URL = url.href;
  process.env.CRON_SECRET = 'private-test-secret';
  process.env.PUBLIC_URL = 'https://bastions.example/';
  const { default: endpoint } = await import('../api/index.js');
  const server = http.createServer(async (req, res) => {
    // Emulate the platform's JSON body parser and routing query parameter.
    if (req.method === 'POST') { const chunks = []; for await (const chunk of req) chunks.push(chunk); req.body = JSON.parse(Buffer.concat(chunks)); }
    await endpoint(req, res);
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(async () => { await new Promise(resolve => server.close(resolve)); await admin.query(`DROP SCHEMA ${schema} CASCADE`); await admin.end(); });
  const base = `http://127.0.0.1:${server.address().port}/api?route=`;
  const created = await fetch(base + '/api/rooms', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: 'Vercel team' }) });
  assert.equal(created.status, 201);
  const credentials = await created.json();
  const state = await fetch(base + `/api/state&code=${credentials.code}`, { headers: { Authorization: `Bearer ${credentials.token}` } });
  assert.equal(state.status, 200); assert.equal((await state.json()).teams[0].name, 'Vercel team');
  const qr = await fetch(base + '/api/home-qr');
  assert.equal(await qr.text(), await QRCode.toString('https://bastions.example/', { type: 'svg', margin: 4, errorCorrectionLevel: 'M' }));
  const art = await fetch(base + '/assets/arena.svg&left=purple&right=blue');
  assert.match(await art.text(), /#b59bea/);
  assert.equal((await fetch(base + '/api/cleanup')).status, 403);
  assert.equal((await fetch(base + '/api/cleanup', { headers: { Authorization: 'Bearer private-test-secret' } })).status, 200);
  assert.equal((await fetch(base + '/api/rooms', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: 'x'.repeat(5000) }) })).status, 413);
});
