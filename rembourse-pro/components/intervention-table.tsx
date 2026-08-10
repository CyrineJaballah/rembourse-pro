'use client'

import React, { useState, useMemo } from 'react'
import { InterventionProps } from './intervention-card'
import { Search, Filter, CheckCircle2, XCircle, Clock, Eye, Edit2, ChevronLeft, ChevronRight, FileDown } from 'lucide-react'
import { useToast } from '@/lib/toast-context'

export function InterventionTable({ data }: { data: InterventionProps[] }) {
  const { showToast } = useToast()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 5

  const filtered = useMemo(() => {
    return data.filter((item) => {
      const matchSearch =
        item.reference.toLowerCase().includes(search.toLowerCase()) ||
        item.technicianName.toLowerCase().includes(search.toLowerCase()) ||
        item.address.toLowerCase().includes(search.toLowerCase()) ||
        item.type.toLowerCase().includes(search.toLowerCase())

      if (statusFilter === 'all') return matchSearch
      if (statusFilter === 'completed') return matchSearch && (item.result === 'OK' || item.status === 'Terminé')
      if (statusFilter === 'nok') return matchSearch && (item.result.includes('NOK') || item.status === 'NOK')
      if (statusFilter === 'pending') return matchSearch && (item.status === 'En cours' || item.status === 'Planifié')
      return matchSearch
    })
  }, [data, search, statusFilter])

  const totalPages = Math.ceil(filtered.length / pageSize) || 1
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }, [filtered, currentPage, pageSize])

  const handleExport = () => {
    showToast('Export CSV généré avec succès', 'success')
  }

  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
      {/* Table Controls Header */}
      <div className="p-4 sm:p-6 border-b border-border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-card">
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher technicien, réf (ex: 23517560), adresse..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-border bg-secondary/50 focus:bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 p-1 bg-secondary/70 rounded-xl border border-border">
            {[
              { id: 'all', label: 'Tous' },
              { id: 'completed', label: 'OK' },
              { id: 'nok', label: 'NOK' },
              { id: 'pending', label: 'En cours' },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => {
                  setStatusFilter(st.id)
                  setCurrentPage(1)
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  statusFilter === st.id
                    ? 'bg-card text-foreground shadow-sm font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-xl border border-border bg-secondary hover:bg-secondary/80 text-foreground transition-colors"
          >
            <FileDown className="w-3.5 h-3.5 text-primary" />
            <span className="hidden sm:inline">Exporter</span>
          </button>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-secondary/30 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              <th className="py-3.5 px-6">Référence</th>
              <th className="py-3.5 px-4">Grille</th>
              <th className="py-3.5 px-4">Type</th>
              <th className="py-3.5 px-4">Date & Heure</th>
              <th className="py-3.5 px-4">Adresse</th>
              <th className="py-3.5 px-4">Statut / Résultat</th>
              <th className="py-3.5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-xs">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-muted-foreground">
                  Aucune intervention trouvée pour cette recherche.
                </td>
              </tr>
            ) : (
              paginated.map((row) => (
                <tr key={row.reference} className="hover:bg-secondary/40 transition-colors group">
                  <td className="py-3.5 px-6 font-mono font-bold text-primary">
                    #{row.reference}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-foreground">
                    {row.technicianName}
                  </td>
                  <td className="py-3.5 px-4 text-muted-foreground">
                    {row.type}
                  </td>
                  <td className="py-3.5 px-4 text-muted-foreground">
                    <div>{row.date}</div>
                    <div className="text-[10px] text-muted-foreground">{row.time}</div>
                  </td>
                  <td className="py-3.5 px-4 text-foreground max-w-[200px] truncate" title={row.address}>
                    {row.address}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                        row.result === 'OK' || row.status === 'Terminé'
                          ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                          : row.result.includes('NOK')
                          ? 'bg-red-500/10 text-red-600 border-red-500/20'
                          : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                      }`}
                    >
                      {row.result === 'OK' ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      ) : row.result.includes('NOK') ? (
                        <XCircle className="w-3.5 h-3.5 text-red-500" />
                      ) : (
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                      )}
                      {row.result}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => showToast(`Détails de l'intervention #${row.reference}`, 'info')}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                        title="Voir détails"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => showToast(`Édition de l'intervention #${row.reference}`, 'info')}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                        title="Modifier"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div className="p-4 border-t border-border flex items-center justify-between bg-card text-xs text-muted-foreground">
        <div>
          Affichage de <span className="font-semibold text-foreground">{paginated.length}</span> sur{' '}
          <span className="font-semibold text-foreground">{filtered.length}</span> interventions
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-xl border border-border bg-secondary hover:bg-secondary/80 disabled:opacity-40 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-medium text-foreground">
            Page {currentPage} sur {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-xl border border-border bg-secondary hover:bg-secondary/80 disabled:opacity-40 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
