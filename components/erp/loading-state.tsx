import { cn } from "@/lib/utils"

interface LoadingStateProps {
  rows?: number
  className?: string
}

export function LoadingState({ rows = 5, className }: LoadingStateProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-3 animate-pulse">
          <div className="h-4 w-4 rounded bg-muted" />
          <div className="h-4 flex-1 rounded bg-muted" />
          <div className="h-4 w-24 rounded bg-muted" />
          <div className="h-4 w-16 rounded bg-muted" />
          <div className="h-4 w-20 rounded bg-muted" />
        </div>
      ))}
    </div>
  )
}

export function TableLoadingState({ rows = 8 }: { rows?: number }) {
  return (
    <div className="w-full">
      <div className="flex items-center gap-4 p-3 border-b border-border">
        {[1, 2, 3, 4, 5].map((col) => (
          <div key={col} className="h-3 rounded bg-muted flex-1 animate-pulse" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-3 border-b border-border/50">
          {[1, 2, 3, 4, 5].map((col) => (
            <div
              key={col}
              className="h-4 rounded bg-muted/60 flex-1 animate-pulse"
              style={{ animationDelay: `${i * 50}ms` }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
