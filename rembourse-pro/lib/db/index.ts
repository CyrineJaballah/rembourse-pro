import { drizzle as drizzlePg } from 'drizzle-orm/node-postgres'
import { drizzle as drizzleSqlite } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import { Pool } from 'pg'
import * as schema from './schema'
import path from 'path'

declare global {
  var _db: any
  var _sqlite: any
  var _pool: any
}

let db: any
let pool: any = null
let sqliteClient: Database.Database | null = null

if (process.env.DATABASE_URL) {
  pool = globalThis._pool || new Pool({ connectionString: process.env.DATABASE_URL })
  if (process.env.NODE_ENV !== 'production') globalThis._pool = pool
  db = drizzlePg(pool, { schema })
} else {
  const dbPath = path.join(process.cwd(), 'sqlite.db')
  sqliteClient = globalThis._sqlite || new Database(dbPath)
  if (process.env.NODE_ENV !== 'production') globalThis._sqlite = sqliteClient
  db = drizzleSqlite(sqliteClient, { schema })
}

export { db, pool, sqliteClient }
