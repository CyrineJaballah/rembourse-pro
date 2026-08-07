'use client'

import { useToast } from '@/lib/toast-context'
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react'

export function ToastContainer() {
  const { toasts, removeToast } = useToast()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 max-w-md w-full px-4 pointer-events-none">
      {toasts.map((toast) => {
        let bg = 'bg-card border-border text-foreground'
        let icon = <Info className="w-5 h-5 text-blue-500 shrink-0" />

        if (toast.type === 'success') {
          bg = 'bg-emerald-950/90 border-emerald-800 text-emerald-100 shadow-emerald-950/20'
          icon = <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
        } else if (toast.type === 'error') {
          bg = 'bg-red-950/90 border-red-800 text-red-100 shadow-red-950/20'
          icon = <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
        } else if (toast.type === 'warning') {
          bg = 'bg-amber-950/90 border-amber-800 text-amber-100 shadow-amber-950/20'
          icon = <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-md transition-all duration-300 animate-in slide-in-from-bottom-3 ${bg}`}
          >
            <div className="flex items-center gap-3">
              {icon}
              <p className="text-sm font-medium">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Fermer"
            >
              <X className="w-4 h-4 opacity-70 hover:opacity-100" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
