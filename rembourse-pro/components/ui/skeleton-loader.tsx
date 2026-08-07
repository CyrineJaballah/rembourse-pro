'use client'

export function SkeletonLoader({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-lg bg-secondary/70 ${className}`} />
  )
}

export function SkeletonCard() {
  return (
    <div className="bg-card border border-border rounded-xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <SkeletonLoader className="h-4 w-28" />
        <SkeletonLoader className="h-8 w-8 rounded-full" />
      </div>
      <SkeletonLoader className="h-8 w-36" />
      <SkeletonLoader className="h-3 w-20" />
    </div>
  )
}

export function SkeletonTable() {
  return (
    <div className="bg-card border border-border rounded-xl p-6 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <SkeletonLoader className="h-6 w-48" />
        <SkeletonLoader className="h-9 w-32 rounded-lg" />
      </div>
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center justify-between py-3 border-b border-border/50">
            <div className="space-y-2">
              <SkeletonLoader className="h-4 w-40" />
              <SkeletonLoader className="h-3 w-24" />
            </div>
            <SkeletonLoader className="h-6 w-20 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function SkeletonDashboard() {
  return (
    <div className="space-y-8 p-6">
      <div className="space-y-2">
        <SkeletonLoader className="h-8 w-64" />
        <SkeletonLoader className="h-4 w-48" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <SkeletonTable />
        </div>
        <div>
          <SkeletonCard />
        </div>
      </div>
    </div>
  )
}
