import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface SummaryCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: LucideIcon
  trend?: {
    value: number
    label: string
  }
  className?: string
}

export function SummaryCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  className,
}: SummaryCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 p-4 rounded-lg border border-border bg-card",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {title}
        </span>
        {Icon && (
          <div className="flex h-7 w-7 items-center justify-center rounded bg-muted">
            <Icon className="h-4 w-4 text-muted-foreground" />
          </div>
        )}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-semibold text-foreground">{value}</span>
        {trend && (
          <span
            className={cn(
              "text-xs font-medium",
              trend.value >= 0 ? "text-success" : "text-destructive"
            )}
          >
            {trend.value >= 0 ? "+" : ""}
            {trend.value}% {trend.label}
          </span>
        )}
      </div>
      {subtitle && (
        <span className="text-xs text-muted-foreground">{subtitle}</span>
      )}
    </div>
  )
}

interface SummaryCardGridProps {
  children: React.ReactNode
  columns?: 2 | 3 | 4 | 5
  className?: string
}

export function SummaryCardGrid({
  children,
  columns = 4,
  className,
}: SummaryCardGridProps) {
  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
  }

  return (
    <div
      className={cn(
        "grid gap-4",
        gridCols[columns],
        className
      )}
    >
      {children}
    </div>
  )
}
