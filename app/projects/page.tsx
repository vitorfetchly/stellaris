"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  Play,
  Zap,
  ChevronDown,
  Eye, 
  Edit, 
  Trash2, 
  ExternalLink, 
  UserPlus, 
  AlertTriangle,
  Clock,
  FolderKanban,
  DollarSign,
  AlertCircle,
  TrendingDown,
  Check,
  X,
  Inbox,
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
  LifecycleIndicator,
  LifecycleStage,
} from "@/components/erp"
import { useNavigationStore } from "@/lib/stores/navigation-store"
import { formatShortDate } from "@/lib/date-utils"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Project status type
type ProjectStatus = "active" | "completed" | "on-hold" | "cancelled"

// Booked Opportunity type (ready for activation)
interface BookedOpportunity {
  id: string
  entityId: string
  opportunityName: string
  customerName: string
  bookedValue: number
  bookingDate: string
  salesperson: string
}

// Mock booked opportunities ready for activation
const bookedOpportunities: BookedOpportunity[] = [
  {
    id: "1",
    entityId: "ENT-2025-0055",
    opportunityName: "Lambda Corp - Data Center Security",
    customerName: "Lambda Corporation",
    bookedValue: 345000,
    bookingDate: "2026-03-25",
    salesperson: "Mary Johnson",
  },
  {
    id: "2",
    entityId: "ENT-2025-0053",
    opportunityName: "Mu Industries - Factory Perimeter",
    customerName: "Mu Industries Ltd.",
    bookedValue: 128000,
    bookingDate: "2026-03-22",
    salesperson: "Charles Wilson",
  },
  {
    id: "3",
    entityId: "ENT-2025-0051",
    opportunityName: "Nu Financial - Branch Network",
    customerName: "Nu Financial Services",
    bookedValue: 520000,
    bookingDate: "2026-03-18",
    salesperson: "Anna Lee",
  },
]

interface Project {
  id: string
  entityId: string
  name: string
  customer: string
  status: ProjectStatus
  lifecycleStage: LifecycleStage
  projectManager: string | null
  startDate: string
  endDate: string
  budget: number
  actualCost: number
  lastUpdated: string
  // Risk indicators
  isOverBudget: boolean
  isDelayed: boolean
  hasOpenIssues: boolean
  openIssuesCount: number
}

