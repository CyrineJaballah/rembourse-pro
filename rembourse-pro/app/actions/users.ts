'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { user } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function createUserAction(formData: FormData) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user || session.user.role !== 'admin') {
      return { error: 'Accès non autorisé. Seuls les administrateurs peuvent créer des comptes.' }
    }

    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const role = (formData.get('role') as string) || 'technician'

    if (!email || !password || !name) {
      return { error: 'Tous les champs (nom, email, mot de passe) sont requis.' }
    }

    if (password.length < 8) {
      return { error: 'Le mot de passe doit contenir au moins 8 caractères.' }
    }

    // Check if user already exists
    const existing = await db.select().from(user).where(eq(user.email, email))
    if (existing.length > 0) {
      return { error: 'Un utilisateur avec cet email existe déjà.' }
    }

    // Create user via Better Auth API
    const res = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
    })

    if (!res?.user?.id) {
      return { error: 'Échec de la création de l\'utilisateur.' }
    }

    // Update role if admin
    if (role !== 'technician') {
      await db.update(user).set({ role }).where(eq(user.id, res.user.id))
    }

    revalidatePath('/admin/users')
    return { success: true, message: `Utilisateur ${name} créé avec succès en tant que ${role === 'admin' ? 'Administrateur' : 'Technicien'}.` }
  } catch (err: any) {
    console.error('createUserAction error:', err)
    return { error: err.message || 'Une erreur est survenue lors de la création de l\'utilisateur.' }
  }
}
