"use client"

import { 
  ChevronRight, 
  ExternalLink, 
  User, 
  Clock,
  Briefcase,
  Check,
} from "lucide-react"
import { cn } from "@/lib/utils"

export type LifecycleStage = 
  | "request"
  | "opportunity"
  | "proposal"
  | "won"
  | "project"
  | "closed"

export interface LifecycleState {
  stage: LifecycleStage
  completedAt?: string
  completedBy?: string
  referenceId?: string
  href?: string
}

export interface EntityHeaderProps {
  entityId: string
  currentStage: LifecycleStage
  status: string
  customerName: string
  programName?: string
  programHref?: string
  lifecycle: LifecycleState[]
  lastModifiedBy: string
  lastModifiedAt: string
}

const stageConfig: Record<LifecycleStage, { label: string; shortLabel: string }> = {
  request: { label: "Request", shortLabel: "REQ" },
  opportunity: { label: "Opportunity", shortLabel: "OPP" },
  proposal: { label: "Proposal", shortLabel: "PROP" },
  won: { label: "Won / Booked", shortLabel: "WON" },
  project: { label: "Project Active", shortLabel: "PROJ" },
  closed: { label: "Closed", shortLabel: "CLOSE" },
}

const stageOrder: LifecycleStage[] = ["request", "opportunity", "proposal", "won", "project", "closed"]

function getStageIndex(stage: LifecycleStage): number {
  return stageOrder.indexOf(stage)
}

export function EntityHeader({
  entityId,
  currentStage,
  status,
  customerName,
  programName,
  programHref,
  lifecycle,
  lastModifiedBy,
  lastModifiedAt,
}: EntityHeaderProps) {
  const currentIndex = getStageIndex(currentStage)

  return (
    <div className="flex flex-col gap-3 p-3 rounded-lg border border-border bg-card/50">
      {/* Top Row: Entity ID, Customer, Program, Audit Info */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Entity ID */}
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-semibold text-primary">{entityId}</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-primary/15 text-primary uppercase">
              {status}
            </span>
          </div>
          
          {/* Divider */}
          <span className="h-4 w-px bg-border" />
          
          {/* Customer */}
          <div className="flex items-center gap-1.5 text-sm">
            <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-foreground font-medium">{customerName}</span>
          </div>
          
          {/* Program (optional) */}
          {programName && (
            <>
              <span className="h-4 w-px bg-border" />
              <div className="flex items-center gap-1.5 text-sm">
                <span className="text-muted-foreground">Program:</span>
                {programHref ? (
                  <a 
                    href={programHref}
                    className="text-primary hover:underline underline-offset-2 flex items-center gap-1"
                  >
                    {programName}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  <span className="text-foreground">{programName}</span>
                )}
              </div>
            </>
          )}
        </div>
        
        {/* Audit Info */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <User className="h-3 w-3" />
            {lastModifiedBy}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {lastModifiedAt}
          </span>
        </div>
      </div>

      {/* Lifecycle Bar */}
      <div className="flex items-center gap-1">
        {stageOrder.map((stage, index) => {
          const stageData = lifecycle.find(l => l.stage === stage)
          const isCompleted = index < currentIndex
          const isCurrent = index === currentIndex
          const isFuture = index > currentIndex
          const config = stageConfig[stage]

          return (
            <div key={stage} className="flex items-center flex-1 min-w-0">
              {/* Stage Block */}
              <div
                className={cn(
                  "relative flex-1 flex flex-col items-center justify-center py-2 px-2 rounded transition-colors",
                  isCompleted && "bg-success/10",
                  isCurrent && "bg-primary/15 ring-1 ring-primary/30",
                  isFuture && "bg-muted/50"
                )}
              >
                {/* Stage Label */}
                <div className="flex items-center gap-1.5">
                  {isCompleted && (
                    <Check className="h-3 w-3 text-success" />
                  )}
                  <span
                    className={cn(
                      "text-xs font-medium truncate",
                      isCompleted && "text-success",
                      isCurrent && "text-primary",
                      isFuture && "text-muted-foreground"
                    )}
                  >
                    {config.label}
                  </span>
                </div>

                {/* Reference Link (for completed stages) */}
                {stageData?.referenceId && stageData.href && (
                  <a
                    href={stageData.href}
                    className="mt-0.5 text-[10px] text-muted-foreground hover:text-primary hover:underline underline-offset-2 flex items-center gap-0.5 transition-colors"
                  >
                    {stageData.referenceId}
                    <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                )}

                {/* Completion info */}
                {stageData?.completedAt && isCompleted && (
                  <span className="mt-0.5 text-[10px] text-muted-foreground">
                    {stageData.completedAt}
                  </span>
                )}

                {/* Current indicator dot */}
                {isCurrent && (
                  <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-primary animate-pulse" />
                )}
              </div>

              {/* Connector Arrow */}
              {index < stageOrder.length - 1 && (
                <ChevronRight 
                  className={cn(
                    "h-4 w-4 shrink-0 mx-0.5",
                    index < currentIndex ? "text-success" : "text-muted-foreground/50"
                  )}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
