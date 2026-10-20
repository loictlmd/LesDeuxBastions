import pg from 'pg';
import { QUESTIONS } from './questions.mjs';
import { GameService, GameError } from './game.mjs';
const questionsById = new Map(QUESTIONS.map(question => [question.id, question]));
const encode = room => JSON.stringify({ ...room, deck: room.deck.map(question => question.id) });
const decode = state => ({ ...state, deck: state.deck.map(question => typeof question === 'number' ? questionsById.get(question) : question) });

export const expiresAt = room => Math.min(room.updatedAt + 7_200_000, room.finishedWallAt ? room.finishedWallAt + 1_800_000 : Infinity);

// Keep one small pool per warm function; Neon pools connections across instances.
export function createPool() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL manquante. Configurez la connexion Neon.');
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, max: 3, idleTimeoutMillis: 10_000, connectionTimeoutMillis: 10_000, allowExitOnIdle: true });
  pool.on('error', error => console.error('Database pool:', error.code));
  return pool;
}

export class DatabaseGameService {
  constructor(pool, { now = () => Date.now() } = {}) { this.pool = pool; this.now = now; }
  async cleanup() { await this.pool.query('DELETE FROM bastion_rooms WHERE expires_at <= $1', [this.now()]); }
  async transaction(operation) {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      await client.query("SET LOCAL statement_timeout = '10s'");
      const result = await operation(client);
      await client.query('COMMIT');
      return result;
    } catch (error) { await client.query('ROLLBACK'); throw error; }
    finally { client.release(); }
  }
  async create(name, practice = false) {
    return this.transaction(async client => {
      // Serialize room creation only: enforce capacity and avoid code collisions.
      await client.query('SELECT pg_advisory_xact_lock(742196)');
      await client.query('DELETE FROM bastion_rooms WHERE expires_at <= $1', [this.now()]);
      const { rows } = await client.query('SELECT code FROM bastion_rooms');
      const service = new GameService({ now: this.now });
      for (const { code } of rows) service.rooms.set(code, { updatedAt: this.now() });
      const result = service.create(name, practice);
      const room = service.rooms.get(result.code);
      await client.query('INSERT INTO bastion_rooms (code, state, expires_at) VALUES ($1, $2::jsonb, $3)', [room.code, encode(room), expiresAt(room)]);
      return result;
    });
  }
  async run(method, code, ...args) {
    if (typeof code !== 'string' || !/^[A-Z2-9]{6}$/.test(code)) throw new GameError('Le code comporte 6 lettres ou chiffres.');
    return this.transaction(async client => {
      const { rows } = await client.query('SELECT state, expires_at FROM bastion_rooms WHERE code = $1 FOR UPDATE', [code]);
      const row = rows[0];
      if (!row || Number(row.expires_at) <= this.now()) throw new GameError('Cette partie est introuvable ou a expiré. Créez-en une nouvelle.', 404);
      const service = new GameService({ now: this.now });
      service.rooms.set(code, decode(row.state));
      // A fixed clock makes every calculation within this request consistent.
      const now = this.now(); service.now = () => now;
      const before = encode(service.rooms.get(code));
      let result, failure;
      try { result = service[method](code, ...args); }
      catch (error) { if (!(error instanceof GameError)) throw error; failure = error; }
      const room = service.rooms.get(code);
      if (!room) await client.query('DELETE FROM bastion_rooms WHERE code = $1', [code]);
      else {
        const state = encode(room);
        // Spectator polls with no timed event need no write.
        if (state !== before) await client.query('UPDATE bastion_rooms SET state = $2::jsonb, expires_at = $3 WHERE code = $1', [code, state, expiresAt(room)]);
      }
      // Preserve elapsed events even if the requested action was rejected.
      return { result, failure };
    }).then(({ result, failure }) => { if (failure) throw failure; return result; });
  }
  join(code, name) { return this.run('join', code, name); }
  state(code, token) { return this.run('state', code, token); }
  watch(code) { return this.run('watch', code); }
  action(code, token, action) { return this.run('action', code, token, action); }
}
