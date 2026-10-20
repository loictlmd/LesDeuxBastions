import { cp, mkdir, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export function deploymentConfig(value) {
  if (!value) throw new Error('Ajoutez GAME_SERVER_URL dans Vercel : adresse HTTPS du serveur Render.');
  let upstream;
  try { upstream = new URL(value); } catch { throw new Error('GAME_SERVER_URL doit être une adresse HTTPS valide.'); }
  if (upstream.protocol !== 'https:' || upstream.username || upstream.password || upstream.search || upstream.hash || upstream.pathname !== '/') {
    throw new Error('GAME_SERVER_URL doit contenir uniquement l’origine HTTPS du serveur, sans chemin ni identifiants.');
  }
  return {
    version: 3,
    routes: [
      { src: '/api/(.*)', dest: `${upstream.origin}/api/$1`, headers: { 'Cache-Control': 'no-store' } },
      // The Node server renders team colours dynamically; do not serve the default SVG here.
      { src: '/assets/arena\\.svg', dest: `${upstream.origin}/assets/arena.svg`, headers: { 'Cache-Control': 'no-cache' } },
      { handle: 'filesystem' }
    ]
  };
}
export async function buildVercel({ serverUrl = process.env.GAME_SERVER_URL, output = path.join(project, '.vercel/output') } = {}) {
  const config = deploymentConfig(serverUrl);
  await rm(output, { recursive: true, force: true });
  await mkdir(output, { recursive: true });
  await cp(path.join(project, 'public'), path.join(output, 'static'), { recursive: true });
  await writeFile(path.join(output, 'config.json'), JSON.stringify(config, null, 2) + '\n');
  return config;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { await buildVercel(); console.log('Interface Vercel prête ; les parties utilisent GAME_SERVER_URL.'); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
