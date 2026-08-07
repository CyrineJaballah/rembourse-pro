import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  icon: LucideIcon
  color?: 'blue' | 'green' | 'orange' | 'red'
}

const colorClasses = {
  blue: 'bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400',
  green: 'bg-green-50 text-green-600 dark:bg-green-950/30 dark:text-green-400',
  orange: 'bg-orange-50 text-orange-600 dark:bg-orange-950/30 dark:text-orange-400',
  red: 'bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400',
}

const changeClasses = {
  positive: 'text-green-600 dark:text-green-400',
  negative: 'text-red-600 dark:text-red-400',
  neutral: 'text-muted-foreground',
}

export function StatCard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  color = 'blue',
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
          {change && (
            <p className={`mt-2 text-xs font-medium ${changeClasses[changeType]}`}>
              {changeType === 'positive' ? '↑' : changeType === 'negative' ? '↓' : ''} {change}
            </p>
          )}
        </div>
        <div className={`rounded-lg p-3 ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  )
}
