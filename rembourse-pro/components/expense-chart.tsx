'use client'

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
const data = [45, 62, 48, 71, 55, 68]
const maxValue = Math.max(...data)

export function ExpenseChart() {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-foreground mb-6">Expenses Over Time</h3>
      
      {/* Chart */}
      <div className="flex items-end justify-between gap-2 h-64">
        {data.map((value, index) => {
          const height = (value / maxValue) * 100
          return (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div
                className="w-full rounded-t-lg bg-gradient-to-t from-primary to-accent hover:from-primary/80 hover:to-accent/80 transition-all cursor-pointer group relative"
                style={{ height: `${height}%` }}
              >
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 rounded bg-foreground px-2 py-1 text-xs font-medium text-background opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  ${value}k
                </div>
              </div>
              <span className="text-xs font-medium text-muted-foreground">{months[index]}</span>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center justify-center gap-4">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-primary" />
          <span className="text-xs text-muted-foreground">Expenses</span>
        </div>
      </div>
    </div>
  )
}
