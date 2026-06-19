// ── Persistent token store ─────────────────────────────────────────
// File-based JSON store. Good enough for a single-instance deploy or
// local development. For multi-instance production deployments,
// swap this module for Redis, Postgres, or any KV store — the
// function signatures (get/set/all/save) are the only contract
// the rest of the app depends on.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, 'data', 'tokens.json');

function load() {
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function persist(data) {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

let store = load();

export const tokenStore = {
  get(token) {
    return store[token] ?? null;
  },

  findBySessionId(sessionId) {
    for (const [token, record] of Object.entries(store)) {
      if (record.sessionId === sessionId) return { token, record };
    }
    return null;
  },

  set(token, record) {
    store[token] = record;
    persist(store);
  },

  incrementDownloads(token) {
    if (store[token]) {
      store[token].downloads = (store[token].downloads || 0) + 1;
      persist(store);
    }
  },
};
