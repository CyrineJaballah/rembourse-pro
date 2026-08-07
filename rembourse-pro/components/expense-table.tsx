'use client'

import { ChevronDown, Search } from 'lucide-react'
import { useState } from 'react'

interface Expense {
  id: string
  description: string
  amount: number
  category: string
  date: string
  status: 'pending' | 'approved' | 'rejected'
  receipt: string
}

const mockExpenses: Expense[] = [
  {
    id: '1',
    description: 'Flight to New York - Client Meeting',
    amount: 450,
    category: 'Travel',
    date: '2024-01-15',
    status: 'approved',
    receipt: 'receipt_001.pdf',
  },
  {
    id: '2',
    description: 'Team Lunch - Project Kickoff',
    amount: 125.50,
    category: 'Meals',
    date: '2024-01-14',
    status: 'pending',
    receipt: 'receipt_002.pdf',
  },
  {
    id: '3',
    description: 'Software License - Annual',
    amount: 299,
    category: 'Software',
    date: '2024-01-10',
    status: 'approved',
    receipt: 'receipt_003.pdf',
  },
  {
    id: '4',
    description: 'Office Supplies - Stationery',
    amount: 45.75,
    category: 'Supplies',
    date: '2024-01-08',
    status: 'rejected',
    receipt: 'receipt_004.pdf',
  },
]

const statusConfig = {
  approved: { label: 'Approved', color: 'bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-400' },
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/30 dark:text-yellow-400' },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-800 dark:bg-red-950/30 dark:text-red-400' },
}

export function ExpenseTable() {
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredExpenses = mockExpenses.filter((expense) => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || expense.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 md:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search expenses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-border bg-input pl-10 pr-4 py-2.5 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-border bg-card px-4 py-2.5 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full">
          <thead className="border-b border-border bg-secondary">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-foreground">Description</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-foreground">Category</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-foreground">Amount</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-foreground">Date</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-foreground">Status</th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.map((expense) => (
              <tr
                key={expense.id}
                className="border-b border-border hover:bg-secondary/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <p className="font-medium text-foreground">{expense.description}</p>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{expense.category}</td>
                <td className="px-6 py-4 text-right font-semibold text-foreground">${expense.amount.toFixed(2)}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {new Date(expense.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                      statusConfig[expense.status as keyof typeof statusConfig].color
                    }`}
                  >
                    {statusConfig[expense.status as keyof typeof statusConfig].label}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => setExpandedRow(expandedRow === expense.id ? null : expense.id)}
                    className="inline-flex items-center justify-center rounded p-2 hover:bg-secondary transition-colors"
                  >
                    <ChevronDown
                      className={`h-4 w-4 text-muted-foreground transition-transform ${
                        expandedRow === expense.id ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filteredExpenses.length === 0 && (
        <div className="rounded-lg border border-border bg-card py-12 text-center">
          <p className="text-muted-foreground">No expenses found matching your filters.</p>
        </div>
      )}
    </div>
  )
}
