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
  Copy,
  Send,
  Check,
  X,
  FileText,
  DollarSign,
  Clock,
  AlertCircle,
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

// Proposal status type
type ProposalStatus = "draft" | "submitted" | "under-negotiation" | "revision-requested" | "approved" | "rejected"

interface Proposal {
  id: string
  entityId: string
  proposalId: string
  name: string
  opportunityId: string
  opportunityName: string
  customer: string
  status: ProposalStatus
  lifecycleStage: LifecycleStage
  version: number
  isActiveVersion: boolean
  totalValue: number
  marginPercent: number
  salesperson: string
  createdDate: string
  lastUpdated: string
  submittedDate: string | null
  validUntil: string | null
}

// Mock proposals data with Entity ID and lifecycle stage
const mockProposals: Proposal[] = [
  {
    id: "1",
    entityId: "ENT-2026-0058",
    proposalId: "PROP-2026-0042",
    name: "Corporate HQ Security Overhaul - Full Package",
    opportunityId: "OPP-2026-0058",
    opportunityName: "Corporate HQ Security Overhaul",
    customer: "TechCorp Industries",
    status: "under-negotiation",
    lifecycleStage: "proposal",
    version: 3,
    isActiveVersion: true,
    totalValue: 285000,
    marginPercent: 32,
    salesperson: "John Smith",
    createdDate: "2026-03-20",
    lastUpdated: "2026-03-28",
    submittedDate: "2026-03-22",
    validUntil: "2026-04-22",
  },
  {
    id: "2",
    entityId: "ENT-2026-0057",
    proposalId: "PROP-2026-0041",
    name: "Retail Chain Camera Upgrade - Phase 1",
    opportunityId: "OPP-2026-0057",
    opportunityName: "Retail Chain Camera Upgrade",
    customer: "MegaMart Stores",
    status: "submitted",
    lifecycleStage: "proposal",
    version: 1,
    isActiveVersion: true,
    totalValue: 156000,
    marginPercent: 28,
    salesperson: "Mary Johnson",
    createdDate: "2026-03-18",
    lastUpdated: "2026-03-25",
    submittedDate: "2026-03-25",
    validUntil: "2026-04-25",
  },
  {
    id: "3",
    entityId: "ENT-2026-0056",
    proposalId: "PROP-2026-0040",
    name: "Data Center Access Control - Premium",
    opportunityId: "OPP-2026-0056",
    opportunityName: "Data Center Access Control",
    customer: "CloudNet Solutions",
    status: "draft",
    lifecycleStage: "proposal",
    version: 1,
    isActiveVersion: true,
    totalValue: 420000,
    marginPercent: 35,
    salesperson: "Peter Brown",
    createdDate: "2026-03-15",
    lastUpdated: "2026-03-27",
    submittedDate: null,
    validUntil: null,
  },
  {
    id: "4",
    entityId: "ENT-2026-0054",
    proposalId: "PROP-2026-0039",
    name: "University Campus Expansion - Security",
    opportunityId: "OPP-2026-0054",
    opportunityName: "University Campus Expansion",
    customer: "State University",
    status: "approved",
    lifecycleStage: "won",
    version: 2,
    isActiveVersion: true,
    totalValue: 380000,
    marginPercent: 30,
    salesperson: "Charles Wilson",
    createdDate: "2026-02-28",
    lastUpdated: "2026-03-20",
    submittedDate: "2026-03-05",
    validUntil: "2026-04-05",
  },
  {
    id: "5",
    entityId: "ENT-2026-0050",
    proposalId: "PROP-2026-0038",
    name: "Luxury Condo Complex - Integrated Security",
    opportunityId: "OPP-2026-0050",
    opportunityName: "Luxury Condo Complex",
    customer: "Prestige Properties",
    status: "revision-requested",
    lifecycleStage: "proposal",
    version: 2,
    isActiveVersion: true,
    totalValue: 520000,
    marginPercent: 27,
    salesperson: "Mary Johnson",
    createdDate: "2026-02-20",
    lastUpdated: "2026-03-26",
    submittedDate: "2026-03-10",
    validUntil: "2026-04-10",
  },
  {
    id: "6",
    entityId: "ENT-2026-0053",
    proposalId: "PROP-2026-0037",
    name: "Warehouse Perimeter Detection - Basic",
    opportunityId: "OPP-2026-0053",
    opportunityName: "Warehouse Perimeter Detection",
    customer: "LogiFreight Inc.",
    status: "rejected",
    lifecycleStage: "opportunity",
    version: 1,
    isActiveVersion: false,
    totalValue: 145000,
    marginPercent: 25,
    salesperson: "Anna Lee",
    createdDate: "2026-02-15",
    lastUpdated: "2026-03-10",
    submittedDate: "2026-02-20",
    validUntil: "2026-03-20",
  },
  {
    id: "7",
    entityId: "ENT-2026-0053",
    proposalId: "PROP-2026-0036",
    name: "Warehouse Perimeter Detection - Enhanced",
    opportunityId: "OPP-2026-0053",
    opportunityName: "Warehouse Perimeter Detection",
    customer: "LogiFreight Inc.",
    status: "draft",
    lifecycleStage: "proposal",
    version: 2,
    isActiveVersion: true,
    totalValue: 195000,
    marginPercent: 29,
    salesperson: "Anna Lee",
    createdDate: "2026-03-12",
    lastUpdated: "2026-03-28",
    submittedDate: null,
    validUntil: null,
  },
  {
    id: "8",
    entityId: "ENT-2026-0052",
    proposalId: "PROP-2026-0035",
    name: "Bank Branch Security Audit - Consultation",
    opportunityId: "OPP-2026-0052",
    opportunityName: "Bank Branch Security Audit",
    customer: "First National Bank",
    status: "submitted",
    lifecycleStage: "proposal",
    version: 1,
    isActiveVersion: true,
    totalValue: 35000,
    marginPercent: 45,
    salesperson: "Peter Brown",
    createdDate: "2026-03-05",
    lastUpdated: "2026-03-22",
    submittedDate: "2026-03-22",
    validUntil: "2026-04-22",
  },
  {
    id: "9",
    entityId: "ENT-2026-0051",
    proposalId: "PROP-2026-0034",
    name: "Manufacturing Plant - Maintenance Contract",
    opportunityId: "OPP-2026-0051",
    opportunityName: "Manufacturing Plant Maintenance",
    customer: "SteelWorks Manufacturing",
    status: "rejected",
    lifecycleStage: "opportunity",
    version: 2,
    isActiveVersion: false,
    totalValue: 72000,
    marginPercent: 22,
    salesperson: "John Smith",
    createdDate: "2026-02-01",
    lastUpdated: "2026-03-05",
    submittedDate: "2026-02-15",
    validUntil: "2026-03-15",
  },
  {
    id: "10",
    entityId: "ENT-2026-0055",
    proposalId: "PROP-2026-0033",
    name: "Hospital Emergency Response - Quick Deploy",
    opportunityId: "OPP-2026-0055",
    opportunityName: "Hospital Emergency Response",
    customer: "Metro General Hospital",
    status: "draft",
    lifecycleStage: "proposal",
    version: 1,
    isActiveVersion: true,
    totalValue: 45000,
    marginPercent: 20,
    salesperson: "Charles Wilson",
    createdDate: "2026-03-28",
    lastUpdated: "2026-03-28",
    submittedDate: null,
    validUntil: null,
  },
]

