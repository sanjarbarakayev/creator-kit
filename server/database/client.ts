import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

// Lazily initialize the DB client so a missing DATABASE_URL at module load
// time does NOT crash the SSR server on startup (would 500 every route).
let _db: ReturnType<typeof drizzle<typeof schema>> | null = null

function getDb() {
  if (_db) return _db

  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error(
      'DATABASE_URL environment variable is not set. '
      + 'Add it in your Vercel project settings under Environment Variables.',
    )
  }

  const client = postgres(connectionString, { prepare: false })
  _db = drizzle(client, { schema })
  return _db
}

// Proxy so callers can use `db.select(...)` etc. without changing import style
export const db = new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
  get(_target, prop) {
    return (getDb() as any)[prop]
  },
})
