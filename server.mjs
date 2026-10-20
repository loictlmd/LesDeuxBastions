import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import os from 'node:os';
import { spawn } from 'node:child_process';
import QRCode from 'qrcode';
import { TEAM_COLORS } from './src/catalog.mjs';
import { GameService, GameError } from './src/game.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), 'public');
export function createRequestHandler({ service = new GameService(), getPublicUrl = () => null, allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',').map(value => value.trim()).filter(Boolean), getPort = () => 3000 } = {}) {
  const limits = new Map();
  return async (req, res) => {
    const send = (status, value) => { res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(value)); };
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'same-origin');
    res.setHeader('Content-Security-Policy', "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'");
    try {
      const url = new URL(req.url, 'http://localhost');
      if (url.pathname.startsWith('/api/')) {
        if (req.headers.origin && new URL(req.headers.origin).host !== req.headers.host && !allowedOrigins.includes(new URL(req.headers.origin).origin)) throw new GameError('Origine non autorisée.', 403);
        const ip = process.env.VERCEL ? req.headers['x-real-ip'] || req.socket?.remoteAddress : req.socket.remoteAddress;
        if (limits.size > 10000) for (const [key, value] of limits) if (Date.now() - value.at > 60_000) limits.delete(key);
        const budget = req.method === 'GET' ? (url.pathname === '/api/watch' ? 'watch' : 'read') : 'write';
        const key = `${ip}:${budget}`;
        const now = Date.now(); const limit = limits.get(key) || { at: now, count: 0 };
        if (now - limit.at > 60_000) { limit.at = now; limit.count = 0; }
        limit.count++; limits.set(key, limit);
        if (limit.count > ({ watch: 3000, read: 1200, write: 240 }[budget])) throw new GameError('Trop de demandes. Patientez une minute.', 429);
        if (req.method === 'GET' && url.pathname === '/api/network') {
          const port = getPort();
          const addresses = process.env.VERCEL ? [] : Object.values(os.networkInterfaces()).flat().filter(n => n.family === 'IPv4' && !n.internal).map(n => `http://${n.address}:${port}`);
          return send(200, { addresses, publicUrl: getPublicUrl() });
        }
        if (req.method === 'GET' && url.pathname === '/api/home-qr') {
          const target = getPublicUrl() || `${process.env.VERCEL ? 'https' : 'http'}://${req.headers.host}`;
          const svg = await QRCode.toString(new URL('/', target).href, { type: 'svg', margin: 4, errorCorrectionLevel: 'M' });
          res.writeHead(200, { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'no-cache' });
          return res.end(svg);
        }
        if (url.pathname === '/api/cleanup') {
          if (req.method !== 'GET' || !process.env.CRON_SECRET || req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) throw new GameError('Accès refusé.', 403);
          await service.cleanup();
          return send(200, { ok: true });
        }
        const token = req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : '';
        if (req.method === 'GET' && url.pathname === '/api/watch') return send(200, await service.watch(url.searchParams.get('code')));
        if (req.method === 'GET' && url.pathname === '/api/state') return send(200, await service.state(url.searchParams.get('code'), token));
        if (req.method !== 'POST') throw new GameError('Route introuvable.', 404);
        let raw;
        if (req.body !== undefined) raw = typeof req.body === 'string' || Buffer.isBuffer(req.body) ? req.body : JSON.stringify(req.body);
        else {
          const chunks = []; let size = 0;
          for await (const chunk of req) { size += chunk.length; if (size > 4096) throw new GameError('Requête trop volumineuse.', 413); chunks.push(chunk); }
          raw = Buffer.concat(chunks);
        }
        if (Buffer.byteLength(raw) > 4096) throw new GameError('Requête trop volumineuse.', 413);
        let body; try { body = JSON.parse(raw.toString()); } catch { throw new GameError('Requête JSON invalide.'); }
        if (!body || typeof body !== 'object' || Array.isArray(body)) throw new GameError('Requête invalide.');
        if (url.pathname === '/api/rooms') return send(201, await service.create(body.name, body.practice === true));
        if (url.pathname === '/api/join') return send(200, await service.join(body.code, body.name));
        if (url.pathname === '/api/action') return send(200, await service.action(body.code, token, body));
        throw new GameError('Route introuvable.', 404);
      }
      if (req.method !== 'GET' && req.method !== 'HEAD') throw new GameError('Méthode non autorisée.', 405);
      let relative;
      try { relative = decodeURIComponent(url.pathname); } catch { throw new GameError('Adresse invalide.'); }
      if (relative === '/') relative = '/index.html';
      const filename = path.resolve(root, `.${relative}`);
      if (!filename.startsWith(root + path.sep)) throw new GameError('Accès refusé.', 403);
      const mime = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon' }[path.extname(filename)];
      if (!mime) throw new GameError('Fichier introuvable.', 404);
      let content; try { content = await readFile(filename); } catch { throw new GameError('Fichier introuvable.', 404); }
      if (relative === '/assets/arena.svg') {
        const left = url.searchParams.get('left') || 'sage', right = url.searchParams.get('right') || 'coral';
        const palettes = [left, right].map(id => TEAM_COLORS.find(c => c.id === id));
        if (palettes.some(c => !c)) throw new GameError('Couleur de château inconnue.');
        const replacements = new Map();
        for (const [i, original] of TEAM_COLORS.slice(0, 2).entries()) for (const key of ['roof', 'shade', 'flag']) replacements.set(original[key], palettes[i][key]);
        content = content.toString('utf8').replace(/#[0-9a-f]{6}/gi, color => replacements.get(color) || color);
      }
      res.writeHead(200, { 'Content-Type': `${mime}; charset=utf-8`, 'Cache-Control': 'no-cache' });
      res.end(req.method === 'HEAD' ? undefined : content);
    } catch (error) { if (!(error instanceof GameError)) console.error(error); if (!res.headersSent) send(error.status || 500, { error: error instanceof GameError ? error.message : 'Le serveur rencontre un problème. Réessayez.' }); else res.end(); }
  };
}

