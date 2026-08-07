'use client'

import { useState } from 'react'
import { getAllAdvanceRequests, approveAdvanceRequest, rejectAdvanceRequest } from '@/app/actions/advance-requests'
import { t } from '@/lib/translations'
import useSWR, { mutate } from 'swr'
import { CheckCircle, XCircle, DollarSign } from 'lucide-react'
import { useToast } from '@/lib/toast-context'
import { SkeletonTable } from '@/components/ui/skeleton-loader'

async function advancesFetcher() {
  return getAllAdvanceRequests()
}

export default function AdminAdvanceRequestsPage() {
  const { showToast } = useToast()
  const { data: advances = [], isLoading } = useSWR('/api/admin/advance-requests', advancesFetcher, {
    revalidateOnFocus: false,
  })
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [processing, setProcessing] = useState<number | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')

  const filteredAdvances = advances.filter((adv: any) => {
    if (filter === 'all') return true
    return adv.status === filter
  })

  const handleApprove = async (id: number) => {
    setProcessing(id)
    try {
      await approveAdvanceRequest(id, 'admin')
      showToast('Demande d\'acompte approuvée !', 'success')
      mutate('/api/admin/advance-requests')
      setExpandedId(null)
    } catch (error) {
      console.error('Erreur:', error)
      showToast('Erreur lors de l\'approbation', 'error')
    } finally {
      setProcessing(null)
    }
  }

  const handleReject = async (id: number) => {
    if (!rejectionReason.trim()) {
      showToast('Veuillez spécifier un motif de rejet', 'warning')
      return
    }
    setProcessing(id)
    try {
      await rejectAdvanceRequest(id, rejectionReason)
      showToast('Demande d\'acompte rejetée', 'info')
      mutate('/api/admin/advance-requests')
      setRejectionReason('')
      setExpandedId(null)
    } catch (error) {
      console.error('Erreur:', error)
      showToast('Erreur lors du rejet', 'error')
    } finally {
      setProcessing(null)
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatCurrency = (amount: string | number) => {
    return new Number(amount).toLocaleString('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
      case 'rejected':
        return 'bg-red-500/10 text-red-600 border-red-500/20'
      default:
        return 'bg-amber-500/10 text-amber-600 border-amber-500/20'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          {t('admin.advances.title')}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Traitement et validation des avances sur trésorerie techniciens TARCOM
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 p-1 bg-secondary/50 rounded-xl border border-border w-fit">
        {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === status
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {status === 'all' ? 'Tous' : status === 'pending' ? 'En attente' : status === 'approved' ? 'Approuvés' : 'Rejetés'}
          </button>
        ))}
      </div>

      {/* Requests List */}
      {isLoading ? (
        <SkeletonTable />
      ) : filteredAdvances.length === 0 ? (
        <div className="bg-card border border-dashed border-border rounded-2xl p-12 text-center">
          <DollarSign className="w-8 h-8 text-muted-foreground mx-auto mb-3 opacity-50" />
          <p className="text-foreground font-semibold">{t('admin.advances.no-advances')}</p>
          <p className="text-muted-foreground text-xs mt-1">Aucune demande d&apos;acompte enregistrée dans cette catégorie</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAdvances.map((advance: any) => (
            <div
              key={advance.id}
              className="bg-card border border-border rounded-2xl p-5 hover:border-primary/40 transition-all shadow-sm"
            >
              <div
                className="cursor-pointer"
                onClick={() => setExpandedId(expandedId === advance.id ? null : advance.id)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="mb-1">
                      <h3 className="font-bold text-foreground text-sm">Demande d&apos;acompte #{advance.id}</h3>
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-muted-foreground">{formatDate(advance.requestedAt)}</span>
                      <span className="font-bold text-primary text-sm">{formatCurrency(advance.amount)}</span>
                    </div>
                    {advance.reason && (
                      <p className="text-xs text-muted-foreground mt-2 line-clamp-1">
                        Motif: {advance.reason}
                      </p>
                    )}
                  </div>
                  <div>
                    <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full border ${getStatusColor(advance.status)}`}>
                      {t(`status.${advance.status}` as any)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedId === advance.id && (
                <div className="mt-4 border-t border-border pt-4 space-y-4">
                  <div className="bg-secondary/50 rounded-xl p-4 border border-border space-y-2 text-xs">
                    <p><span className="font-semibold text-foreground">Montant demandé:</span> {formatCurrency(advance.amount)}</p>
                    <p><span className="font-semibold text-foreground">Date de la demande:</span> {formatDate(advance.requestedAt)}</p>
                    {advance.reason && <p><span className="font-semibold text-foreground">Motif:</span> {advance.reason}</p>}
                  </div>

                  {advance.status === 'pending' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-foreground mb-1.5">
                          Motif éventuel du rejet
                        </label>
                        <textarea
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          placeholder="Exemple: Plafond dépassé pour la période en cours..."
                          className="w-full px-3 py-2 bg-secondary border border-border rounded-xl text-xs text-foreground resize-none h-20 focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => handleApprove(advance.id)}
                          disabled={processing === advance.id}
                          className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white transition-colors disabled:opacity-50"
                        >
                          <CheckCircle className="w-4 h-4" />
                          {processing === advance.id ? 'Traitement...' : 'Approuver l\'acompte'}
                        </button>
                        <button
                          onClick={() => handleReject(advance.id)}
                          disabled={processing === advance.id}
                          className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-border bg-card text-foreground hover:bg-secondary px-4 py-2.5 text-xs font-bold transition-colors disabled:opacity-50"
                        >
                          <XCircle className="w-4 h-4" />
                          {processing === advance.id ? 'Traitement...' : 'Rejeter'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
