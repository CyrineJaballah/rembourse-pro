'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { advanceRequests } from '@/lib/db/schema'
import { and, eq, desc, gte } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Non autorisé')
  return session.user.id
}

export async function canRequestAdvance() {
  const userId = await getUserId()
  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()
  const dayOfMonth = today.getDate()

  // Check if before 15th of the month
  if (dayOfMonth < 15) {
    return { allowed: false, message: 'Les demandes d\'acomptes sont disponibles à partir du 15 de chaque mois' }
  }

  // Check if already requested this month
  const startOfMonth = new Date(currentYear, currentMonth, 1)
  const endOfMonth = new Date(currentYear, currentMonth + 1, 0)

  const existingRequests = await db
    .select()
    .from(advanceRequests)
    .where(
      and(
        eq(advanceRequests.userId, userId),
        gte(advanceRequests.requestedAt, startOfMonth),
        gte(endOfMonth, advanceRequests.requestedAt)
      )
    )

  if (existingRequests.length > 0) {
    return { allowed: false, message: 'Vous avez déjà demandé un acompte ce mois-ci' }
  }

  return { allowed: true, message: '' }
}

export async function submitAdvanceRequest(amount: number, reason?: string) {
  const userId = await getUserId()
  const { allowed, message } = await canRequestAdvance()

  if (!allowed) {
    throw new Error(message)
  }

  if (amount <= 0) {
    throw new Error('Le montant doit être supérieur à 0')
  }

  const result = await db
    .insert(advanceRequests)
    .values({
      userId,
      amount: amount.toString(),
      reason,
      status: 'pending',
    })
    .returning()

  revalidatePath('/technician/advance-request')
  return result[0]
}

export async function getAdvanceRequests() {
  const userId = await getUserId()
  
  return db
    .select()
    .from(advanceRequests)
    .where(eq(advanceRequests.userId, userId))
    .orderBy(desc(advanceRequests.requestedAt))
}

export async function getAllAdvanceRequests() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user || session.user.role !== 'admin') {
    throw new Error('Non autorisé')
  }

  return db
    .select()
    .from(advanceRequests)
    .orderBy(desc(advanceRequests.requestedAt))
}

export async function approveAdvanceRequest(id: number, approvedBy: string) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user || session.user.role !== 'admin') {
    throw new Error('Non autorisé')
  }

  const result = await db
    .update(advanceRequests)
    .set({
      status: 'approved',
      approvedAt: new Date(),
      approvedBy,
    })
    .where(eq(advanceRequests.id, id))
    .returning()

  revalidatePath('/admin/advance-requests')
  return result[0]
}

export async function rejectAdvanceRequest(id: number, rejectionReason: string) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user || session.user.role !== 'admin') {
    throw new Error('Non autorisé')
  }

  const result = await db
    .update(advanceRequests)
    .set({
      status: 'rejected',
      rejectionReason,
    })
    .where(eq(advanceRequests.id, id))
    .returning()

  revalidatePath('/admin/advance-requests')
  return result[0]
}
