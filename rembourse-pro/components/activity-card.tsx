import { CheckCircle, XCircle, Clock } from 'lucide-react'

interface ActivityItem {
  id: string
  description: string
  amount: number
  timestamp: string
  status: 'approved' | 'rejected' | 'pending'
}

const mockActivity: ActivityItem[] = [
  {
    id: '1',
    description: 'Flight to New York approved',
    amount: 450,
    timestamp: '2 hours ago',
    status: 'approved',
  },
  {
    id: '2',
    description: 'Team lunch submitted',
    amount: 125.5,
    timestamp: '1 day ago',
    status: 'pending',
  },
  {
    id: '3',
    description: 'Office supplies rejected',
    amount: 45.75,
    timestamp: '3 days ago',
    status: 'rejected',
  },
]

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'approved':
      return <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
    case 'rejected':
      return <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
    default:
      return <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
  }
}

export function ActivityCard() {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {mockActivity.map((item) => (
          <div key={item.id} className="flex items-center gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
            <div>{getStatusIcon(item.status)}</div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">{item.description}</p>
              <p className="text-xs text-muted-foreground">{item.timestamp}</p>
            </div>
            <p className="font-semibold text-foreground flex-shrink-0">${item.amount.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
