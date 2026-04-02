"use client"

import { cn } from "@/lib/utils"
import { LucideIcon, ChevronRight } from "lucide-react"
import { ReactNode } from "react"

interface DashboardPanelProps {
  title: string
  icon?: LucideIcon
  action?: {
    label: string
    onClick: () => void
  }
  children: ReactNode
  className?: string
  noPadding?: boolean
}

export function DashboardPanel({
  title,
  icon: Icon,
  action,
  children,
  className,
  noPadding = false,
}: DashboardPanelProps) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-lg border border-border bg-card overflow-hidden",
        className
      )}
    >
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="h-3.5 w-3.5 text-muted-foreground" />}
          <span className="text-xs font-medium text-foreground uppercase tracking-wide">
            {title}
          </span>
        </div>
        {action && (
          <button
            onClick={action.onClick}
            className="flex items-center gap-0.5 text-[10px] text-primary hover:text-primary/80 transition-colors"
          >
            {action.label}
            <ChevronRight className="h-3 w-3" />
          </button>
        )}
      </div>
      <div className={cn("flex-1", !noPadding && "p-3")}>{children}</div>
    </div>
  )
}

interface MetricRowProps {
  label: string
  value: string | number
  subValue?: string
  variant?: "default" | "success" | "warning" | "danger"
}

export function MetricRow({ label, value, subValue, variant = "default" }: MetricRowProps) {
  const valueColor = {
    default: "text-foreground",
    success: "text-success",
    warning: "text-warning",
    danger: "text-destructive",
  }

  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="flex items-baseline gap-1.5">
        <span className={cn("text-sm font-medium", valueColor[variant])}>{value}</span>
        {subValue && (
          <span className="text-[10px] text-muted-foreground">{subValue}</span>
        )}
      </div>
    </div>
  )
}

interface ProgressBarProps {
  value: number
  max?: number
  label?: string
  showPercentage?: boolean
  size?: "sm" | "md"
  variant?: "default" | "success" | "warning" | "danger"
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showPercentage = true,
  size = "sm",
  variant = "default",
}: ProgressBarProps) {
  const percentage = Math.min(Math.round((value / max) * 100), 100)
  
  const barColor = {
    default: "bg-primary",
    success: "bg-success",
    warning: "bg-warning",
    danger: "bg-destructive",
  }

  const height = size === "sm" ? "h-1.5" : "h-2"

  return (
    <div className="flex flex-col gap-1">
      {(label || showPercentage) && (
        <div className="flex items-center justify-between">
          {label && <span className="text-xs text-muted-foreground">{label}</span>}
          {showPercentage && (
            <span className="text-xs font-medium text-foreground">{percentage}%</span>
          )}
        </div>
      )}
      <div className={cn("w-full rounded-full bg-muted overflow-hidden", height)}>
        <div
          className={cn("h-full rounded-full transition-all", barColor[variant])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

interface ActivityItemProps {
  icon: LucideIcon
  title: string
  description: string
  time: string
  onClick?: () => void
}

export function ActivityItem({ icon: Icon, title, description, time, onClick }: ActivityItemProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-start gap-2.5 py-2 px-1 rounded transition-colors",
        onClick && "cursor-pointer hover:bg-accent/50"
      )}
    >
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-muted">
        <Icon className="h-3 w-3 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-foreground truncate">{title}</p>
        <p className="text-[10px] text-muted-foreground truncate">{description}</p>
      </div>
      <span className="text-[10px] text-muted-foreground shrink-0">{time}</span>
    </div>
  )
}

interface DocumentItemProps {
  name: string
  type: string
  date: string
  onClick?: () => void
}

export function DocumentItem({ name, type, date, onClick }: DocumentItemProps) {
  const typeColors: Record<string, string> = {
    pdf: "bg-destructive/15 text-destructive",
    doc: "bg-primary/15 text-primary",
    xls: "bg-success/15 text-success",
    img: "bg-warning/15 text-warning",
    default: "bg-muted text-muted-foreground",
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center gap-2.5 py-1.5 px-1 rounded transition-colors",
        onClick && "cursor-pointer hover:bg-accent/50"
      )}
    >
      <span
        className={cn(
          "inline-flex items-center justify-center px-1.5 py-0.5 text-[9px] font-medium rounded uppercase",
          typeColors[type] || typeColors.default
        )}
      >
        {type}
      </span>
      <span className="flex-1 text-xs text-foreground truncate">{name}</span>
      <span className="text-[10px] text-muted-foreground shrink-0">{date}</span>
    </div>
  )
}

interface IssueItemProps {
  id: string
  title: string
  severity: "low" | "medium" | "high" | "critical"
  assignee?: string
  onClick?: () => void
}

export function IssueItem({ id, title, severity, assignee, onClick }: IssueItemProps) {
  const severityConfig = {
    low: { color: "bg-muted", dot: "bg-muted-foreground" },
    medium: { color: "bg-warning/15", dot: "bg-warning" },
    high: { color: "bg-destructive/15", dot: "bg-destructive" },
    critical: { color: "bg-destructive/20", dot: "bg-destructive" },
  }

  const config = severityConfig[severity]

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center gap-2.5 py-1.5 px-2 rounded transition-colors",
        config.color,
        onClick && "cursor-pointer hover:opacity-80"
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", config.dot)} />
      <span className="text-[10px] text-muted-foreground font-mono shrink-0">{id}</span>
      <span className="flex-1 text-xs text-foreground truncate">{title}</span>
      {assignee && (
        <span className="text-[10px] text-muted-foreground shrink-0">{assignee}</span>
      )}
    </div>
  )
}

interface TaskItemProps {
  title: string
  status: "pending" | "in-progress" | "completed"
  dueDate?: string
  onClick?: () => void
}

export function TaskItem({ title, status, dueDate, onClick }: TaskItemProps) {
  const statusConfig = {
    pending: { dot: "bg-muted-foreground", border: "border-muted" },
    "in-progress": { dot: "bg-primary", border: "border-primary/30" },
    completed: { dot: "bg-success", border: "border-success/30" },
  }

  const config = statusConfig[status]

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center gap-2.5 py-1.5 px-1 rounded transition-colors",
        onClick && "cursor-pointer hover:bg-accent/50"
      )}
    >
      <span
        className={cn(
          "h-3 w-3 rounded-full border-2 shrink-0 flex items-center justify-center",
          config.border
        )}
      >
        {status === "completed" && (
          <span className={cn("h-1.5 w-1.5 rounded-full", config.dot)} />
        )}
      </span>
      <span
        className={cn(
          "flex-1 text-xs truncate",
          status === "completed" ? "text-muted-foreground line-through" : "text-foreground"
        )}
      >
        {title}
      </span>
      {dueDate && (
        <span className="text-[10px] text-muted-foreground shrink-0">{dueDate}</span>
      )}
    </div>
  )
}

interface MaterialStatusProps {
  label: string
  count: number
  total: number
  color: "default" | "warning" | "success" | "primary"
}

export function MaterialStatus({ label, count, total, color }: MaterialStatusProps) {
  const colors = {
    default: "text-muted-foreground",
    warning: "text-warning",
    success: "text-success",
    primary: "text-primary",
  }

  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="flex items-baseline gap-1">
        <span className={cn("text-sm font-medium", colors[color])}>{count}</span>
        <span className="text-[10px] text-muted-foreground">/ {total}</span>
      </div>
    </div>
  )
}
