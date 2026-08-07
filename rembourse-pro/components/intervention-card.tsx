'use client'

import React from 'react'
import { Calendar, Clock, MapPin, User, CheckCircle2, XCircle, AlertCircle, FileText } from 'lucide-react'

export interface InterventionProps {
  reference: string
  type: string
  status: string
  technicianName: string
  date: string
  time: string
  address: string
  result: string
  description?: string
}

export function InterventionCard({ intervention }: { intervention: InterventionProps }) {
  const getStatusBadge = (status: string, result: string) => {
    if (result === 'OK' || status === 'Terminé' || status === 'completed') {
      return {
        label: 'Completed (OK)',
        color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
        icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
      }
    }
    if (result.includes('NOK') || status === 'NOK' || status === 'nok') {
      return {
        label: 'NOK',
        color: 'bg-red-500/10 text-red-600 border-red-500/20',
        icon: <XCircle className="w-4 h-4 text-red-500" />,
      }
    }
    if (status === 'En cours' || status === 'in_progress') {
      return {
        label: 'En cours',
        color: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
        icon: <AlertCircle className="w-4 h-4 text-amber-500" />,
      }
    }
    return {
      label: 'Planifié',
      color: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      icon: <Clock className="w-4 h-4 text-blue-500" />,
    }
  }

  const badge = getStatusBadge(intervention.status, intervention.result)

  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-sm hover:border-primary/40 hover:shadow-md transition-all space-y-4">
      {/* Header with Reference & Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20">
            Ref: {intervention.reference}
          </span>
          <span className="text-xs font-medium text-muted-foreground">{intervention.type}</span>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${badge.color}`}>
          {badge.icon}
          <span>{badge.label}</span>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <User className="w-3.5 h-3.5 text-primary shrink-0" />
          <span className="text-foreground font-medium">{intervention.technicianName}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
          <span>{intervention.date}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
          <span>{intervention.time}</span>
        </div>
        <div className="flex items-center gap-2 sm:col-span-2">
          <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
          <span className="text-foreground truncate">{intervention.address}</span>
        </div>
      </div>

      {/* Result & Description */}
      {intervention.description && (
        <div className="pt-3 border-t border-border/60 text-xs text-muted-foreground bg-secondary/30 p-2.5 rounded-lg">
          <span className="font-semibold text-foreground">Résultat: </span>
          {intervention.result} - {intervention.description}
        </div>
      )}
    </div>
  )
}
