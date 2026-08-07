import { db, sqliteClient, pool } from './index'
import { auth } from '../auth'
import { user, categories, expenses, appointments } from './schema'
import { eq } from 'drizzle-orm'

let initialized = false

export async function ensureDbInitialized() {
  if (initialized) return
  initialized = true

  try {
    if (sqliteClient) {
      // Create tables for SQLite
      sqliteClient.exec(`
        CREATE TABLE IF NOT EXISTS "user" (
          "id" text PRIMARY KEY,
          "email" text UNIQUE NOT NULL,
          "emailVerified" integer NOT NULL DEFAULT 0,
          "name" text,
          "image" text,
          "role" text DEFAULT 'technician',
          "createdAt" text NOT NULL,
          "updatedAt" text NOT NULL
        );

        CREATE TABLE IF NOT EXISTS "session" (
          "id" text PRIMARY KEY,
          "expiresAt" text NOT NULL,
          "token" text UNIQUE NOT NULL,
          "createdAt" text NOT NULL,
          "updatedAt" text NOT NULL,
          "ipAddress" text,
          "userAgent" text,
          "userId" text NOT NULL
        );

        CREATE TABLE IF NOT EXISTS "account" (
          "id" text PRIMARY KEY,
          "accountId" text NOT NULL,
          "providerId" text NOT NULL,
          "userId" text NOT NULL,
          "accessToken" text,
          "refreshToken" text,
          "expiresAt" text,
          "password" text,
          "createdAt" text NOT NULL,
          "updatedAt" text NOT NULL
        );

        CREATE TABLE IF NOT EXISTS "verification" (
          "id" text PRIMARY KEY,
          "identifier" text NOT NULL,
          "value" text NOT NULL,
          "expiresAt" text NOT NULL,
          "createdAt" text,
          "updatedAt" text
        );

        CREATE TABLE IF NOT EXISTS "categories" (
          "id" INTEGER PRIMARY KEY AUTOINCREMENT,
          "name" text NOT NULL,
          "icon" text,
          "description" text
        );

        CREATE TABLE IF NOT EXISTS "expenses" (
          "id" INTEGER PRIMARY KEY AUTOINCREMENT,
          "userId" text NOT NULL,
          "amount" text NOT NULL,
          "category" text NOT NULL,
          "description" text,
          "receiptUrl" text,
          "status" text DEFAULT 'pending',
          "createdAt" text NOT NULL,
          "updatedAt" text NOT NULL
        );

        CREATE TABLE IF NOT EXISTS "appointments" (
          "id" INTEGER PRIMARY KEY AUTOINCREMENT,
          "userId" text NOT NULL,
          "title" text NOT NULL,
          "date" text NOT NULL,
          "startTime" text,
          "endTime" text,
          "location" text,
          "description" text,
          "status" text DEFAULT 'scheduled',
          "createdAt" text NOT NULL,
          "updatedAt" text NOT NULL
        );

        CREATE TABLE IF NOT EXISTS "advance_requests" (
          "id" INTEGER PRIMARY KEY AUTOINCREMENT,
          "userId" text NOT NULL,
          "amount" text NOT NULL,
          "status" text DEFAULT 'pending',
          "requestedAt" text NOT NULL,
          "approvedAt" text,
          "approvedBy" text,
          "reason" text,
          "rejectionReason" text
        );
      `)
    } else if (pool) {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS "user" (
          "id" text PRIMARY KEY,
          "email" text UNIQUE NOT NULL,
          "emailVerified" boolean NOT NULL DEFAULT false,
          "name" text,
          "image" text,
          "role" text DEFAULT 'technician',
          "createdAt" timestamp NOT NULL DEFAULT NOW(),
          "updatedAt" timestamp NOT NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS "session" (
          "id" text PRIMARY KEY,
          "expiresAt" timestamp NOT NULL,
          "token" text UNIQUE NOT NULL,
          "createdAt" timestamp NOT NULL DEFAULT NOW(),
          "updatedAt" timestamp NOT NULL DEFAULT NOW(),
          "ipAddress" text,
          "userAgent" text,
          "userId" text NOT NULL
        );

        CREATE TABLE IF NOT EXISTS "account" (
          "id" text PRIMARY KEY,
          "accountId" text NOT NULL,
          "providerId" text NOT NULL,
          "userId" text NOT NULL,
          "accessToken" text,
          "refreshToken" text,
          "expiresAt" timestamp,
          "password" text,
          "createdAt" timestamp NOT NULL DEFAULT NOW(),
          "updatedAt" timestamp NOT NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS "verification" (
          "id" text PRIMARY KEY,
          "identifier" text NOT NULL,
          "value" text NOT NULL,
          "expiresAt" timestamp NOT NULL,
          "createdAt" timestamp,
          "updatedAt" timestamp
        );

        CREATE TABLE IF NOT EXISTS "categories" (
          "id" serial PRIMARY KEY,
          "name" text NOT NULL,
          "icon" text,
          "description" text
        );

        CREATE TABLE IF NOT EXISTS "expenses" (
          "id" serial PRIMARY KEY,
          "userId" text NOT NULL,
          "amount" numeric(10, 2) NOT NULL,
          "category" text NOT NULL,
          "description" text,
          "receiptUrl" text,
          "status" text DEFAULT 'pending',
          "createdAt" timestamp DEFAULT NOW() NOT NULL,
          "updatedAt" timestamp DEFAULT NOW() NOT NULL
        );

        CREATE TABLE IF NOT EXISTS "appointments" (
          "id" serial PRIMARY KEY,
          "userId" text NOT NULL,
          "title" text NOT NULL,
          "date" date NOT NULL,
          "startTime" time,
          "endTime" time,
          "location" text,
          "description" text,
          "status" text DEFAULT 'scheduled',
          "createdAt" timestamp DEFAULT NOW() NOT NULL,
          "updatedAt" timestamp DEFAULT NOW() NOT NULL
        );

        CREATE TABLE IF NOT EXISTS "advance_requests" (
          "id" serial PRIMARY KEY,
          "userId" text NOT NULL,
          "amount" numeric(10, 2) NOT NULL,
          "status" text DEFAULT 'pending',
          "requestedAt" timestamp DEFAULT NOW() NOT NULL,
          "approvedAt" timestamp,
          "approvedBy" text,
          "reason" text,
          "rejectionReason" text
        );
      `)
    }

    // 2. Seed Default Categories if empty
    const existingCats = await db.select().from(categories)
    if (existingCats.length === 0) {
      await db.insert(categories).values([
        { name: 'Déplacement', icon: 'Car', description: 'Frais de transport, essence, péage, taxi' },
        { name: 'Hébergement', icon: 'Hotel', description: 'Nuits d\'hôtel, logement temporaire' },
        { name: 'Repas', icon: 'Utensils', description: 'Repas pendant les déplacements professionnels' },
        { name: 'Équipement', icon: 'HardHat', description: 'Équipements de protection et matériel' },
        { name: 'Outils', icon: 'Wrench', description: 'Outillage professionnel et fournitures' },
        { name: 'Autre', icon: 'MoreHorizontal', description: 'Autres dépenses professionnelles' },
      ])
    }

    // 3. Seed Default Admin User if not exists
    const adminEmail = 'admin@rembourse.pro'
    const existingAdmin = await db.select().from(user).where(eq(user.email, adminEmail))
    if (existingAdmin.length === 0) {
      try {
        const res = await auth.api.signUpEmail({
          body: {
            email: adminEmail,
            password: 'Admin123!',
            name: 'Administrateur',
          },
        })
        if (res?.user?.id) {
          await db.update(user).set({ role: 'admin' }).where(eq(user.id, res.user.id))
        }
      } catch (err) {
        console.log('Admin user seed note:', err)
      }
    }

    // 4. Seed Default Technician User if not exists
    const techEmail = 'tech@rembourse.pro'
    const existingTech = await db.select().from(user).where(eq(user.email, techEmail))
    if (existingTech.length === 0) {
      try {
        const res = await auth.api.signUpEmail({
          body: {
            email: techEmail,
            password: 'Tech123!',
            name: 'Technicien Test',
          },
        })
        if (res?.user?.id) {
          const now = new Date()
          await db.insert(expenses).values({
            userId: res.user.id,
            amount: '45.50',
            category: 'Repas',
            description: 'Déjeuner client sur site',
            status: 'approved',
            createdAt: now,
            updatedAt: now,
          })
          await db.insert(expenses).values({
            userId: res.user.id,
            amount: '120.00',
            category: 'Déplacement',
            description: 'Carburant mission Lyon',
            status: 'pending',
            createdAt: now,
            updatedAt: now,
          })
          await db.insert(appointments).values({
            userId: res.user.id,
            title: 'Maintenance Client ACME',
            date: new Date().toISOString().split('T')[0],
            startTime: '09:00',
            endTime: '11:30',
            location: 'Paris, Rue de la Paix',
            description: 'Vérification annuelle des équipements',
            status: 'scheduled',
            createdAt: now,
            updatedAt: now,
          })
        }
      } catch (err) {
        console.log('Tech user seed note:', err)
      }
    }

    // Seed TARCOM demo data if empty
    const { seedDemoDataIfEmpty } = await import('./seed-demo-data')
    await seedDemoDataIfEmpty()
  } catch (error) {
    console.error('Error during DB init & seed:', error)
  }
}
