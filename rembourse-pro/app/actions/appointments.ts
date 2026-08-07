'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { appointments } from '@/lib/db/schema'
import { and, eq, desc, gte, lte } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Non autorisé')
  return session.user.id
}

export async function getAppointments() {
  const userId = await getUserId()
  
  return db
    .select()
    .from(appointments)
    .where(eq(appointments.userId, userId))
    .orderBy(desc(appointments.date))
}

export async function getAppointmentsByDate(date: string) {
  const userId = await getUserId()
  
  return db
    .select()
    .from(appointments)
    .where(
      and(
        eq(appointments.userId, userId),
        eq(appointments.date, date)
      )
    )
    .orderBy(appointments.startTime)
}

export async function createAppointment(data: {
  title: string
  date: string
  startTime?: string
  endTime?: string
  location?: string
  description?: string
}) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user || session.user.role !== 'admin') {
    throw new Error('Non autorisé')
  }

  const result = await db
    .insert(appointments)
    .values({
      userId: data.userId || '',
      title: data.title,
      date,
      startTime: data.startTime,
      endTime: data.endTime,
      location: data.location,
      description: data.description,
      status: 'scheduled',
    })
    .returning()

  revalidatePath('/admin/appointments')
  return result[0]
}

export async function updateAppointment(
  id: number,
  data: {
    title?: string
    date?: string
    startTime?: string
    endTime?: string
    location?: string
    description?: string
    status?: string
  }
) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user || session.user.role !== 'admin') {
    throw new Error('Non autorisé')
  }

  const result = await db
    .update(appointments)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(appointments.id, id))
    .returning()

  revalidatePath('/technician/calendar')
  revalidatePath('/admin/appointments')
  return result[0]
}

export async function deleteAppointment(id: number) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user || session.user.role !== 'admin') {
    throw new Error('Non autorisé')
  }

  await db.delete(appointments).where(eq(appointments.id, id))
  revalidatePath('/admin/appointments')
}
