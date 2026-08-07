import { db } from '@/lib/db'
import { user } from '@/lib/db/schema'
import { t } from '@/lib/translations'
import { User, Mail } from 'lucide-react'
import { CreateUserModal } from '@/components/create-user-modal'
import { ensureDbInitialized } from '@/lib/db/init'

export default async function AdminUsersPage() {
  await ensureDbInitialized()
  const allUsers = await db.select().from(user)
  const technicians = allUsers.filter((u: any) => u.role === 'technician')
  const admins = allUsers.filter((u: any) => u.role === 'admin')

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <main className="p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('nav.manage-users')}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gérez les comptes des techniciens et des administrateurs
          </p>
        </div>
        <CreateUserModal />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Technicians */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Techniciens ({technicians.length})</h2>
          </div>
          {technicians.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Aucun technicien</p>
          ) : (
            <div className="space-y-3">
              {technicians.map((tech: any) => (
                <div key={tech.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{tech.name || 'N/A'}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <Mail className="w-4 h-4" />
                        <span>{tech.email}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Inscrit le {formatDate(tech.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Admins */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Administrateurs ({admins.length})</h2>
          </div>
          {admins.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Aucun administrateur</p>
          ) : (
            <div className="space-y-3">
              {admins.map((admin: any) => (
                <div key={admin.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{admin.name || 'N/A'}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <Mail className="w-4 h-4" />
                        <span>{admin.email}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Inscrit le {formatDate(admin.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
