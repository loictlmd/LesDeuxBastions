import { existsSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { createInterface } from 'node:readline';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { createGameServer } from '../server.mjs';

const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const executable = process.platform === 'win32' ? 'ngrok.exe' : 'ngrok';
const candidates = [
  process.env.NGROK_PATH,
  path.join(project, 'tools', executable),
  path.join(project, executable),
  path.join(os.tmpdir(), 'bastions-ngrok', executable),
  path.join(os.tmpdir(), 'ngrok', executable),
  process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, 'Microsoft', 'WinGet', 'Links', executable),
  ...(process.env.PATH || '').split(path.delimiter).filter(Boolean).map(dir => path.join(dir, executable))
];
const ngrokPath = candidates.find(candidate => candidate && existsSync(candidate));
let tunnel, publicUrl = null, stopping = false, opened = false;
const server = createGameServer({ getPublicUrl: () => publicUrl });
const port = Number(process.env.PORT || 3000);

function openBrowser(url) {
  if (opened || process.argv.includes('--no-open')) return;
  opened = true;
  // The URL comes from ngrok and is restricted to an HTTPS origin before opening.
  const command = process.platform === 'win32' ? 'rundll32.exe' : process.platform === 'darwin' ? 'open' : 'xdg-open';
  const args = process.platform === 'win32' ? ['url.dll,FileProtocolHandler', url] : [url];
  const browser = spawn(command, args, { stdio: 'ignore' });
  browser.on('error', () => console.log(`Ouvrez cette adresse dans votre navigateur : ${url}`));
  browser.unref();
}
function localFallback(message) {
  if (stopping) return;
  publicUrl = null;
  console.error(`\n${message}\nLe jeu reste disponible localement : http://localhost:${server.address().port}`);
  console.log('Installation et configuration ngrok : README.md');
  openBrowser(`http://localhost:${server.address().port}`);
}
function stop(code = 0) {
  if (stopping) return;
  stopping = true;
  if (tunnel && tunnel.exitCode === null) tunnel.kill();
  server.close();
  server.closeAllConnections();
  process.exitCode = code;
}

server.on('error', error => {
  console.error(error.code === 'EADDRINUSE'
    ? `Le port ${port} est déjà utilisé. Arrêtez l’ancien serveur avant de relancer ce fichier.`
    : `Impossible de lancer le jeu : ${error.message}`);
  stop(1);
});
process.once('SIGINT', () => stop());
process.once('SIGTERM', () => stop());
process.on('exit', () => { if (tunnel && tunnel.exitCode === null) tunnel.kill(); });

if (!Number.isInteger(port) || port < 0 || port > 65535) {
  console.error('PORT doit être un nombre entre 1 et 65535 (0 pour un port automatique).');
  stop(1);
} else server.listen(port, '0.0.0.0', () => {
  const actualPort = server.address().port;
  console.log(`\nLES DEUX BASTIONS\nJeu démarré : http://localhost:${actualPort}\nCtrl+C arrête le jeu et son tunnel.\n`);
  if (!ngrokPath) return localFallback('ngrok est introuvable. Placez ngrok.exe dans tools, ou indiquez son chemin avec NGROK_PATH.');
  console.log('Connexion à ngrok… Gardez cette fenêtre ouverte.');
  tunnel = spawn(ngrokPath, ['http', `http://localhost:${actualPort}`, '--log', 'stdout', '--log-format', 'json'], {
    cwd: project, stdio: ['ignore', 'pipe', 'pipe']
  });
  tunnel.on('error', error => localFallback(`Impossible de lancer ngrok : ${error.message}`));
  tunnel.on('exit', code => localFallback(`Le tunnel ngrok s’est arrêté (code ${code ?? 'signal'}). Vérifiez les messages ci-dessus et votre authtoken.`));
  // No shell, no token argument and no configuration file copied into the repository.
  const lines = createInterface({ input: tunnel.stdout });
  lines.on('line', line => {
    let log;
    try { log = JSON.parse(line); } catch { console.log(`[ngrok] ${line}`); return; }
    if (log.url && log.msg === 'started tunnel') {
      try {
        const url = new URL(log.url);
        if (url.protocol !== 'https:' || url.username || url.password || url.port || !/^[a-z0-9.-]+$/i.test(url.hostname)) return;
        publicUrl = url.origin;
        console.log(`\nLIEN INTERNET À PARTAGER : ${publicUrl}\nOuvrez ce même lien sur les deux téléphones.\n`);
        openBrowser(publicUrl);
      } catch { /* Ignore messages that do not contain a usable URL. */ }
    } else if (log.lvl === 'eror' || log.lvl === 'error' || log.lvl === 'warn') {
      console.error(`[ngrok] ${log.msg || 'Connexion interrompue'}${log.err ? ` : ${log.err}` : ''}`);
    }
  });
  tunnel.stderr.on('data', chunk => process.stderr.write(chunk));
});
