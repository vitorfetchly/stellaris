"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
  Plus, 
  Trash2, 
  UserPlus, 
  AlertCircle,
  Clock,
  Target,
  FileText,
  Kanban,
  List,
  Check,
  ChevronsUpDown,
} from "lucide-react"
import {
  AppShell,
  PageHeader,
  FilterBar,
  DataTable,
  Column,
  RowAction,
  StatusBadge,
  StatusType,
  SummaryCard,
  SummaryCardGrid,
  LifecycleStage,
} from "@/components/erp"
import { useNavigationStore } from "@/lib/stores/navigation-store"
import { formatShortDate } from "@/lib/date-utils"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"

// Opportunity status type
type OpportunityStatus = "created" | "evaluated" | "assigned" | "in-proposal" | "won" | "lost"

// Request type categories - updated values
type RequestType = "ground-up-build" | "full-renovation" | "alterations-extension" | "modernization" | "other"

interface Opportunity {
  id: string
  entityId: string
  name: string
  scope: string
  customer: string
  status: OpportunityStatus
  lifecycleStage: LifecycleStage
  owner: string | null
  requestType: RequestType
  createdDate: string
  lastUpdated: string
  estimatedValue: number
  isStale: boolean // >14 days without update
  isUnassigned: boolean
}

const requestTypeLabels: Record<RequestType, string> = {
  "ground-up-build": "Ground-Up Build",
  "full-renovation": "Full Renovation",
  "alterations-extension": "Alterations / Extension",
  "modernization": "Modernization",
  "other": "Other",
}

// Available owners for inline assignment
const availableOwners = [
  { id: "john-smith", name: "John Smith" },
  { id: "mary-johnson", name: "Mary Johnson" },
  { id: "charles-wilson", name: "Charles Wilson" },
  { id: "anna-lee", name: "Anna Lee" },
  { id: "peter-brown", name: "Peter Brown" },
]

const mockOpportunities: Opportunity[] = [
  {
    id: "1",
    entityId: "ENT-2026-0058",
    name: "Corporate HQ Security Overhaul",
    scope: "Full CCTV + Access Control + Intrusion Detection",
    customer: "TechCorp Industries",
    status: "assigned",
    lifecycleStage: "opportunity",
    owner: "John Smith",
    requestType: "ground-up-build",
    createdDate: "2026-03-15",
    lastUpdated: "2026-03-28",
    estimatedValue: 285000,
    isStale: false,
    isUnassigned: false,
  },
  {
    id: "2",
    entityId: "ENT-2026-0057",
    name: "Retail Chain Camera Upgrade",
    scope: "Upgrade 120 cameras across 8 locations",
    customer: "MegaMart Stores",
    status: "in-proposal",
    lifecycleStage: "proposal",
    owner: "Mary Johnson",
    requestType: "modernization",
    createdDate: "2026-03-10",
    lastUpdated: "2026-03-27",
    estimatedValue: 156000,
    isStale: false,
    isUnassigned: false,
  },
  {
    id: "3",
    entityId: "ENT-2026-0056",
    name: "Data Center Access Control",
    scope: "Biometric access + Server room monitoring",
    customer: "CloudNet Solutions",
    status: "evaluated",
    lifecycleStage: "opportunity",
    owner: null,
    requestType: "ground-up-build",
    createdDate: "2026-03-05",
    lastUpdated: "2026-03-08",
    estimatedValue: 420000,
    isStale: true,
    isUnassigned: true,
  },
  {
    id: "4",
    entityId: "ENT-2026-0055",
    name: "Hospital Emergency Response",
    scope: "Emergency repair + temporary monitoring",
    customer: "Metro General Hospital",
    status: "created",
    lifecycleStage: "request",
    owner: null,
    requestType: "other",
    createdDate: "2026-03-28",
    lastUpdated: "2026-03-28",
    estimatedValue: 45000,
    isStale: false,
    isUnassigned: true,
  },
  {
    id: "5",
    entityId: "ENT-2026-0054",
    name: "University Campus Expansion",
    scope: "Phase 2 - New dormitory building security",
    customer: "State University",
    status: "won",
    lifecycleStage: "won",
    owner: "Charles Wilson",
    requestType: "alterations-extension",
    createdDate: "2026-02-20",
    lastUpdated: "2026-03-25",
    estimatedValue: 380000,
    isStale: false,
    isUnassigned: false,
  },
  {
    id: "6",
    entityId: "ENT-2026-0053",
    name: "Warehouse Perimeter Detection",
    scope: "Perimeter sensors + thermal cameras",
    customer: "LogiFreight Inc.",
    status: "assigned",
    lifecycleStage: "opportunity",
    owner: "Anna Lee",
    requestType: "ground-up-build",
    createdDate: "2026-02-15",
    lastUpdated: "2026-02-28",
    estimatedValue: 195000,
    isStale: true,
    isUnassigned: false,
  },
  {
    id: "7",
    entityId: "ENT-2026-0052",
    name: "Bank Branch Security Audit",
    scope: "Security consultation + recommendations",
    customer: "First National Bank",
    status: "evaluated",
    lifecycleStage: "opportunity",
    owner: "Peter Brown",
    requestType: "other",
    createdDate: "2026-02-10",
    lastUpdated: "2026-03-20",
    estimatedValue: 35000,
    isStale: false,
    isUnassigned: false,
  },
  {
    id: "8",
    entityId: "ENT-2026-0051",
    name: "Manufacturing Plant Maintenance",
    scope: "Annual maintenance contract renewal",
    customer: "SteelWorks Manufacturing",
    status: "lost",
    lifecycleStage: "opportunity",
    owner: "John Smith",
    requestType: "modernization",
    createdDate: "2026-01-25",
    lastUpdated: "2026-03-15",
    estimatedValue: 72000,
    isStale: false,
    isUnassigned: false,
  },
  {
    id: "9",
    entityId: "ENT-2026-0050",
    name: "Luxury Condo Complex",
    scope: "Intercom + CCTV + Smart locks integration",
    customer: "Prestige Properties",
    status: "in-proposal",
    lifecycleStage: "proposal",
    owner: "Mary Johnson",
    requestType: "full-renovation",
    createdDate: "2026-01-18",
    lastUpdated: "2026-03-26",
    estimatedValue: 520000,
    isStale: false,
    isUnassigned: false,
  },
  {
    id: "10",
    entityId: "ENT-2026-0049",
    name: "Government Office Upgrade",
    scope: "Camera system modernization",
    customer: "City Hall",
    status: "created",
    lifecycleStage: "request",
    owner: null,
    requestType: "modernization",
    createdDate: "2026-03-27",
    lastUpdated: "2026-03-27",
    estimatedValue: 88000,
    isStale: false,
    isUnassigned: true,
  },
]

