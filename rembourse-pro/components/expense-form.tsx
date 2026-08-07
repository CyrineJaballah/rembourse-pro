'use client'

import { Upload, X } from 'lucide-react'
import { useState } from 'react'

const categories = [
  { id: 'travel', label: 'Travel', emoji: '✈️' },
  { id: 'meals', label: 'Meals', emoji: '🍽️' },
  { id: 'supplies', label: 'Office Supplies', emoji: '📎' },
  { id: 'accommodation', label: 'Accommodation', emoji: '🏨' },
  { id: 'software', label: 'Software', emoji: '💻' },
  { id: 'other', label: 'Other', emoji: '📦' },
]

export function ExpenseForm() {
  const [selectedCategory, setSelectedCategory] = useState('travel')
  const [receipt, setReceipt] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setReceipt(e.dataTransfer.files[0])
    }
  }

  return (
    <form className="space-y-6">
      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Description</label>
        <input
          type="text"
          placeholder="e.g., Client meeting in New York"
          className="w-full rounded-lg border border-border bg-input px-4 py-2.5 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
        />
      </div>

      {/* Amount and Date Row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Amount ($)</label>
          <input
            type="number"
            placeholder="0.00"
            className="w-full rounded-lg border border-border bg-input px-4 py-2.5 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Date</label>
          <input
            type="date"
            className="w-full rounded-lg border border-border bg-input px-4 py-2.5 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
          />
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-3">Category</label>
        <div className="grid grid-cols-3 gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`rounded-lg border-2 p-3 transition-all text-center ${
                selectedCategory === cat.id
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-card hover:border-primary/30'
              }`}
            >
              <div className="text-xl mb-1">{cat.emoji}</div>
              <div className="text-xs font-medium text-foreground">{cat.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* File Upload */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Receipt</label>
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`rounded-lg border-2 border-dashed transition-all p-8 text-center ${
            dragActive
              ? 'border-primary bg-primary/5'
              : 'border-border bg-secondary hover:border-primary/50'
          }`}
        >
          <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm font-medium text-foreground">Drag and drop your receipt</p>
          <p className="text-xs text-muted-foreground mt-1">or click to browse</p>
          <input type="file" hidden />
          {receipt && (
            <div className="mt-4 flex items-center justify-center gap-2 bg-primary/10 rounded p-3">
              <span className="text-xs font-medium text-foreground">{receipt.name}</span>
              <button
                type="button"
                onClick={() => setReceipt(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="flex-1 rounded-lg bg-primary px-6 py-2.5 font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Submit Expense
        </button>
        <button
          type="button"
          className="flex-1 rounded-lg border border-border bg-card px-6 py-2.5 font-medium text-foreground hover:bg-secondary transition-colors"
        >
          Save as Draft
        </button>
      </div>
    </form>
  )
}