export function createGameServer({ service = new GameService(), ...options } = {}) {
  const server = http.createServer(createRequestHandler({ service, ...options, getPort: () => server.address().port }));
  server.requestTimeout = 10_000;
  const tick = setInterval(() => service.tickAll(), 100); tick.unref();
  const cleanup = setInterval(() => { service.cleanup(); }, 60_000); cleanup.unref();
  server.on('close', () => { clearInterval(tick); clearInterval(cleanup); });
  return server;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT || 3000);
  const server = createGameServer();
  server.on('error', error => { console.error(error.code === 'EADDRINUSE' ? `Le port ${port} est déjà utilisé. Fermez l’autre serveur ou lancez avec PORT=3001.` : error.message); process.exitCode = 1; });
  server.listen(port, '0.0.0.0', () => {
    console.log(`\n  LES DEUX BASTIONS\n  Sur cet ordinateur : http://localhost:${server.address().port}\n`);
    for (const entries of Object.values(os.networkInterfaces())) for (const entry of entries || []) if (entry.family === 'IPv4' && !entry.internal) console.log(`  Sur les téléphones (même Wi-Fi) : http://${entry.address}:${server.address().port}`);
    console.log('\n  Gardez cette fenêtre ouverte pendant la partie. Ctrl+C pour arrêter.\n');
    if (process.argv.includes('--open')) {
      const url = `http://localhost:${server.address().port}`;
      const opener = process.platform === 'darwin' ? ['open', [url]] : process.platform === 'win32' ? ['cmd', ['/c', 'start', '', url]] : ['xdg-open', [url]];
      const browser = spawn(opener[0], opener[1], { stdio: 'ignore' }); browser.on('error', () => {}); browser.unref();
    }
  });
}
