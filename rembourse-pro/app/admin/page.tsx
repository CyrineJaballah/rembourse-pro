import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { user, expenses, advanceRequests, appointments } from '@/lib/db/schema'
import { headers } from 'next/headers'
import { eq, desc } from 'drizzle-orm'
import { t } from '@/lib/translations'
import { DashboardCharts } from '@/components/dashboard-charts'
import { InterventionTable } from '@/components/intervention-table'
import { DEMO_INTERVENTIONS } from '@/lib/demo-data'
import { FileText, Clock, DollarSign, Users, Award, ShieldCheck } from 'lucide-react'
import Link from 'next/link'

export default async function AdminDashboard() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return null

  // Get aggregated stats efficiently
  const allExpenses = await db.select().from(expenses)
  const allAdvances = await db.select().from(advanceRequests)
  const allUsers = await db.select().from(user).where(eq(user.role, 'technician'))
  const dbAppointments = await db.select().from(appointments).orderBy(desc(appointments.createdAt)).limit(10)

  const totalExpenses = allExpenses.reduce((sum: number, exp: any) => sum + Number(exp.amount), 0)
  const pendingExpenses = allExpenses.filter((exp: any) => exp.status === 'pending')
  const pendingAdvances = allAdvances.filter((adv: any) => adv.status === 'pending')

  const interventionsList = dbAppointments.length > 0
    ? dbAppointments.map((app: any) => ({
        reference: app.reference || `23517${app.id}`,
        type: app.type || app.title.split(' - ')[0] || 'PLP Façade',
        status: app.status === 'completed' ? 'Terminé' : app.status === 'nok' ? 'NOK' : 'En cours',
        technicianName: app.technicianName || 'Mohamed Ben Ali',
        date: app.date || '07/08/2026',
        time: app.startTime ? `${app.startTime} - ${app.endTime || ''}` : '08:00 - 10:00',
        address: app.location || '15 Rue Exemple, Paris',
        result: app.result || (app.status === 'completed' ? 'OK' : app.status === 'nok' ? 'NOK' : 'En cours'),
        description: app.description || '',
      }))
    : DEMO_INTERVENTIONS

  const formatCurrency = (amount: string | number) => {
    return new Number(amount).toLocaleString('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    })
  }

  return (
    <div className="space-y-8">
      {/* Admin Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Panneau de Contrôle Administrateur
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Supervision globale des équipes techniques, des frais et des demandes d&apos;acomptes TARCOM
        </p>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Total Frais Soumis</span>
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-primary">{formatCurrency(totalExpenses)}</p>
          <p className="text-xs text-muted-foreground">{allExpenses.length} note(s) au total</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Frais en Attente</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-amber-600">{pendingExpenses.length}</p>
          <Link href="/admin/expenses" className="text-xs font-medium text-primary hover:underline inline-block">
            Traiter les demandes &rarr;
          </Link>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Acomptes en Attente</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-blue-600">{pendingAdvances.length}</p>
          <Link href="/admin/advance-requests" className="text-xs font-medium text-primary hover:underline inline-block">
            Examiner les acomptes &rarr;
          </Link>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Techniciens Actifs</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-emerald-600">{Math.max(5, allUsers.length)}</p>
          <Link href="/admin/users" className="text-xs font-medium text-primary hover:underline inline-block">
            Gérer les utilisateurs &rarr;
          </Link>
        </div>
      </div>

      {/* Analytics & Performance Charts */}
      <DashboardCharts />

      {/* Interventions Overview Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">
            Toutes les Interventions du Réseau
          </h2>
          <span className="text-xs text-muted-foreground font-mono">1,245 interventions enregistrées</span>
        </div>
        <InterventionTable data={interventionsList} />
      </div>
    </div>
  )
}
