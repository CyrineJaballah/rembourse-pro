'use client'

import { useState } from 'react'
import { getAllExpenses, updateExpenseStatus } from '@/app/actions/expenses'
import { t } from '@/lib/translations'
import useSWR, { mutate } from 'swr'
import { CheckCircle, XCircle, FileText, Filter } from 'lucide-react'
import { useToast } from '@/lib/toast-context'
import { SkeletonTable } from '@/components/ui/skeleton-loader'

async function expensesFetcher() {
  return getAllExpenses()
}

export default function AdminExpensesPage() {
  const { showToast } = useToast()
  const { data: expenses = [], isLoading } = useSWR('/api/admin/expenses', expensesFetcher, {
    revalidateOnFocus: false,
  })
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [processing, setProcessing] = useState<number | null>(null)

  const filteredExpenses = expenses.filter((exp: any) => {
    if (filter === 'all') return true
    return exp.status === filter
  })

  const handleApprove = async (id: number) => {
    setProcessing(id)
    try {
      await updateExpenseStatus(id, 'approved')
      showToast('Frais approuvés avec succès !', 'success')
      mutate('/api/admin/expenses')
    } catch (error) {
      console.error('Erreur:', error)
      showToast('Erreur lors de l\'approbation', 'error')
    } finally {
      setProcessing(null)
      setExpandedId(null)
    }
  }

  const handleReject = async (id: number) => {
    setProcessing(id)
    try {
      await updateExpenseStatus(id, 'rejected')
      showToast('Frais rejetés', 'warning')
      mutate('/api/admin/expenses')
    } catch (error) {
      console.error('Erreur:', error)
      showToast('Erreur lors du rejet', 'error')
    } finally {
      setProcessing(null)
      setExpandedId(null)
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
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
          {t('admin.expenses.title')}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Validez et contrôlez les notes de frais soumises par les techniciens TARCOM
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

      {/* Expenses List */}
      {isLoading ? (
        <SkeletonTable />
      ) : filteredExpenses.length === 0 ? (
        <div className="bg-card border border-dashed border-border rounded-2xl p-12 text-center">
          <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-3 opacity-50" />
          <p className="text-foreground font-semibold">{t('admin.expenses.no-expenses')}</p>
          <p className="text-muted-foreground text-xs mt-1">Aucune note de frais dans cette catégorie</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredExpenses.map((expense: any) => (
            <div
              key={expense.id}
              className="bg-card border border-border rounded-2xl p-5 hover:border-primary/40 transition-all shadow-sm"
            >
              <div
                className="cursor-pointer"
                onClick={() => setExpandedId(expandedId === expense.id ? null : expense.id)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1.5">
                      <h3 className="font-bold text-foreground text-sm">{expense.description || expense.category}</h3>
                      <span className="inline-block rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                        {expense.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{formatDate(expense.createdAt)}</span>
                      <span className="font-bold text-foreground text-sm">{formatCurrency(expense.amount)}</span>
                    </div>
                  </div>
                  <div>
                    <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full border ${getStatusColor(expense.status)}`}>
                      {t(`status.${expense.status}` as any)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedId === expense.id && (
                <div className="mt-4 border-t border-border pt-4 space-y-4">
                  {expense.receiptUrl && (
                    <div className="bg-secondary/50 rounded-xl p-3 border border-border">
                      <p className="text-[11px] font-semibold text-muted-foreground mb-1">Justificatif joint</p>
                      <p className="text-xs font-mono text-primary truncate">{expense.receiptUrl}</p>
                    </div>
                  )}

                  {expense.status === 'pending' && (
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => handleApprove(expense.id)}
                        disabled={processing === expense.id}
                        className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white transition-colors disabled:opacity-50"
                      >
                        <CheckCircle className="w-4 h-4" />
                        {processing === expense.id ? 'Traitement...' : 'Approuver les frais'}
                      </button>
                      <button
                        onClick={() => handleReject(expense.id)}
                        disabled={processing === expense.id}
                        className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-border bg-card text-foreground hover:bg-secondary px-4 py-2.5 text-xs font-bold transition-colors disabled:opacity-50"
                      >
                        <XCircle className="w-4 h-4" />
                        {processing === expense.id ? 'Traitement...' : 'Rejeter'}
                      </button>
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
