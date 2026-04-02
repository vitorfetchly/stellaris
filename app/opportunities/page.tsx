"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  ExternalLink, 
  UserPlus, 
  AlertCircle,
  Clock,
  Target,
  FileText,
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

// Opportunity status type
type OpportunityStatus = "created" | "evaluated" | "assigned" | "in-proposal" | "won" | "lost"

// Request type categories
type RequestType = "new-install" | "upgrade" | "maintenance" | "consultation" | "emergency"

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
  "new-install": "New Installation",
  "upgrade": "Upgrade",
  "maintenance": "Maintenance",
  "consultation": "Consultation",
  "emergency": "Emergency",
}

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
    requestType: "new-install",
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
    requestType: "upgrade",
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
    requestType: "new-install",
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
    requestType: "emergency",
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
    requestType: "new-install",
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
    requestType: "new-install",
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
    requestType: "consultation",
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
    requestType: "maintenance",
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
    requestType: "new-install",
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
    requestType: "upgrade",
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
  { value: "new-install", label: "New Installation" },
  { value: "upgrade", label: "Upgrade" },
  { value: "maintenance", label: "Maintenance" },
  { value: "consultation", label: "Consultation" },
  { value: "emergency", label: "Emergency" },
]

const customerFilters = [
  { value: "techcorp", label: "TechCorp Industries" },
  { value: "megamart", label: "MegaMart Stores" },
  { value: "cloudnet", label: "CloudNet Solutions" },
  { value: "metro-hospital", label: "Metro General Hospital" },
  { value: "state-university", label: "State University" },
]

export default function OpportunitiesPage() {
  const router = useRouter()
  const setActiveModule = useNavigationStore((state) => state.setActiveModule)
  const [searchValue, setSearchValue] = useState("")
  const [filterValues, setFilterValues] = useState<Record<string, string>>({})
  const [viewMode, setViewMode] = useState<"table" | "cards">("table")
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())

  useEffect(() => {
    setActiveModule("opportunities")
  }, [setActiveModule])

  const navigateToOpportunity = (opportunity: Opportunity) => {
    router.push(`/opportunities/${opportunity.entityId}`)
  }

  const columns: Column<Opportunity>[] = [
    {
      key: "entityId",
      header: "Entity ID",
      width: "130px",
      sortable: true,
      render: (row) => (
        <button
          onClick={(e) => {
            e.stopPropagation()
            navigateToOpportunity(row)
          }}
          className="font-mono text-xs font-semibold text-primary hover:underline underline-offset-2 transition-colors"
        >
          {row.entityId}
        </button>
      ),
    },
    {
      key: "name",
      header: "Opportunity / Scope",
      sortable: true,
      render: (row) => (
        <div className="min-w-0">
          <button
            onClick={(e) => {
              e.stopPropagation()
              navigateToOpportunity(row)
            }}
            className="font-medium text-foreground truncate hover:text-primary hover:underline underline-offset-2 transition-colors text-left block"
          >
            {row.name}
          </button>
          <p className="text-xs text-muted-foreground truncate">{row.scope}</p>
        </div>
      ),
    },
    {
      key: "customer",
      header: "Customer",
      width: "160px",
      sortable: true,
      render: (row) => (
        <span className="text-sm text-foreground">{row.customer}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      width: "110px",
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
      key: "owner",
      header: "Owner",
      width: "130px",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-1.5">
          {row.isUnassigned ? (
            <span className="flex items-center gap-1 text-xs text-warning">
              <AlertCircle className="h-3 w-3" />
              Unassigned
            </span>
          ) : (
            <span className="text-sm text-foreground">{row.owner}</span>
          )}
        </div>
      ),
    },
    {
      key: "requestType",
      header: "Type",
      width: "120px",
      sortable: true,
      render: (row) => (
        <span className="text-xs text-muted-foreground">
          {requestTypeLabels[row.requestType]}
        </span>
      ),
    },
    {
      key: "estimatedValue",
      header: "Est. Value",
      width: "110px",
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
      width: "100px",
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

  const rowActions: RowAction<Opportunity>[] = [
    {
      label: "View Details",
      icon: <Eye className="h-4 w-4" />,
      onClick: (row) => navigateToOpportunity(row),
    },
    {
      label: "Edit",
      icon: <Edit className="h-4 w-4" />,
      onClick: (row) => router.push(`/opportunities/${row.entityId}/edit`),
    },
    {
      label: "Assign Owner",
      icon: <UserPlus className="h-4 w-4" />,
      onClick: (row) => console.log("Assign owner", row.entityId),
    },
    {
      label: "Create Proposal",
      icon: <FileText className="h-4 w-4" />,
      onClick: (row) => console.log("Create proposal", row.entityId),
    },
    {
      label: "Open in new tab",
      icon: <ExternalLink className="h-4 w-4" />,
      onClick: (row) => window.open(`/opportunities/${row.entityId}`, "_blank"),
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
  const filteredOpportunities = mockOpportunities.filter((opp) => {
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
  const totalOpportunities = mockOpportunities.length
  const activeOpportunities = mockOpportunities.filter(
    (o) => !["won", "lost"].includes(o.status)
  ).length
  const unassignedCount = mockOpportunities.filter((o) => o.isUnassigned).length
  const staleCount = mockOpportunities.filter((o) => o.isStale).length
  const pipelineValue = mockOpportunities
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
          <FilterBar
            searchPlaceholder="Search by Entity ID, name, customer..."
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            filters={[
              { key: "status", label: "Status", options: statusFilters },
              { key: "owner", label: "Owner", options: ownerFilters },
              { key: "requestType", label: "Request Type", options: requestTypeFilters },
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
            <div className="grid grid-cols-3 gap-4 p-4">
              {filteredOpportunities.map((opp) => (
                <div
                  key={opp.id}
                  onClick={() => navigateToOpportunity(opp)}
                  className="group p-4 rounded-lg border border-border bg-card hover:bg-accent/50 hover:border-primary/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-xs font-semibold text-primary">
                        {opp.entityId}
                      </p>
                      <p className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                        {opp.name}
                      </p>
                    </div>
                    <StatusBadge status={opp.status as StatusType} />
                  </div>
                  
                  <p className="text-xs text-muted-foreground truncate mb-2">
                    {opp.scope}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                    <span>{opp.customer}</span>
                    <span>{requestTypeLabels[opp.requestType]}</span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <LifecycleIndicator currentStage={opp.lifecycleStage} />
                    <span className="font-medium text-sm">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                        maximumFractionDigits: 0,
                      }).format(opp.estimatedValue)}
                    </span>
                  </div>

                  {(opp.isUnassigned || opp.isStale) && (
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border">
                      {opp.isUnassigned && (
                        <span className="flex items-center gap-1 text-[10px] text-warning">
                          <AlertCircle className="h-3 w-3" />
                          Unassigned
                        </span>
                      )}
                      {opp.isStale && (
                        <span className="flex items-center gap-1 text-[10px] text-warning">
                          <Clock className="h-3 w-3" />
                          Stale
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
    </AppShell>
  )
}
