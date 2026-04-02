import { cn } from "@/lib/utils"

export type StatusType = 
  | "draft" 
  | "pending" 
  | "in-progress" 
  | "completed" 
  | "approved" 
  | "rejected" 
  | "on-hold"
  | "cancelled"
  | "overdue"
  | "active"
  // Opportunity-specific statuses
  | "created"
  | "evaluated"
  | "assigned"
  | "in-proposal"
  | "won"
  | "lost"
  // Proposal-specific statuses
  | "submitted"
  | "under-negotiation"
  | "revision-requested"

interface StatusBadgeProps {
  status: StatusType
  label?: string
  className?: string
}

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  draft: {
    label: "Draft",
    className: "bg-muted text-muted-foreground",
  },
  pending: {
    label: "Pending",
    className: "bg-warning/15 text-warning",
  },
  "in-progress": {
    label: "In Progress",
    className: "bg-primary/15 text-primary",
  },
  completed: {
    label: "Completed",
    className: "bg-success/15 text-success",
  },
  approved: {
    label: "Approved",
    className: "bg-success/15 text-success",
  },
  rejected: {
    label: "Rejected",
    className: "bg-destructive/15 text-destructive",
  },
  "on-hold": {
    label: "On Hold",
    className: "bg-muted text-muted-foreground",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-muted text-muted-foreground line-through",
  },
  overdue: {
    label: "Overdue",
    className: "bg-destructive/15 text-destructive",
  },
  active: {
    label: "Active",
    className: "bg-primary/15 text-primary",
  },
  // Opportunity-specific statuses
  created: {
    label: "Created",
    className: "bg-muted text-muted-foreground",
  },
  evaluated: {
    label: "Evaluated",
    className: "bg-primary/15 text-primary",
  },
  assigned: {
    label: "Assigned",
    className: "bg-primary/15 text-primary",
  },
  "in-proposal": {
    label: "In Proposal",
    className: "bg-warning/15 text-warning",
  },
  won: {
    label: "Won",
    className: "bg-success/15 text-success",
  },
  lost: {
    label: "Lost",
    className: "bg-destructive/15 text-destructive",
  },
  // Proposal-specific statuses
  submitted: {
    label: "Submitted",
    className: "bg-primary/15 text-primary",
  },
  "under-negotiation": {
    label: "Under Negotiation",
    className: "bg-warning/15 text-warning",
  },
  "revision-requested": {
    label: "Revision Requested",
    className: "bg-warning/15 text-warning",
  },
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const config = statusConfig[status]
  
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 text-xs font-medium rounded",
        config.className,
        className
      )}
    >
      {label || config.label}
    </span>
  )
}