const mockProjects: Project[] = [
  {
    id: "1",
    entityId: "ENT-2025-0042",
    name: "Alpha Shopping Center - CCTV System",
    customer: "Alpha Ventures Ltd.",
    status: "active",
    lifecycleStage: "project",
    projectManager: "John Smith",
    startDate: "2026-02-01",
    endDate: "2026-05-15",
    budget: 185000,
    actualCost: 142000,
    lastUpdated: "2026-03-28",
    isOverBudget: false,
    isDelayed: false,
    hasOpenIssues: true,
    openIssuesCount: 2,
  },
  {
    id: "2",
    entityId: "ENT-2025-0038",
    name: "Beta Condos - Access Control",
    customer: "Beta Construction",
    status: "active",
    lifecycleStage: "project",
    projectManager: "Mary Johnson",
    startDate: "2026-01-15",
    endDate: "2026-04-30",
    budget: 92000,
    actualCost: 78500,
    lastUpdated: "2026-03-27",
    isOverBudget: false,
    isDelayed: true,
    hasOpenIssues: false,
    openIssuesCount: 0,
  },
  {
    id: "3",
    entityId: "ENT-2025-0035",
    name: "Gamma Industries - Perimeter Alarm",
    customer: "Gamma Industrial S.A.",
    status: "active",
    lifecycleStage: "project",
    projectManager: "Charles Wilson",
    startDate: "2026-02-10",
    endDate: "2026-04-28",
    budget: 156000,
    actualCost: 168000,
    lastUpdated: "2026-03-25",
    isOverBudget: true,
    isDelayed: false,
    hasOpenIssues: true,
    openIssuesCount: 3,
  },
  {
    id: "4",
    entityId: "ENT-2025-0030",
    name: "Delta Hospital - Full Integration",
    customer: "Delta Health Network",
    status: "active",
    lifecycleStage: "project",
    projectManager: "Anna Lee",
    startDate: "2026-03-01",
    endDate: "2026-06-30",
    budget: 420000,
    actualCost: 85000,
    lastUpdated: "2026-03-28",
    isOverBudget: false,
    isDelayed: false,
    hasOpenIssues: false,
    openIssuesCount: 0,
  },
  {
    id: "5",
    entityId: "ENT-2025-0025",
    name: "Epsilon School - Cameras & Alarm",
    customer: "Epsilon Foundation",
    status: "completed",
    lifecycleStage: "closed",
    projectManager: "Peter Brown",
    startDate: "2025-11-01",
    endDate: "2026-02-28",
    budget: 68000,
    actualCost: 65200,
    lastUpdated: "2026-03-05",
    isOverBudget: false,
    isDelayed: false,
    hasOpenIssues: false,
    openIssuesCount: 0,
  },
  {
    id: "6",
    entityId: "ENT-2025-0020",
    name: "Zeta Store - Anti-theft System",
    customer: "Zeta Retail",
    status: "on-hold",
    lifecycleStage: "project",
    projectManager: "John Smith",
    startDate: "2026-01-10",
    endDate: "2026-03-31",
    budget: 45000,
    actualCost: 22000,
    lastUpdated: "2026-02-20",
    isOverBudget: false,
    isDelayed: true,
    hasOpenIssues: true,
    openIssuesCount: 1,
  },
  {
    id: "7",
    entityId: "ENT-2024-0180",
    name: "Eta Bank - Branch Security",
    customer: "First National Bank",
    status: "completed",
    lifecycleStage: "closed",
    projectManager: "Mary Johnson",
    startDate: "2025-09-01",
    endDate: "2025-12-15",
    budget: 280000,
    actualCost: 295000,
    lastUpdated: "2026-01-10",
    isOverBudget: true,
    isDelayed: false,
    hasOpenIssues: false,
    openIssuesCount: 0,
  },
  {
    id: "8",
    entityId: "ENT-2024-0165",
    name: "Theta Warehouse - Monitoring",
    customer: "LogiFreight Inc.",
    status: "cancelled",
    lifecycleStage: "project",
    projectManager: null,
    startDate: "2025-10-15",
    endDate: "2026-01-30",
    budget: 125000,
    actualCost: 35000,
    lastUpdated: "2025-12-01",
    isOverBudget: false,
    isDelayed: false,
    hasOpenIssues: false,
    openIssuesCount: 0,
  },
  {
    id: "9",
    entityId: "ENT-2025-0048",
    name: "Iota University - Campus Expansion",
    customer: "State University",
    status: "active",
    lifecycleStage: "project",
    projectManager: "Charles Wilson",
    startDate: "2026-03-15",
    endDate: "2026-08-30",
    budget: 380000,
    actualCost: 42000,
    lastUpdated: "2026-03-28",
    isOverBudget: false,
    isDelayed: false,
    hasOpenIssues: false,
    openIssuesCount: 0,
  },
  {
    id: "10",
    entityId: "ENT-2025-0045",
    name: "Kappa Mall - Security Upgrade",
    customer: "Kappa Properties",
    status: "active",
    lifecycleStage: "project",
    projectManager: null,
    startDate: "2026-02-20",
    endDate: "2026-05-30",
    budget: 215000,
    actualCost: 98000,
    lastUpdated: "2026-03-20",
    isOverBudget: false,
    isDelayed: false,
    hasOpenIssues: true,
    openIssuesCount: 1,
  },
]

const statusFilters = [
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
  { value: "on-hold", label: "On Hold" },
  { value: "cancelled", label: "Cancelled" },
]

const managerFilters = [
  { value: "john-smith", label: "John Smith" },
  { value: "mary-johnson", label: "Mary Johnson" },
  { value: "charles-wilson", label: "Charles Wilson" },
  { value: "anna-lee", label: "Anna Lee" },
  { value: "peter-brown", label: "Peter Brown" },
  { value: "unassigned", label: "Unassigned" },
]

const customerFilters = [
  { value: "alpha", label: "Alpha Ventures Ltd." },
  { value: "beta", label: "Beta Construction" },
  { value: "gamma", label: "Gamma Industrial S.A." },
  { value: "delta", label: "Delta Health Network" },
  { value: "epsilon", label: "Epsilon Foundation" },
]

