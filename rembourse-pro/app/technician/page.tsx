import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { appointments, expenses, advanceRequests } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { headers } from 'next/headers'
import { t } from '@/lib/translations'
import { TechnicianProfileCard } from '@/components/technician-profile-card'
import { DashboardCharts } from '@/components/dashboard-charts'
import { InterventionTable } from '@/components/intervention-table'
import { DEMO_INTERVENTIONS } from '@/lib/demo-data'
import { CheckCircle2, Clock, XCircle, TrendingUp, Award, Layers } from 'lucide-react'

export default async function TechnicianDashboard() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return null

  // Fetch db appointments/interventions or fallback to DEMO_INTERVENTIONS
  const dbAppointments = await db.select().from(appointments).orderBy(desc(appointments.createdAt)).limit(10)
  
  const interventionsList = dbAppointments.length > 0
    ? dbAppointments.map((app) => ({
        reference: app.reference || `23517${app.id}`,
        type: app.type || app.title.split(' - ')[0] || 'PLP Façade',
        status: app.status === 'completed' ? 'Terminé' : app.status === 'nok' ? 'NOK' : 'En cours',
        technicianName: app.technicianName || session.user.name || 'Mohamed Ben Ali',
        date: app.date || '07/08/2026',
        time: app.startTime ? `${app.startTime} - ${app.endTime || ''}` : '08:00 - 10:00',
        address: app.location || '15 Rue Exemple, Paris',
        result: app.result || (app.status === 'completed' ? 'OK' : app.status === 'nok' ? 'NOK' : 'En cours'),
        description: app.description || '',
      }))
    : DEMO_INTERVENTIONS

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Tableau de bord Technicien
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Bienvenue, {session.user.name || 'Mohamed Ben Ali'} · Gestion et suivi des interventions TARCOM
        </p>
      </div>

      {/* Technician Profile Card */}
      <TechnicianProfileCard />

      {/* KPI Dashboard Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Interventions totales</span>
            <Layers className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground">1,245</p>
          <p className="text-[11px] text-emerald-500 font-medium">+12% ce mois-ci</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Terminées (OK)</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-emerald-600">1,050</p>
          <p className="text-[11px] text-muted-foreground">Conformes au protocole</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">En cours / Attente</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-amber-600">120</p>
          <p className="text-[11px] text-muted-foreground">Planning de la semaine</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Non conformes (NOK)</span>
            <XCircle className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-red-600">75</p>
          <p className="text-[11px] text-muted-foreground">Anomalies ou voirie</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-2 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Taux de réussite</span>
            <Award className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-blue-600">94%</p>
          <p className="text-[11px] text-emerald-500 font-medium">Objectif &gt;90% atteint</p>
        </div>
      </div>

      {/* Charts Section */}
      <DashboardCharts />

      {/* Recent Interventions Data Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">
            Interventions Techniciens Récentes
          </h2>
          <span className="text-xs text-muted-foreground font-mono">
            {interventionsList.length} entrées affichées
          </span>
        </div>
        <InterventionTable data={interventionsList} />
      </div>
    </div>
  )
}