const statusFilters = [
  { value: "created", label: "Created" },
  { value: "evaluated", label: "Evaluated" },
  { value: "assigned", label: "Assigned" },
  { value: "in-proposal", label: "In Proposal" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
]

const ownerFilters = [
  { value: "john-smith", label: "John Smith" },
  { value: "mary-johnson", label: "Mary Johnson" },
  { value: "charles-wilson", label: "Charles Wilson" },
  { value: "anna-lee", label: "Anna Lee" },
  { value: "peter-brown", label: "Peter Brown" },
  { value: "unassigned", label: "Unassigned" },
]

const requestTypeFilters = [
  { value: "ground-up-build", label: "Ground-Up Build" },
  { value: "full-renovation", label: "Full Renovation" },
  { value: "alterations-extension", label: "Alterations / Extension" },
  { value: "modernization", label: "Modernization" },
  { value: "other", label: "Other" },
]

// Lifecycle stages for dots indicator
const lifecycleStages: { key: LifecycleStage; label: string }[] = [
  { key: "request", label: "Request" },
  { key: "opportunity", label: "Opportunity" },
  { key: "proposal", label: "Proposal" },
  { key: "won", label: "Booked" },
  { key: "project", label: "Project" },
]

// Kanban status columns with color accents
const kanbanColumns: { status: OpportunityStatus; label: string; colorClass: string }[] = [
  { status: "created", label: "Created", colorClass: "border-t-muted-foreground/50" },
  { status: "evaluated", label: "Evaluated", colorClass: "border-t-info" },
  { status: "assigned", label: "Assigned", colorClass: "border-t-primary" },
  { status: "in-proposal", label: "Proposal", colorClass: "border-t-warning" },
  { status: "won", label: "Won", colorClass: "border-t-success" },
  { status: "lost", label: "Lost", colorClass: "border-t-destructive" },
]

// Lifecycle Dots Component with tooltip
function LifecycleDots({ currentStage }: { currentStage: LifecycleStage }) {
  const stageOrder: LifecycleStage[] = ["request", "opportunity", "proposal", "won", "project"]
  const currentIndex = stageOrder.indexOf(currentStage)
  const currentLabel = lifecycleStages.find(s => s.key === currentStage)?.label || currentStage

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1 cursor-help">
            {stageOrder.slice(0, 4).map((stage, index) => {
              const isCompleted = index < currentIndex
              const isCurrent = index === currentIndex
              return (
                <span
                  key={stage}
                  className={cn(
                    "h-2 w-2 rounded-full transition-colors",
                    isCompleted && "bg-success",
                    isCurrent && "bg-primary",
                    !isCompleted && !isCurrent && "bg-muted-foreground/30"
                  )}
                />
              )
            })}
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs">
          <p>{currentLabel}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Inline Owner Selector Component
function InlineOwnerSelector({ 
  currentOwner, 
  onSelect,
  isUnassigned 
}: { 
  currentOwner: string | null
  onSelect: (owner: string | null) => void
  isUnassigned: boolean
}) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          onClick={(e) => e.stopPropagation()}
          className={cn(
            "flex items-center gap-1 text-sm hover:bg-accent rounded px-1.5 py-0.5 -mx-1.5 transition-colors text-left",
            isUnassigned && "text-warning"
          )}
        >
          {isUnassigned ? (
            <span className="flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              Unassigned
            </span>
          ) : (
            <span className="truncate max-w-[100px]">{currentOwner}</span>
          )}
          <ChevronsUpDown className="h-3 w-3 text-muted-foreground shrink-0" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start" onClick={(e) => e.stopPropagation()}>
        <Command>
          <CommandInput placeholder="Search owner..." className="h-8" />
          <CommandList>
            <CommandEmpty>No owner found.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                value="unassigned"
                onSelect={() => {
                  onSelect(null)
                  setOpen(false)
                }}
                className="text-xs"
              >
                <Check
                  className={cn(
                    "mr-2 h-3 w-3",
                    currentOwner === null ? "opacity-100" : "opacity-0"
                  )}
                />
                Unassigned
              </CommandItem>
              {availableOwners.map((owner) => (
                <CommandItem
                  key={owner.id}
                  value={owner.name}
                  onSelect={() => {
                    onSelect(owner.name)
                    setOpen(false)
                  }}
                  className="text-xs"
                >
                  <Check
                    className={cn(
                      "mr-2 h-3 w-3",
                      currentOwner === owner.name ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {owner.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

// Kanban Card Component
function KanbanCard({ 
  opportunity, 
  onClick 
}: { 
  opportunity: Opportunity
  onClick: () => void 
}) {
  return (
    <div
      onClick={onClick}
      className="group p-3 rounded-lg border border-border bg-card hover:bg-accent/50 hover:border-primary/50 transition-colors cursor-pointer"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[10px] text-muted-foreground">
            {opportunity.entityId}
          </p>
          <p className="font-medium text-sm text-foreground truncate group-hover:text-primary transition-colors">
            {opportunity.name}
          </p>
        </div>
      </div>
      
      <p className="text-xs text-muted-foreground truncate mb-2">
        {opportunity.customer}
      </p>

      <div className="flex items-center justify-between pt-2 border-t border-border">
        <LifecycleDots currentStage={opportunity.lifecycleStage} />
        <span className="font-medium text-xs">
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
          }).format(opportunity.estimatedValue)}
        </span>
      </div>

      {(opportunity.isUnassigned || opportunity.isStale) && (
        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border">
          {opportunity.isUnassigned && (
            <span className="flex items-center gap-1 text-[10px] text-warning">
              <AlertCircle className="h-3 w-3" />
              Unassigned
            </span>
          )}
          {opportunity.isStale && (
            <span className="flex items-center gap-1 text-[10px] text-warning">
              <Clock className="h-3 w-3" />
              Stale
            </span>
          )}
        </div>
      )}
    </div>
  )
}

// Kanban View Component
function KanbanView({ 
  opportunities, 
  onCardClick 
}: { 
  opportunities: Opportunity[]
  onCardClick: (opp: Opportunity) => void 
}) {
  return (
    <div className="flex gap-4 p-4 overflow-x-auto min-h-[500px]">
      {kanbanColumns.map((column) => {
        const columnOpportunities = opportunities.filter(opp => opp.status === column.status)
        const columnValue = columnOpportunities.reduce((sum, opp) => sum + opp.estimatedValue, 0)
        
        return (
          <div key={column.status} className="flex-shrink-0 w-[280px]">
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium text-foreground">{column.label}</h3>
                <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                  {columnOpportunities.length}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  notation: "compact",
                  maximumFractionDigits: 0,
                }).format(columnValue)}
              </span>
            </div>
            <div className={cn(
              "space-y-2 min-h-[400px] p-2 rounded-lg bg-muted/30 border border-border/50 border-t-2",
              column.colorClass
            )}>
              {columnOpportunities.length === 0 ? (
                <div className="flex items-center justify-center h-20 text-xs text-muted-foreground">
                  No opportunities
                </div>
              ) : (
                columnOpportunities.map((opp) => (
                  <KanbanCard 
                    key={opp.id} 
                    opportunity={opp} 
                    onClick={() => onCardClick(opp)} 
                  />
                ))
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function OpportunitiesPage() {
  const router = useRouter()
  const setActiveModule = useNavigationStore((state) => state.setActiveModule)
  const [searchValue, setSearchValue] = useState("")
  const [filterValues, setFilterValues] = useState<Record<string, string>>({})
  const [viewMode, setViewMode] = useState<"table" | "kanban">("table")
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [opportunities, setOpportunities] = useState<Opportunity[]>(mockOpportunities)

  useEffect(() => {
    setActiveModule("opportunities")
  }, [setActiveModule])

  const navigateToOpportunity = (opportunity: Opportunity) => {
    router.push(`/opportunities/${opportunity.entityId}`)
  }

  const handleOwnerChange = (opportunityId: string, newOwner: string | null) => {
    setOpportunities(prev => prev.map(opp => {
      if (opp.id === opportunityId) {
        return {
          ...opp,
          owner: newOwner,
          isUnassigned: newOwner === null,
        }
      }
      return opp
    }))
  }

  const handleBulkDelete = () => {
    if (selectedRows.size === 0) return
    // In production, this would call an API
    setOpportunities(prev => prev.filter(opp => !selectedRows.has(opp.id)))
    setSelectedRows(new Set())
  }

  // Columns in new order: Entity ID, Customer, Opportunity, Scope, Status, Lifecycle, Owner, Type, Estimated Value, Last Updated
  const columns: Column<Opportunity>[] = [
    {
      key: "entityId",
      header: "Entity ID",
      width: "120px",
      sortable: true,
      render: (row) => (
        <span className="font-mono text-xs text-muted-foreground">
          {row.entityId}
        </span>
      ),
    },
    {
      key: "customer",
      header: "Customer",
      width: "150px",
      sortable: true,
      render: (row) => (
        <span className="text-sm text-foreground truncate">{row.customer}</span>
      ),
    },
    {
      key: "name",
      header: "Opportunity",
      sortable: true,
      render: (row) => (
        <div className="min-w-0">
          <Link
            href={`/opportunities/${row.entityId}`}
            onClick={(e) => e.stopPropagation()}
            className="font-medium text-foreground hover:text-primary hover:underline underline-offset-2 transition-colors truncate block"
          >
            {row.name}
          </Link>
          <span className="text-xs text-muted-foreground truncate block">
            {requestTypeLabels[row.requestType]}
          </span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      width: "100px",
      sortable: true,
      render: (row) => <StatusBadge status={row.status as StatusType} />,
    },
    {
      key: "lifecycleStage",
      header: "Lifecycle",
      width: "80px",
      sortable: true,
      render: (row) => <LifecycleDots currentStage={row.lifecycleStage} />,
    },
    {
      key: "owner",
      header: "Owner",
      width: "140px",
      sortable: true,
      render: (row) => (
        <InlineOwnerSelector
          currentOwner={row.owner}
          isUnassigned={row.isUnassigned}
          onSelect={(newOwner) => handleOwnerChange(row.id, newOwner)}
        />
      ),
    },

    {
      key: "estimatedValue",
      header: "Est. Value",
      width: "100px",
      sortable: true,
      className: "text-right",
      render: (row) => (
        <span className="font-medium text-sm">
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
          }).format(row.estimatedValue)}
        </span>
      ),
    },
    {
      key: "lastUpdated",
      header: "Updated",
      width: "90px",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-1">
          {row.isStale && (
            <Clock className="h-3 w-3 text-warning" />
          )}
          <span className={`text-xs ${row.isStale ? "text-warning" : "text-muted-foreground"}`}>
            {formatShortDate(row.lastUpdated)}
          </span>
        </div>
      ),
    },
  ]

  // Updated row actions - removed View Details and Edit (clicking name handles navigation)
  const rowActions: RowAction<Opportunity>[] = [
    {
      label: "Create Proposal",
      icon: <FileText className="h-4 w-4" />,
      onClick: (row) => router.push(`/proposals/create?opportunityId=${row.entityId}`),
    },
    {
      label: "Assign Owner",
      icon: <UserPlus className="h-4 w-4" />,
      onClick: (row) => console.log("Assign owner", row.entityId),
    },
    {
      label: "Delete",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (row) => {
        setOpportunities(prev => prev.filter(opp => opp.id !== row.id))
      },
      variant: "destructive",
      separator: true,
    },
  ]

  // Filter logic
  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesSearch =
      !searchValue ||
      opp.entityId.toLowerCase().includes(searchValue.toLowerCase()) ||
      opp.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      opp.customer.toLowerCase().includes(searchValue.toLowerCase()) ||
      opp.scope.toLowerCase().includes(searchValue.toLowerCase())

    const matchesStatus =
      !filterValues.status ||
      filterValues.status === "all" ||
      opp.status === filterValues.status

    const matchesOwner =
      !filterValues.owner ||
      filterValues.owner === "all" ||
      (filterValues.owner === "unassigned" && opp.isUnassigned) ||
      (opp.owner && opp.owner.toLowerCase().replace(/\s+/g, "-") === filterValues.owner)

    const matchesRequestType =
      !filterValues.requestType ||
      filterValues.requestType === "all" ||
      opp.requestType === filterValues.requestType

    return matchesSearch && matchesStatus && matchesOwner && matchesRequestType
  })

  // Summary stats
  const totalOpportunities = opportunities.length
  const activeOpportunities = opportunities.filter(
    (o) => !["won", "lost"].includes(o.status)
  ).length
  const unassignedCount = opportunities.filter((o) => o.isUnassigned).length
  const staleCount = opportunities.filter((o) => o.isStale).length
  const pipelineValue = opportunities
    .filter((o) => !["won", "lost"].includes(o.status))
    .reduce((sum, o) => sum + o.estimatedValue, 0)

  return (
    <AppShell>
      <div className="space-y-4">
        <PageHeader
          title="Opportunities"
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Opportunities" },
          ]}
          primaryAction={{
            label: "Create Opportunity",
            onClick: () => router.push("/opportunities/create"),
            icon: <Plus className="h-4 w-4 mr-1.5" />,
          }}
        />

        <SummaryCardGrid columns={4}>
          <SummaryCard
            title="Active Opportunities"
            value={activeOpportunities}
            subtitle={`${totalOpportunities} total`}
            icon={Target}
          />
          <SummaryCard
            title="Pipeline Value"
            value={new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 0,
            }).format(pipelineValue)}
            subtitle="Estimated total"
            icon={Target}
          />
          <SummaryCard
            title="Unassigned"
            value={unassignedCount}
            subtitle="Needs attention"
            icon={AlertCircle}
          />
          <SummaryCard
            title="Stale"
            value={staleCount}
            subtitle=">14 days no update"
            icon={Clock}
          />
        </SummaryCardGrid>

        <div className="rounded-lg border border-border bg-card">
          <div className="flex items-center gap-2 px-3">
            <div className="flex-1">
              <FilterBar
                searchPlaceholder="Search by Entity ID, name, customer..."
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                filters={[
                  { key: "status", label: "Status", options: statusFilters },
                  { key: "owner", label: "Owner", options: ownerFilters },
                  { key: "requestType", label: "Type", options: requestTypeFilters },
                ]}
                filterValues={filterValues}
                onFilterChange={(key, value) =>
                  setFilterValues((prev) => ({ ...prev, [key]: value }))
                }
                showViewToggle={false}
                actions={
                  selectedRows.size > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {selectedRows.size} selected
                      </span>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={handleBulkDelete}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  )
                }
              />
            </div>
            
            {/* Custom view toggle for Table/Kanban */}
            <div className="flex items-center rounded-md border border-border bg-secondary">
              <button
                onClick={() => setViewMode("table")}
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-l transition-colors",
                  viewMode === "table"
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
                title="Table view"
              >
                <List className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("kanban")}
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-r transition-colors",
                  viewMode === "kanban"
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
                title="Kanban view"
              >
                <Kanban className="h-4 w-4" />
              </button>
            </div>
          </div>

          {viewMode === "table" ? (
            <DataTable
              data={filteredOpportunities}
              columns={columns}
              rowActions={rowActions}
              selectable
              selectedRows={selectedRows}
              onSelectionChange={setSelectedRows}
              getRowId={(row) => row.id}
              onRowClick={(row) => navigateToOpportunity(row)}
              className="border-0 rounded-none"
            />
          ) : (
            <KanbanView 
              opportunities={filteredOpportunities} 
              onCardClick={navigateToOpportunity} 
            />
          )}
        </div>
      </div>
    </AppShell>
  )
}