// Opportunities eligible for proposal creation (evaluated or assigned status)
interface EligibleOpportunity {
  id: string
  entityId: string
  name: string
  customer: string
  owner: string
  status: string
  estimatedValue: number
  lastUpdated: string
}

const eligibleOpportunities: EligibleOpportunity[] = [
  {
    id: "1",
    entityId: "ENT-2026-0060",
    name: "Airport Terminal Security",
    customer: "Metro International Airport",
    owner: "John Smith",
    status: "Assigned",
    estimatedValue: 650000,
    lastUpdated: "2026-03-27",
  },
  {
    id: "2",
    entityId: "ENT-2026-0059",
    name: "Pharmaceutical Lab Access Control",
    customer: "BioGen Labs Inc.",
    owner: "Mary Johnson",
    status: "Evaluated",
    estimatedValue: 280000,
    lastUpdated: "2026-03-25",
  },
  {
    id: "3",
    entityId: "ENT-2026-0048",
    name: "Hotel Chain Camera Refresh",
    customer: "Grand Hotels Group",
    owner: "Anna Lee",
    status: "Assigned",
    estimatedValue: 175000,
    lastUpdated: "2026-03-22",
  },
]

const statusFilters = [
  { value: "draft", label: "Draft" },
  { value: "submitted", label: "Submitted" },
  { value: "under-negotiation", label: "Under Negotiation" },
  { value: "revision-requested", label: "Revision Requested" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
]

const salespersonFilters = [
  { value: "john-smith", label: "John Smith" },
  { value: "mary-johnson", label: "Mary Johnson" },
  { value: "charles-wilson", label: "Charles Wilson" },
  { value: "anna-lee", label: "Anna Lee" },
  { value: "peter-brown", label: "Peter Brown" },
]

const customerFilters = [
  { value: "techcorp", label: "TechCorp Industries" },
  { value: "megamart", label: "MegaMart Stores" },
  { value: "cloudnet", label: "CloudNet Solutions" },
  { value: "state-university", label: "State University" },
  { value: "prestige", label: "Prestige Properties" },
  { value: "logifreight", label: "LogiFreight Inc." },
]

export default function ProposalsPage() {
  const router = useRouter()
  const setActiveModule = useNavigationStore((state) => state.setActiveModule)
  const [searchValue, setSearchValue] = useState("")
  const [filterValues, setFilterValues] = useState<Record<string, string>>({})
  const [viewMode, setViewMode] = useState<"table" | "cards">("table")
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  
  // Modal state
  const [startProposalModalOpen, setStartProposalModalOpen] = useState(false)
  const [selectedOpportunity, setSelectedOpportunity] = useState<EligibleOpportunity | null>(null)
  const [isStarting, setIsStarting] = useState(false)

  useEffect(() => {
    setActiveModule("proposals")
  }, [setActiveModule])

  // Navigate based on entity's current lifecycle stage
  const navigateToEntity = (proposal: Proposal) => {
    switch (proposal.lifecycleStage) {
      case "won":
      case "project":
        router.push(`/projects/${proposal.entityId}`)
        break
      case "proposal":
        router.push(`/proposals/${proposal.entityId}`)
        break
      case "opportunity":
        router.push(`/opportunities/${proposal.entityId}`)
        break
      default:
        router.push(`/proposals/${proposal.entityId}`)
    }
  }

  const navigateToProposal = (proposal: Proposal) => {
    router.push(`/proposals/${proposal.entityId}`)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Handle starting a proposal from an opportunity
  const handleStartProposal = async () => {
    if (!selectedOpportunity) return
    
    setIsStarting(true)
    // Simulate API call to create the proposal record
    await new Promise((resolve) => setTimeout(resolve, 800))
    
    // Navigate to proposal detail page with new flag for editable state
    // In real app, the API would return the new proposal ID
    router.push(`/proposals/${selectedOpportunity.entityId}?new=true`)
  }

  // Handle Quick Proposal (creates upstream structure automatically)
  const handleQuickProposal = () => {
    console.log("Quick Proposal: Creating minimal upstream structure...")
    router.push("/proposals/quick-create")
  }

  const columns: Column<Proposal>[] = [
    {
      key: "entityId",
      header: "Entity ID",
      width: "130px",
      sortable: true,
      render: (row) => (
        <button
          onClick={(e) => {
            e.stopPropagation()
            navigateToEntity(row)
          }}
          className="font-mono text-xs font-semibold text-primary hover:underline underline-offset-2 transition-colors"
        >
          {row.entityId}
        </button>
      ),
    },
    {
      key: "name",
      header: "Proposal Name",
      sortable: true,
      render: (row) => (
        <div className="min-w-0">
          <button
            onClick={(e) => {
              e.stopPropagation()
              navigateToProposal(row)
            }}
            className="font-medium text-foreground truncate hover:text-primary hover:underline underline-offset-2 transition-colors text-left block"
          >
            {row.name}
          </button>
        </div>
      ),
    },
    {
      key: "version",
      header: "Version",
      width: "80px",
      sortable: true,
      render: (row) => (
        <span className={cn(
          "text-[10px] px-1.5 py-0.5 rounded font-medium",
          row.isActiveVersion 
            ? "bg-primary/10 text-primary"
            : "bg-muted text-muted-foreground"
        )}>
          v{row.version}
          {row.isActiveVersion && " (active)"}
        </span>
      ),
    },
    {
      key: "customer",
      header: "Customer",
      width: "150px",
      sortable: true,
      render: (row) => (
        <span className="text-sm text-foreground truncate block">{row.customer}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      width: "130px",
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
      key: "totalValue",
      header: "Total Value",
      width: "110px",
      sortable: true,
      className: "text-right",
      render: (row) => (
        <span className="font-medium text-sm">{formatCurrency(row.totalValue)}</span>
      ),
    },
    {
      key: "marginPercent",
      header: "Margin",
      width: "70px",
      sortable: true,
      className: "text-right",
      render: (row) => (
        <span className={cn(
          "text-sm font-medium",
          row.marginPercent >= 30 ? "text-success" : 
          row.marginPercent >= 25 ? "text-foreground" : 
          "text-warning"
        )}>
          {row.marginPercent}%
        </span>
      ),
    },
    {
      key: "salesperson",
      header: "Salesperson",
      width: "120px",
      sortable: true,
      render: (row) => (
        <span className="text-sm text-foreground">{row.salesperson}</span>
      ),
    },
    {
      key: "lastUpdated",
      header: "Updated",
      width: "90px",
      sortable: true,
      render: (row) => (
        <span className="text-xs text-muted-foreground">
          {formatShortDate(row.lastUpdated)}
        </span>
      ),
    },
  ]

  const rowActions: RowAction<Proposal>[] = [
    {
      label: "View",
      icon: <Eye className="h-4 w-4" />,
      onClick: (row) => navigateToProposal(row),
    },
    {
      label: "Edit",
      icon: <Edit className="h-4 w-4" />,
      onClick: (row) => router.push(`/proposals/${row.entityId}/edit`),
    },
    {
      label: "Duplicate",
      icon: <Copy className="h-4 w-4" />,
      onClick: (row) => console.log("Duplicate", row.proposalId),
    },
    {
      label: "Submit",
      icon: <Send className="h-4 w-4" />,
      onClick: (row) => console.log("Submit", row.proposalId),
    },
    {
      label: "Mark Approved",
      icon: <Check className="h-4 w-4" />,
      onClick: (row) => console.log("Approve", row.proposalId),
      separator: true,
    },
    {
      label: "Mark Rejected",
      icon: <X className="h-4 w-4" />,
      onClick: (row) => console.log("Reject", row.proposalId),
    },
    {
      label: "Open in new tab",
      icon: <ExternalLink className="h-4 w-4" />,
      onClick: (row) => window.open(`/proposals/${row.entityId}`, "_blank"),
      separator: true,
    },
    {
      label: "Delete",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (row) => console.log("Delete", row.proposalId),
      variant: "destructive",
    },
  ]

  // Filter logic
  const filteredProposals = mockProposals.filter((proposal) => {
    const matchesSearch =
      !searchValue ||
      proposal.entityId.toLowerCase().includes(searchValue.toLowerCase()) ||
      proposal.proposalId.toLowerCase().includes(searchValue.toLowerCase()) ||
      proposal.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      proposal.customer.toLowerCase().includes(searchValue.toLowerCase())

    const matchesStatus =
      !filterValues.status ||
      filterValues.status === "all" ||
      proposal.status === filterValues.status

    const matchesSalesperson =
      !filterValues.salesperson ||
      filterValues.salesperson === "all" ||
      proposal.salesperson.toLowerCase().replace(/\s+/g, "-") === filterValues.salesperson

    const matchesCustomer =
      !filterValues.customer ||
      filterValues.customer === "all" ||
      proposal.customer.toLowerCase().includes(filterValues.customer.replace(/-/g, " "))

    return matchesSearch && matchesStatus && matchesSalesperson && matchesCustomer
  })

  // Summary stats - using same patterns as Opportunities page
  const draftCount = mockProposals.filter((p) => p.status === "draft").length
  const submittedCount = mockProposals.filter((p) => 
    p.status === "submitted" || p.status === "under-negotiation"
  ).length
  const revisionCount = mockProposals.filter((p) => p.status === "revision-requested").length
  const approvedCount = mockProposals.filter((p) => p.status === "approved").length
  const rejectedCount = mockProposals.filter((p) => p.status === "rejected").length
  
  const totalPipelineValue = mockProposals
    .filter((p) => !["approved", "rejected"].includes(p.status))
    .reduce((sum, p) => sum + p.totalValue, 0)

  return (
    <AppShell>
      <div className="space-y-4">
        <PageHeader
          title="Proposals"
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Proposals" },
          ]}
          primaryAction={
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Zap className="h-4 w-4 mr-1.5" />
                    Quick Proposal
                    <ChevronDown className="h-3 w-3 ml-1.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleQuickProposal}>
                    <Zap className="h-4 w-4 mr-2" />
                    Create Quick Proposal
                    <span className="ml-2 text-[10px] text-muted-foreground">
                      (auto-creates opportunity)
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button size="sm" onClick={() => setStartProposalModalOpen(true)}>
                <Play className="h-4 w-4 mr-1.5" />
                Start Proposal
              </Button>
            </div>
          }
        />

        {/* Summary Cards - using shared SummaryCardGrid component */}
        <SummaryCardGrid columns={4}>
          <SummaryCard
            title="Draft"
            value={draftCount}
            subtitle="Not yet submitted"
            icon={FileText}
          />
          <SummaryCard
            title="Submitted / Negotiation"
            value={submittedCount}
            subtitle={formatCurrency(totalPipelineValue)}
            icon={Send}
          />
          <SummaryCard
            title="Revision Requested"
            value={revisionCount}
            subtitle="Needs attention"
            icon={AlertCircle}
          />
          <SummaryCard
            title="Approved"
            value={approvedCount}
            subtitle={`${rejectedCount} rejected`}
            icon={Check}
          />
        </SummaryCardGrid>

        <div className="rounded-lg border border-border bg-card">
          <FilterBar
            searchPlaceholder="Search by Entity ID, proposal name, customer..."
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            filters={[
              { key: "status", label: "Status", options: statusFilters },
              { key: "salesperson", label: "Salesperson", options: salespersonFilters },
              { key: "customer", label: "Customer", options: customerFilters },
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
              data={filteredProposals}
              columns={columns}
              rowActions={rowActions}
              selectable
              selectedRows={selectedRows}
              onSelectionChange={setSelectedRows}
              getRowId={(row) => row.id}
              onRowClick={(row) => navigateToProposal(row)}
              className="border-0 rounded-none"
            />
          ) : (
            <div className="grid grid-cols-3 gap-4 p-4">
              {filteredProposals.map((proposal) => (
                <div
                  key={proposal.id}
                  onClick={() => navigateToProposal(proposal)}
                  className="group p-4 rounded-lg border border-border bg-card hover:bg-accent/50 hover:border-primary/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            navigateToEntity(proposal)
                          }}
                          className="font-mono text-xs font-semibold text-primary hover:underline"
                        >
                          {proposal.entityId}
                        </button>
                        <span className={cn(
                          "text-[9px] px-1 py-0.5 rounded font-medium",
                          proposal.isActiveVersion 
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground"
                        )}>
                          v{proposal.version}
                        </span>
                      </div>
                      <p className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                        {proposal.name}
                      </p>
                    </div>
                    <StatusBadge status={proposal.status as StatusType} />
                  </div>
                  
                  <p className="text-xs text-muted-foreground mb-3">
                    {proposal.customer}
                  </p>

                  <div className="flex items-center justify-between mb-3">
                    <LifecycleIndicator currentStage={proposal.lifecycleStage} />
                    <span className="font-semibold text-foreground">
                      {formatCurrency(proposal.totalValue)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border text-xs">
                    <span className="text-muted-foreground">{proposal.salesperson}</span>
                    <span className={cn(
                      "font-medium",
                      proposal.marginPercent >= 30 ? "text-success" : 
                      proposal.marginPercent >= 25 ? "text-foreground" : 
                      "text-warning"
                    )}>
                      {proposal.marginPercent}% margin
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Start Proposal Modal */}
      <Dialog open={startProposalModalOpen} onOpenChange={setStartProposalModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Start Proposal</DialogTitle>
            <DialogDescription>
              Select an opportunity to start a proposal. Proposals must be linked to an existing opportunity.
            </DialogDescription>
          </DialogHeader>

          {eligibleOpportunities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <Inbox className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground mb-1">
                No eligible opportunities available
              </p>
              <p className="text-xs text-muted-foreground max-w-sm">
                There are no opportunities ready for proposal work. Opportunities must be evaluated or assigned before a proposal can be started.
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {eligibleOpportunities.map((opp) => (
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
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                          {opp.status}
                        </span>
                        {selectedOpportunity?.id === opp.id && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <p className="font-medium text-foreground truncate">
                        {opp.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {opp.customer}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-semibold text-foreground">
                        {formatCurrency(opp.estimatedValue)}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        Est. value
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border text-xs">
                    <span className="text-muted-foreground">Owner: {opp.owner}</span>
                    <span className="text-muted-foreground">
                      Updated {formatShortDate(opp.lastUpdated)}
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
                setStartProposalModalOpen(false)
                setSelectedOpportunity(null)
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleStartProposal}
              disabled={!selectedOpportunity || isStarting}
            >
              {isStarting ? (
                <>Starting...</>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-1.5" />
                  Start Proposal
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  )
}
