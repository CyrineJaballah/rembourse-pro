import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/admin-sidebar'
import { ensureDbInitialized } from '@/lib/db/init'
import { ToastProvider } from '@/lib/toast-context'
import { ToastContainer } from '@/components/ui/toast'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await ensureDbInitialized()
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    redirect('/sign-in')
  }

  let role = session.user.role
  if (!role) {
    const { db } = await import('@/lib/db')
    const { user } = await import('@/lib/db/schema')
    const { eq } = await import('drizzle-orm')
    const dbUser = await db.select().from(user).where(eq(user.id, session.user.id)).limit(1)
    if (dbUser.length > 0) {
      role = dbUser[0].role
    }
  }

  if (role !== 'admin') {
    return (
      <div className="flex min-h-screen bg-background items-center justify-center p-4">
        <div className="text-center max-w-md bg-card border border-border rounded-2xl p-8 shadow-xl">
          <h1 className="text-2xl font-bold text-foreground mb-2">Accès restreint</h1>
          <p className="text-muted-foreground mb-6">Vous n&apos;avez pas les autorisations nécessaires pour accéder au panneau administrateur.</p>
          <a href="/technician" className="inline-block bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-medium hover:bg-primary/90 transition-colors">
            Retour à l&apos;espace technicien
          </a>
        </div>
      </div>
    )
  }

  return (
    <ToastProvider>
      <div className="min-h-screen w-full overflow-x-hidden bg-background">
        <AdminSidebar />
        <main className="min-h-screen w-full min-w-0 md:pl-64">
          <div className="mx-auto w-full min-w-0 max-w-[1920px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
            {children}
          </div>
        </main>
        <ToastContainer />
      </div>
    </ToastProvider>
  )
}
