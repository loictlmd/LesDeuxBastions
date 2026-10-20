import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, chmod, rm } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { createServer } from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// The fake executable exercises process management without an ngrok account or external tunnel.
async function launch(t, { fail = false, port = '0' } = {}) {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'bastions launcher '));
  const fake = path.join(dir, 'fake ngrok');
  await writeFile(fake, `#!${process.execPath}\n${fail ? "console.error('FAKE_AUTH_FAILURE'); process.exit(1);" : `
    if (process.argv[2] !== 'http' || new URL(process.argv[3]).hostname !== 'localhost') process.exit(2);
    console.log(JSON.stringify({msg:'started tunnel',url:'https://bastions-test.example'}));
    setInterval(()=>{},1000);
  `}`);
  await chmod(fake, 0o755);
  const child = spawn(process.execPath, ['scripts/launch.mjs', '--no-open'], { cwd: project, env: { ...process.env, NGROK_PATH: fake, PORT: port }, stdio: ['ignore', 'pipe', 'pipe'] });
  let output = '';
  child.stdout.on('data', chunk => { output += chunk; }); child.stderr.on('data', chunk => { output += chunk; });
  const closed = once(child, 'close');
  t.after(async () => { if (child.exitCode === null && child.signalCode === null) child.kill('SIGTERM'); await closed; await rm(dir, { recursive: true, force: true }); });
  const waitFor = async pattern => {
    const deadline = Date.now() + 5000;
    while (!pattern.test(output) && Date.now() < deadline && child.exitCode === null) await new Promise(resolve => setTimeout(resolve, 25));
    assert.match(output, pattern);
    return output;
  };
  return { child, closed, waitFor, base: () => output.match(/Jeu démarré : (http:\/\/localhost:\d+)/)?.[1] };
}
test('launcher starts server before tunnel, publishes its URL and stops both processes', { skip: process.platform === 'win32' }, async t => {
  const run = await launch(t); await run.waitFor(/LIEN INTERNET À PARTAGER/);
  const base = run.base();
  assert.equal((await fetch(base)).status, 200);
  assert.equal((await (await fetch(base + '/api/network')).json()).publicUrl, 'https://bastions-test.example');
  run.child.kill('SIGTERM'); await run.closed;
  await assert.rejects(fetch(base));
});
test('launcher keeps the local game available and explains an ngrok failure', { skip: process.platform === 'win32' }, async t => {
  const run = await launch(t, { fail: true }); await run.waitFor(/Le tunnel ngrok s’est arrêté/);
  assert.equal((await fetch(run.base())).status, 200);
  assert.equal((await (await fetch(run.base() + '/api/network')).json()).publicUrl, null);
  await run.waitFor(/FAKE_AUTH_FAILURE/);
});
test('an occupied server port prevents launcher from starting a tunnel', { skip: process.platform === 'win32' }, async t => {
  const occupied = createServer(); await new Promise(resolve => occupied.listen(0, '0.0.0.0', resolve));
  t.after(() => new Promise(resolve => occupied.close(resolve)));
  const run = await launch(t, { port: String(occupied.address().port) });
  const [code] = await run.closed; assert.equal(code, 1);
  const output = await run.waitFor(/déjà utilisé/); assert.doesNotMatch(output, /LIEN INTERNET À PARTAGER/);
});
