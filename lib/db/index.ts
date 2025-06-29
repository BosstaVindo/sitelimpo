import { drizzle } from "drizzle-orm/better-sqlite3"
import Database from "better-sqlite3"
import * as schema from "./schema"

let db: ReturnType<typeof drizzle>

try {
  // Criar banco de dados SQLite
  const sqlite = new Database(process.env.DATABASE_PATH || "autodialer.db")

  // Habilitar WAL mode para melhor performance
  sqlite.pragma("journal_mode = WAL")

  db = drizzle(sqlite, { schema })

  // Inicializar tabelas
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS devices (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'disconnected',
      session_id TEXT,
      ip TEXT,
      battery INTEGER,
      signal INTEGER,
      last_seen INTEGER,
      calls_today INTEGER DEFAULT 0,
      created_at INTEGER DEFAULT (unixepoch())
    );

    CREATE TABLE IF NOT EXISTS call_lists (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      numbers TEXT NOT NULL,
      original_numbers TEXT,
      ddd TEXT,
      status TEXT NOT NULL DEFAULT 'paused',
      progress INTEGER DEFAULT 0,
      total_numbers INTEGER DEFAULT 0,
      completed_calls INTEGER DEFAULT 0,
      created_at INTEGER DEFAULT (unixepoch()),
      updated_at INTEGER DEFAULT (unixepoch())
    );

    CREATE TABLE IF NOT EXISTS call_history (
      id TEXT PRIMARY KEY,
      device_id TEXT NOT NULL,
      list_id TEXT NOT NULL,
      phone_number TEXT NOT NULL,
      status TEXT NOT NULL,
      duration INTEGER,
      timestamp INTEGER DEFAULT (unixepoch())
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      device_id TEXT,
      websocket_url TEXT,
      status TEXT DEFAULT 'active',
      created_at INTEGER DEFAULT (unixepoch()),
      last_activity INTEGER DEFAULT (unixepoch())
    );

    -- Índices para melhor performance
    CREATE INDEX IF NOT EXISTS idx_devices_session ON devices(session_id);
    CREATE INDEX IF NOT EXISTS idx_devices_status ON devices(status);
    CREATE INDEX IF NOT EXISTS idx_call_lists_status ON call_lists(status);
    CREATE INDEX IF NOT EXISTS idx_call_history_device ON call_history(device_id);
    CREATE INDEX IF NOT EXISTS idx_call_history_list ON call_history(list_id);
    CREATE INDEX IF NOT EXISTS idx_sessions_status ON sessions(status);
  `)

  console.log("Database initialized successfully")
} catch (error) {
  console.error("Database initialization error:", error)

  // Fallback: criar um mock do banco para evitar crashes
  db = {
    select: () => ({
      from: () => ({ all: () => [], get: () => null, where: () => ({ all: () => [], get: () => null }) }),
    }),
    insert: () => ({ values: () => ({ run: () => {}, onConflictDoUpdate: () => ({ run: () => {} }) }) }),
    update: () => ({ set: () => ({ where: () => ({ run: () => {} }) }) }),
    delete: () => ({ where: () => ({ run: () => {} }) }),
    _: { schema },
  } as any
}

export { db }