export default function ProjectsListPage() {
  const router = useRouter()
  const setActiveModule = useNavigationStore((state) => state.setActiveModule)
  const [searchValue, setSearchValue] = useState("")
  const [filterValues, setFilterValues] = useState<Record<string, string>>({})
  const [viewMode, setViewMode] = useState<"table" | "cards">("table")
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  
  // Modal state for activation
  const [activateModalOpen, setActivateModalOpen] = useState(false)
  const [selectedOpportunity, setSelectedOpportunity] = useState<BookedOpportunity | null>(null)
  const [isActivating, setIsActivating] = useState(false)

  useEffect(() => {
    setActiveModule("projects")
  }, [setActiveModule])

  const navigateToProject = (project: Project) => {
    router.push(`/projects/${project.entityId}`)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Handle project activation from booked opportunity
  const handleActivateProject = async () => {
    if (!selectedOpportunity) return
    
    setIsActivating(true)
    // Simulate API call to activate project
    await new Promise((resolve) => setTimeout(resolve, 800))
    
    // Navigate to the new project dashboard
    router.push(`/projects/${selectedOpportunity.entityId}`)
  }

  // Handle Quick Project creation
  const handleQuickProject = () => {
    // In real app, this would create minimal upstream structure
    // For now, navigate to a new project creation flow
    console.log("Quick Project: Creating minimal upstream structure...")
    // Could open a simplified modal or navigate to a quick-create form
    router.push("/projects/quick-create")
  }

  const columns: Column<Project>[] = [
    {
      key: "entityId",
      header: "Entity ID",
      width: "130px",
      sortable: true,
      render: (row) => (
        <button
          onClick={(e) => {
            e.stopPropagation()
            navigateToProject(row)
          }}
          className="font-mono text-xs font-semibold text-primary hover:underline underline-offset-2 transition-colors"
        >
          {row.entityId}
        </button>
      ),
    },
    {
      key: "name",
      header: "Project Name",
      sortable: true,
      render: (row) => (
        <div className="min-w-0">
          <button
            onClick={(e) => {
              e.stopPropagation()
              navigateToProject(row)
            }}
            className="font-medium text-foreground truncate hover:text-primary hover:underline underline-offset-2 transition-colors text-left block"
          >
            {row.name}
          </button>
          <p className="text-xs text-muted-foreground truncate">{row.customer}</p>
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
      width: "140px",
      sortable: true,
      render: (row) => (
        <LifecycleIndicator currentStage={row.lifecycleStage} />
      ),
    },
    {
      key: "projectManager",
      header: "Manager",
      width: "130px",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-1.5">
          {!row.projectManager ? (
            <span className="flex items-center gap-1 text-xs text-warning">
              <AlertCircle className="h-3 w-3" />
              Unassigned
            </span>
          ) : (
            <span className="text-sm text-foreground">{row.projectManager}</span>
          )}
        </div>
      ),
    },
    {
      key: "startDate",
      header: "Start",
      width: "85px",
      sortable: true,
      render: (row) => (
        <span className="text-xs text-muted-foreground">
          {formatShortDate(row.startDate)}
        </span>
      ),
    },
    {
      key: "endDate",
      header: "End",
      width: "85px",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-1">
          {row.isDelayed && (
            <Clock className="h-3 w-3 text-warning" />
          )}
          <span className={`text-xs ${row.isDelayed ? "text-warning" : "text-muted-foreground"}`}>
            {formatShortDate(row.endDate)}
          </span>
        </div>
      ),
    },
    {
      key: "budget",
      header: "Budget",
      width: "100px",
      sortable: true,
      className: "text-right",
      render: (row) => (
        <span className="font-medium text-xs">
          {formatCurrency(row.budget)}
        </span>
      ),
    },
    {
      key: "actualCost",
      header: "Actual",
      width: "100px",
      sortable: true,
      className: "text-right",
      render: (row) => (
        <div className="flex items-center justify-end gap-1">
          {row.isOverBudget && (
            <TrendingDown className="h-3 w-3 text-destructive" />
          )}
          <span className={`font-medium text-xs ${row.isOverBudget ? "text-destructive" : "text-foreground"}`}>
            {formatCurrency(row.actualCost)}
          </span>
        </div>
      ),
    },
    {
      key: "risk",
      header: "Risk",
      width: "70px",
      render: (row) => {
        const riskCount = [row.isOverBudget, row.isDelayed, row.hasOpenIssues].filter(Boolean).length
        if (riskCount === 0) return <span className="text-xs text-muted-foreground">-</span>
        return (
          <div className="flex items-center gap-1">
            <AlertTriangle className={`h-3.5 w-3.5 ${riskCount >= 2 ? "text-destructive" : "text-warning"}`} />
            <span className={`text-xs font-medium ${riskCount >= 2 ? "text-destructive" : "text-warning"}`}>
              {riskCount}
            </span>
          </div>
        )
      },
    },
    {
      key: "lastUpdated",
      header: "Updated",
      width: "85px",
      sortable: true,
      render: (row) => (
        <span className="text-xs text-muted-foreground">
          {formatShortDate(row.lastUpdated)}
        </span>
      ),
    },
  ]

  const rowActions: RowAction<Project>[] = [
    {
      label: "View Dashboard",
      icon: <Eye className="h-4 w-4" />,
      onClick: (row) => navigateToProject(row),
    },
    {
      label: "Edit",
      icon: <Edit className="h-4 w-4" />,
      onClick: (row) => router.push(`/projects/${row.entityId}/edit`),
    },
    {
      label: "Assign Manager",
      icon: <UserPlus className="h-4 w-4" />,
      onClick: (row) => console.log("Assign manager", row.entityId),
    },
    {
      label: "Update Status",
      icon: <FolderKanban className="h-4 w-4" />,
      onClick: (row) => console.log("Update status", row.entityId),
    },
    {
      label: "Open in new tab",
      icon: <ExternalLink className="h-4 w-4" />,
      onClick: (row) => window.open(`/projects/${row.entityId}`, "_blank"),
    },
    {
      label: "Delete",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (row) => console.log("Delete", row.entityId),
      variant: "destructive",
      separator: true,
    },
  ]

  // Filter logic
  const filteredProjects = mockProjects.filter((proj) => {
    const matchesSearch =
      !searchValue ||
      proj.entityId.toLowerCase().includes(searchValue.toLowerCase()) ||
      proj.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      proj.customer.toLowerCase().includes(searchValue.toLowerCase())

    const matchesStatus =
      !filterValues.status ||
      filterValues.status === "all" ||
      proj.status === filterValues.status

    const matchesManager =
      !filterValues.manager ||
      filterValues.manager === "all" ||
      (filterValues.manager === "unassigned" && !proj.projectManager) ||
      (proj.projectManager && proj.projectManager.toLowerCase().replace(/\s+/g, "-") === filterValues.manager)

    return matchesSearch && matchesStatus && matchesManager
  })

  // Summary stats
  const totalProjects = mockProjects.length
  const activeProjects = mockProjects.filter((p) => p.status === "active").length
  const atRiskProjects = mockProjects.filter(
    (p) => p.status === "active" && (p.isOverBudget || p.isDelayed || p.hasOpenIssues)
  ).length
  const totalBudget = mockProjects
    .filter((p) => p.status === "active")
    .reduce((sum, p) => sum + p.budget, 0)
  const totalActualCost = mockProjects
    .filter((p) => p.status === "active")
    .reduce((sum, p) => sum + p.actualCost, 0)

  return (
    <AppShell>
      <div className="space-y-4">
        <PageHeader
          title="Projects"
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Projects" },
          ]}
          primaryAction={
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Zap className="h-4 w-4 mr-1.5" />
                    Quick Project
                    <ChevronDown className="h-3 w-3 ml-1.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleQuickProject}>
                    <Zap className="h-4 w-4 mr-2" />
                    Create Quick Project
                    <span className="ml-2 text-[10px] text-muted-foreground">
                      (auto-creates opportunity)
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button size="sm" onClick={() => setActivateModalOpen(true)}>
                <Play className="h-4 w-4 mr-1.5" />
                Activate Project
              </Button>
            </div>
          }
        />

        <SummaryCardGrid columns={4}>
          <SummaryCard
            title="Active Projects"
            value={activeProjects}
            subtitle={`${totalProjects} total`}
            icon={FolderKanban}
          />
          <SummaryCard
            title="Total Budget"
            value={formatCurrency(totalBudget)}
            subtitle="Active projects"
            icon={DollarSign}
          />
          <SummaryCard
            title="Actual Cost"
            value={formatCurrency(totalActualCost)}
            subtitle={`${Math.round((totalActualCost / totalBudget) * 100)}% of budget`}
            icon={DollarSign}
          />
          <SummaryCard
            title="At Risk"
            value={atRiskProjects}
            subtitle="Over budget, delayed, or issues"
            icon={AlertTriangle}
          />
        </SummaryCardGrid>

        <div className="rounded-lg border border-border bg-card">
          <FilterBar
            searchPlaceholder="Search by Entity ID, name, customer..."
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            filters={[
              { key: "status", label: "Status", options: statusFilters },
              { key: "manager", label: "Manager", options: managerFilters },
            ]}
            filterValues={filterValues}
            onFilterChange={(key, value) =>
              setFilterValues((prev) => ({ ...prev, [key]: value }))
            }
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            actions={
              selectedRows.size > 0 && (
                <span className="text-xs text-muted-foreground">
                  {selectedRows.size} selected
                </span>
              )
            }
          />

          {viewMode === "table" ? (
            <DataTable
              data={filteredProjects}
              columns={columns}
              rowActions={rowActions}
              selectable
              selectedRows={selectedRows}
              onSelectionChange={setSelectedRows}
              getRowId={(row) => row.id}
              onRowClick={(row) => navigateToProject(row)}
              className="border-0 rounded-none"
            />
          ) : (
            <div className="grid grid-cols-3 gap-4 p-4">
              {filteredProjects.map((proj) => (
                <div
                  key={proj.id}
                  onClick={() => navigateToProject(proj)}
                  className="group p-4 rounded-lg border border-border bg-card hover:bg-accent/50 hover:border-primary/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-xs font-semibold text-primary">
                        {proj.entityId}
                      </p>
                      <p className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                        {proj.name}
                      </p>
                    </div>
                    <StatusBadge status={proj.status as StatusType} />
                  </div>
                  
                  <p className="text-xs text-muted-foreground truncate mb-3">
                    {proj.customer}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                    <div>
                      <p className="text-muted-foreground">Budget</p>
                      <p className="font-medium">{formatCurrency(proj.budget)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Actual</p>
                      <p className={`font-medium ${proj.isOverBudget ? "text-destructive" : ""}`}>
                        {formatCurrency(proj.actualCost)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Start</p>
                      <p className="font-medium">{formatShortDate(proj.startDate)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">End</p>
                      <p className={`font-medium ${proj.isDelayed ? "text-warning" : ""}`}>
                        {formatShortDate(proj.endDate)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <LifecycleIndicator currentStage={proj.lifecycleStage} />
                    {proj.projectManager ? (
                      <span className="text-xs text-muted-foreground">{proj.projectManager}</span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-warning">
                        <AlertCircle className="h-3 w-3" />
                        Unassigned
                      </span>
                    )}
                  </div>

                  {(proj.isOverBudget || proj.isDelayed || proj.hasOpenIssues) && (
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border">
                      {proj.isOverBudget && (
                        <span className="flex items-center gap-1 text-[10px] text-destructive">
                          <TrendingDown className="h-3 w-3" />
                          Over Budget
                        </span>
                      )}
                      {proj.isDelayed && (
                        <span className="flex items-center gap-1 text-[10px] text-warning">
                          <Clock className="h-3 w-3" />
                          Delayed
                        </span>
                      )}
                      {proj.hasOpenIssues && (
                        <span className="flex items-center gap-1 text-[10px] text-warning">
                          <AlertTriangle className="h-3 w-3" />
                          {proj.openIssuesCount} Issues
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Activate Project Modal */}
      <Dialog open={activateModalOpen} onOpenChange={setActivateModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Activate Project</DialogTitle>
            <DialogDescription>
              Select a booked opportunity to activate as a new project.
            </DialogDescription>
          </DialogHeader>

          {bookedOpportunities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <Inbox className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground mb-1">
                No booked opportunities available
              </p>
              <p className="text-xs text-muted-foreground max-w-sm">
                There are no booked opportunities ready for activation. Opportunities must be won and booked before they can become projects.
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {bookedOpportunities.map((opp) => (
                <button
                  key={opp.id}
                  onClick={() => setSelectedOpportunity(opp)}
                  className={cn(
                    "w-full p-4 rounded-lg border text-left transition-all",
                    selectedOpportunity?.id === opp.id
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-border hover:border-primary/50 hover:bg-accent/50"
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs text-primary font-semibold">
                          {opp.entityId}
                        </span>
                        {selectedOpportunity?.id === opp.id && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <p className="font-medium text-foreground truncate">
                        {opp.opportunityName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {opp.customerName}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-semibold text-foreground">
                        {formatCurrency(opp.bookedValue)}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        Booked {formatShortDate(opp.bookingDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                    <span className="text-xs text-muted-foreground">
                      Salesperson
                    </span>
                    <span className="text-xs text-foreground">
                      {opp.salesperson}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setActivateModalOpen(false)
                setSelectedOpportunity(null)
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleActivateProject}
              disabled={!selectedOpportunity || isActivating}
            >
              {isActivating ? (
                <>Activating...</>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-1.5" />
                  Activate Project
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  )
}
