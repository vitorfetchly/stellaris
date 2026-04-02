"use client"

import { cn } from "@/lib/utils"
import { Check } from "lucide-react"
import { LifecycleStage } from "./entity-header"

interface LifecycleIndicatorProps {
  currentStage: LifecycleStage
  compact?: boolean
  className?: string
}

const stageConfig: Record<LifecycleStage, { label: string; shortLabel: string }> = {
  request: { label: "Request", shortLabel: "REQ" },
  opportunity: { label: "Opportunity", shortLabel: "OPP" },
  proposal: { label: "Proposal", shortLabel: "PROP" },
  won: { label: "Won", shortLabel: "WON" },
  project: { label: "Project", shortLabel: "PROJ" },
  closed: { label: "Closed", shortLabel: "CLOSE" },
}

const stageOrder: LifecycleStage[] = ["request", "opportunity", "proposal", "won", "project", "closed"]

export function LifecycleIndicator({ currentStage, compact = true, className }: LifecycleIndicatorProps) {
  const currentIndex = stageOrder.indexOf(currentStage)
  const config = stageConfig[currentStage]

  if (compact) {
    // Compact version: shows dots for progress + current stage label
    return (
      <div className={cn("flex items-center gap-1.5", className)}>
        <div className="flex items-center gap-0.5">
          {stageOrder.slice(0, 4).map((stage, index) => {
            const isCompleted = index < currentIndex
            const isCurrent = index === currentIndex
            return (
              <span
                key={stage}
                className={cn(
                  "h-1.5 w-1.5 rounded-full transition-colors",
                  isCompleted && "bg-success",
                  isCurrent && "bg-primary",
                  !isCompleted && !isCurrent && "bg-muted-foreground/30"
                )}
              />
            )
          })}
        </div>
        <span className="text-xs font-medium text-muted-foreground">
          {config.label}
        </span>
      </div>
    )
  }

  // Full version: shows all stages
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {stageOrder.map((stage, index) => {
        const isCompleted = index < currentIndex
        const isCurrent = index === currentIndex
        const stageData = stageConfig[stage]

        return (
          <div key={stage} className="flex items-center">
            <div
              className={cn(
                "flex items-center justify-center h-5 px-1.5 rounded text-[10px] font-medium",
                isCompleted && "bg-success/15 text-success",
                isCurrent && "bg-primary/15 text-primary",
                !isCompleted && !isCurrent && "bg-muted text-muted-foreground"
              )}
            >
              {isCompleted ? (
                <Check className="h-3 w-3" />
              ) : (
                stageData.shortLabel
              )}
            </div>
            {index < stageOrder.length - 1 && (
              <span className={cn(
                "w-2 h-px mx-0.5",
                index < currentIndex ? "bg-success" : "bg-muted-foreground/30"
              )} />
            )}
          </div>
        )
      })}
    </div>
  )
}
