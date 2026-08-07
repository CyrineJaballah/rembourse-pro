'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { expenses } from '@/lib/db/schema'
import { and, eq, desc } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Non autorisé')
  return session.user.id
}

export async function submitExpense(data: {
  amount: number
  category: string
  description: string
  receiptUrl?: string
}) {
  const userId = await getUserId()
  
  const result = await db
    .insert(expenses)
    .values({
      userId,
      amount: data.amount.toString(),
      category: data.category,
      description: data.description,
      receiptUrl: data.receiptUrl,
      status: 'pending',
    })
    .returning()

  revalidatePath('/technician/expenses')
  return result[0]
}

export async function getExpenses() {
  const userId = await getUserId()
  
  return db
    .select()
    .from(expenses)
    .where(eq(expenses.userId, userId))
    .orderBy(desc(expenses.createdAt))
}

export async function getExpenseById(id: number) {
  const userId = await getUserId()
  
  const result = await db
    .select()
    .from(expenses)
    .where(and(eq(expenses.id, id), eq(expenses.userId, userId)))
    .limit(1)

  return result[0]
}

export async function getAllExpenses() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user || session.user.role !== 'admin') {
    throw new Error('Non autorisé')
  }

  return db
    .select()
    .from(expenses)
    .orderBy(desc(expenses.createdAt))
}

export async function updateExpenseStatus(id: number, status: string) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user || session.user.role !== 'admin') {
    throw new Error('Non autorisé')
  }

  const result = await db
    .update(expenses)
    .set({ status, updatedAt: new Date() })
    .where(eq(expenses.id, id))
    .returning()

  revalidatePath('/admin/expenses')
  return result[0]
}
