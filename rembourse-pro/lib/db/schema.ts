import { pgTable, text, timestamp, boolean, decimal, date, time, serial } from 'drizzle-orm/pg-core'

// Better Auth tables
export const user = pgTable('user', {
  id: text('id').primaryKey(),
  email: text('email').unique().notNull(),
  emailVerified: boolean('emailVerified').notNull(),
  name: text('name'),
  image: text('image'),
  role: text('role').default('technician'),
  createdAt: timestamp('createdAt').notNull(),
  updatedAt: timestamp('updatedAt').notNull(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').unique().notNull(),
  createdAt: timestamp('createdAt').notNull(),
  updatedAt: timestamp('updatedAt').notNull(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId').notNull(),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId').notNull(),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  expiresAt: timestamp('expiresAt'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull(),
  updatedAt: timestamp('updatedAt').notNull(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt'),
  updatedAt: timestamp('updatedAt'),
})

// App tables
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  icon: text('icon'),
  description: text('description'),
})

export const expenses = pgTable('expenses', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  category: text('category').notNull(),
  description: text('description'),
  receiptUrl: text('receiptUrl'),
  status: text('status').default('pending'),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
})

export const appointments = pgTable('appointments', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  reference: text('reference'),
  type: text('type'),
  technicianName: text('technicianName'),
  title: text('title').notNull(),
  date: date('date').notNull(),
  startTime: time('startTime'),
  endTime: time('endTime'),
  location: text('location'),
  description: text('description'),
  status: text('status').default('scheduled'),
  result: text('result'),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
})

export const advanceRequests = pgTable('advance_requests', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  status: text('status').default('pending'),
  requestedAt: timestamp('requestedAt').defaultNow().notNull(),
  approvedAt: timestamp('approvedAt'),
  approvedBy: text('approvedBy'),
  reason: text('reason'),
  rejectionReason: text('rejectionReason'),
})
