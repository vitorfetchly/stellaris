import { cn } from "@/lib/utils"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ReactNode } from "react"

interface BreadcrumbItem {
  label: string
  href?: string
}

interface PrimaryActionObject {
  label: string
  onClick: () => void
  icon?: ReactNode
}

interface PageHeaderProps {
  title: string
  breadcrumbs?: BreadcrumbItem[]
  primaryAction?: PrimaryActionObject | ReactNode
  children?: ReactNode
  className?: string
}

export function PageHeader({
  title,
  breadcrumbs,
  primaryAction,
  children,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-1 pb-4 border-b border-border", className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1 text-xs text-muted-foreground">
          {breadcrumbs.map((crumb, index) => (
            <span key={index} className="flex items-center gap-1">
              {index > 0 && <ChevronRight className="h-3 w-3" />}
              {crumb.href ? (
                <a href={crumb.href} className="hover:text-foreground transition-colors">
                  {crumb.label}
                </a>
              ) : (
                <span>{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
        <div className="flex items-center gap-2">
          {children}
          {primaryAction && (
            typeof primaryAction === "object" && "label" in primaryAction ? (
              <Button size="sm" onClick={primaryAction.onClick}>
                {primaryAction.icon}
                {primaryAction.label}
              </Button>
            ) : (
              primaryAction
            )
          )}
        </div>
      </div>
    </div>
  )
}
