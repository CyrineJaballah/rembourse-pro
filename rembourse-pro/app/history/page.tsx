'use client'

import { ExpenseTable } from '@/components/expense-table'
import { Header } from '@/components/header'
import { Sidebar } from '@/components/sidebar'
import { Download } from 'lucide-react'

export default function HistoryPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto p-4 md:p-8">
          {/* Page Header */}
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-3xl font-bold text-foreground">Reimbursement History</h2>
              <p className="text-muted-foreground mt-1">View and manage all your expense submissions</p>
            </div>
            <button className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 font-medium text-foreground hover:bg-secondary transition-colors">
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>

          {/* Stats Summary */}
          <div className="mb-8 grid gap-4 md:grid-cols-4">
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="text-xs font-medium text-muted-foreground">Total Submitted</p>
              <p className="mt-2 text-2xl font-bold text-foreground">$1,920.25</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="text-xs font-medium text-muted-foreground">Approved</p>
              <p className="mt-2 text-2xl font-bold text-green-600 dark:text-green-400">$1,620.25</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="text-xs font-medium text-muted-foreground">Pending</p>
              <p className="mt-2 text-2xl font-bold text-yellow-600 dark:text-yellow-400">$125.50</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="text-xs font-medium text-muted-foreground">Rejected</p>
              <p className="mt-2 text-2xl font-bold text-red-600 dark:text-red-400">$174.50</p>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-xl border border-border bg-card shadow-sm p-6">
            <ExpenseTable />
          </div>
        </main>
      </div>
    </div>
  )
}
