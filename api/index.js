import { createRequestHandler } from '../server.mjs';
import { createPool, DatabaseGameService } from '../src/database.mjs';

let handler;
export default async function endpoint(req, res) {
  try {
    handler ??= createRequestHandler({ service: new DatabaseGameService(createPool()), getPublicUrl: () => process.env.PUBLIC_URL || null });
    const url = new URL(req.url, 'http://localhost');
    const route = url.searchParams.get('route');
    if (route) {
      url.pathname = route; url.searchParams.delete('route');
      req.url = url.pathname + url.search;
    }
    await handler(req, res);
  } catch (error) {
    console.error('API initialization:', error.message);
    res.statusCode = 503;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-store');
    res.end(JSON.stringify({ error: 'Le serveur rencontre un problème. Réessayez.' }));
  }
}
