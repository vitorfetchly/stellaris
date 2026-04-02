import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 px-4", className)}>
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted mb-4">
        <Icon className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-sm font-medium text-foreground mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground text-center max-w-sm mb-4">{description}</p>
      )}
      {action && (
        <Button size="sm" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  )
}
