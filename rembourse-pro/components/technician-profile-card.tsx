'use client'

import React, { useState } from 'react'
import { DEMO_TECHNICIAN } from '@/lib/demo-data'
import { UserCheck, Phone, Building2, MapPin, Award, CheckCircle2, Clock, Activity, ChevronRight } from 'lucide-react'
import { useToast } from '@/lib/toast-context'

export function TechnicianProfileCard() {
  const { showToast } = useToast()
  const [status, setStatus] = useState(DEMO_TECHNICIAN.status)

  const handleStatusChange = (newStatus: 'Disponible' | 'En intervention' | 'Hors ligne') => {
    setStatus(newStatus)
    showToast(`Statut mis à jour : ${newStatus}`, 'success')
  }

  const statusBadgeColor = {
    'Disponible': 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    'En intervention': 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    'Hors ligne': 'bg-slate-500/10 text-slate-600 border-slate-500/20',
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary border-2 border-primary/20 font-bold text-xl flex items-center justify-center shadow-inner">
              MB
            </div>
            <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-card ${
              status === 'Disponible' ? 'bg-emerald-500' : status === 'En intervention' ? 'bg-amber-500' : 'bg-slate-400'
            }`} />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-foreground">{DEMO_TECHNICIAN.name}</h2>
              <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-secondary text-muted-foreground font-semibold">
                {DEMO_TECHNICIAN.id}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground mt-1">
              <span className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-primary" /> {DEMO_TECHNICIAN.department}
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-primary" /> {DEMO_TECHNICIAN.phone}
              </span>
            </div>
          </div>
        </div>

        {/* Status Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-secondary rounded-xl border border-border">
          {(['Disponible', 'En intervention', 'Hors ligne'] as const).map((st) => (
            <button
              key={st}
              onClick={() => handleStatusChange(st)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                status === st
                  ? 'bg-card text-foreground shadow-sm font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Current Assignment */}
      <div className="py-4 border-b border-border flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-amber-500" /> Affectation en cours
          </p>
          <p className="text-sm font-medium text-foreground">{DEMO_TECHNICIAN.currentAssignment}</p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20">
          En cours
        </span>
      </div>

      {/* Performance Statistics Grid */}
      <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 bg-secondary/50 rounded-xl border border-border/50">
          <p className="text-[11px] text-muted-foreground font-medium">Interventions totales</p>
          <p className="text-lg font-bold text-foreground mt-0.5">{DEMO_TECHNICIAN.stats.totalInterventions.toLocaleString()}</p>
        </div>
        <div className="p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
          <p className="text-[11px] text-emerald-600 font-medium">Terminées (OK)</p>
          <p className="text-lg font-bold text-emerald-600 mt-0.5">{DEMO_TECHNICIAN.stats.completed.toLocaleString()}</p>
        </div>
        <div className="p-3 bg-amber-500/5 rounded-xl border border-amber-500/10">
          <p className="text-[11px] text-amber-600 font-medium">En attente</p>
          <p className="text-lg font-bold text-amber-600 mt-0.5">{DEMO_TECHNICIAN.stats.pending}</p>
        </div>
        <div className="p-3 bg-blue-500/5 rounded-xl border border-blue-500/10">
          <p className="text-[11px] text-blue-600 font-medium">Taux de succès</p>
          <p className="text-lg font-bold text-blue-600 mt-0.5">{DEMO_TECHNICIAN.stats.successRate}</p>
        </div>
      </div>
    </div>
  )
}
