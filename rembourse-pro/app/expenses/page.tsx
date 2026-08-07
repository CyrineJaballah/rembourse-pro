'use client'

import { ExpenseForm } from '@/components/expense-form'
import { Header } from '@/components/header'
import { Sidebar } from '@/components/sidebar'

export default function ExpensesPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto p-4 md:p-8">
          {/* Page Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground">Submit Expense</h2>
            <p className="text-muted-foreground mt-1">Add a new reimbursement request with receipt</p>
          </div>

          {/* Form Container */}
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
                <ExpenseForm />
              </div>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-6">
              {/* Tips Card */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <h3 className="font-semibold text-foreground mb-4">Submission Tips</h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex gap-3">
                    <span className="text-primary font-bold">→</span>
                    <span>Include business purpose in description</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold">→</span>
                    <span>Upload clear receipt photos</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold">→</span>
                    <span>Submit within 30 days</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold">→</span>
                    <span>Include all relevant details</span>
                  </li>
                </ul>
              </div>

              {/* Policy Card */}
              <div className="rounded-xl border border-border bg-secondary p-6">
                <h3 className="font-semibold text-foreground mb-3">Reimbursement Policy</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Reimbursements must be submitted within 30 days of the expense. All expenses require valid
                  receipts. Maximum per expense is $5,000 unless pre-approved.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
