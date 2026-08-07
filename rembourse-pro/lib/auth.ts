import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db, sqliteClient, pool } from '@/lib/db'
import * as schema from '@/lib/db/schema'
import { ensureDbInitialized } from '@/lib/db/init'

// Ensure DB tables & default seed data are ready on startup
ensureDbInitialized().catch((err) => {
  console.error('Failed to initialize DB:', err)
})

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET || 'rembourse-pro-super-secret-key-32-chars-minimum-key!',
  database: drizzleAdapter(db, {
    provider: sqliteClient ? 'sqlite' : 'pg',
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  user: {
    additionalFields: {
      role: {
        type: 'string',
        defaultValue: 'technician',
      },
    },
  },
  baseURL:
    process.env.BETTER_AUTH_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'http://localhost:3000'),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  trustedOrigins: [
    ...(process.env.V0_RUNTIME_URL ? [process.env.V0_RUNTIME_URL] : []),
    ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
    ...(process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? [`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`]
      : []),
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'capacitor://localhost',
    'http://localhost',
  ],
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
})
