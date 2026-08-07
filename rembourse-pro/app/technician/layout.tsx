import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import TechnicianSidebar from '@/components/technician-sidebar'
import { ensureDbInitialized } from '@/lib/db/init'
import { db } from '@/lib/db'
import { user } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { ToastProvider } from '@/lib/toast-context'
import { ToastContainer } from '@/components/ui/toast'

export default async function TechnicianLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await ensureDbInitialized()

  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    redirect('/sign-in')
  }

  const dbUser = await db
    .select({
      role: user.role,
    })
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1)

  const role = dbUser?.[0]?.role

  if (role !== 'technician' && role !== 'admin') {
    redirect('/sign-in')
  }

  return (
    <ToastProvider>
      <div className="min-h-screen w-full overflow-x-hidden bg-background">
        <TechnicianSidebar />
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