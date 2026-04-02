"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, FolderKanban, Target, CheckSquare, AlertTriangle, Eye, Edit, Trash2, ExternalLink } from "lucide-react"
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
} from "@/components/erp"
import { Button } from "@/components/ui/button"
import { formatShortDate } from "@/lib/date-utils"

interface Project {
  id: string
  code: string
  name: string
  client: string
  status: StatusType
  value: number
  progress: number
  dueDate: string
}

const mockProjects: Project[] = [
  {
    id: "1",
    code: "PRJ-001",
    name: "Alpha Shopping Center - CCTV",
    client: "Alpha Ventures",
    status: "in-progress",
    value: 185000,
    progress: 65,
    dueDate: "2026-04-15",
  },
  {
    id: "2",
    code: "PRJ-002",
    name: "Beta Condos - Access Control",
    client: "Beta Construction",
    status: "pending",
    value: 92000,
    progress: 0,
    dueDate: "2026-05-01",
  },
  {
    id: "3",
    code: "PRJ-003",
    name: "Gamma Industries - Perimeter Alarm",
    client: "Gamma Industrial S.A.",
    status: "in-progress",
    value: 156000,
    progress: 35,
    dueDate: "2026-04-28",
  },
  {
    id: "4",
    code: "PRJ-004",
    name: "Delta Hospital - Full Integration",
    client: "Delta Health Network",
    status: "approved",
    value: 420000,
    progress: 10,
    dueDate: "2026-06-30",
  },
  {
    id: "5",
    code: "PRJ-005",
    name: "Epsilon School - Cameras & Alarm",
    client: "Epsilon Foundation",
    status: "completed",
    value: 68000,
    progress: 100,
    dueDate: "2026-03-15",
  },
  {
    id: "6",
    code: "PRJ-006",
    name: "Zeta Store - Anti-theft System",
    client: "Zeta Retail",
    status: "on-hold",
    value: 45000,
    progress: 20,
    dueDate: "2026-05-10",
  },
]

const statusFilters = [
  { value: "pending", label: "Pending" },
  { value: "in-progress", label: "In Progress" },
  { value: "approved", label: "Approved" },
  { value: "completed", label: "Completed" },
  { value: "on-hold", label: "On Hold" },
]

export default function DashboardPage() {
  const router = useRouter()
  const [searchValue, setSearchValue] = useState("")
  const [filterValues, setFilterValues] = useState<Record<string, string>>({})
  const [viewMode, setViewMode] = useState<"table" | "cards">("table")
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())

  const navigateToProject = (project: Project) => {
    router.push(`/projects/${project.code}`)
  }

  const columns: Column<Project>[] = [
    {
      key: "code",
      header: "Code",
      width: "100px",
      sortable: true,
      render: (row) => (
        <span className="font-mono text-xs text-muted-foreground">{row.code}</span>
      ),
    },
    {
      key: "name",
      header: "Project",
      sortable: true,
      render: (row) => (
        <div className="min-w-0">
          <button
            onClick={(e) => {
              e.stopPropagation()
              navigateToProject(row)
            }}
            className="font-medium text-foreground truncate hover:text-primary hover:underline underline-offset-2 transition-colors text-left"
          >
            {row.name}
          </button>
          <p className="text-xs text-muted-foreground truncate">{row.client}</p>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      width: "120px",
      sortable: true,
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: "value",
      header: "Value",
      width: "120px",
      sortable: true,
      className: "text-right",
      render: (row) => (
        <span className="font-medium">
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(row.value)}
        </span>
      ),
    },
    {
      key: "progress",
      header: "Progress",
      width: "140px",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${row.progress}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground w-8">{row.progress}%</span>
        </div>
      ),
    },
    {
      key: "dueDate",
      header: "Due Date",
      width: "100px",
      sortable: true,
      render: (row) => (
        <span className="text-sm text-muted-foreground">
          {formatShortDate(row.dueDate)}
        </span>
      ),
    },
  ]

  const rowActions: RowAction<Project>[] = [
    {
      label: "View",
      icon: <Eye className="h-4 w-4" />,
      onClick: (row) => navigateToProject(row),
    },
    {
      label: "Edit",
      icon: <Edit className="h-4 w-4" />,
      onClick: (row) => router.push(`/projects/${row.code}/edit`),
    },
    {
      label: "Open in new tab",
      icon: <ExternalLink className="h-4 w-4" />,
      onClick: (row) => window.open(`/projects/${row.code}`, "_blank"),
    },
    {
      label: "Delete",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (row) => console.log("Delete", row.id),
      variant: "destructive",
      separator: true,
    },
  ]

  const filteredProjects = mockProjects.filter((project) => {
    const matchesSearch =
      !searchValue ||
      project.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      project.code.toLowerCase().includes(searchValue.toLowerCase()) ||
      project.client.toLowerCase().includes(searchValue.toLowerCase())

    const matchesStatus =
      !filterValues.status ||
      filterValues.status === "all" ||
      project.status === filterValues.status

    return matchesSearch && matchesStatus
  })

  const totalValue = mockProjects.reduce((sum, p) => sum + p.value, 0)
  const activeProjects = mockProjects.filter(
    (p) => p.status === "in-progress" || p.status === "approved"
  ).length

  return (
    <AppShell>
      <div className="space-y-4">
        <PageHeader
          title="Dashboard"
          breadcrumbs={[{ label: "Home" }]}
          primaryAction={{
            label: "New Project",
            onClick: () => console.log("New project"),
            icon: <Plus className="h-4 w-4 mr-1.5" />,
          }}
        />

        <SummaryCardGrid columns={4}>
          <SummaryCard
            title="Active Projects"
            value={activeProjects}
            subtitle="In progress or approved"
            icon={FolderKanban}
          />
          <SummaryCard
            title="Opportunities"
            value={12}
            subtitle="Awaiting qualification"
            icon={Target}
            trend={{ value: 8, label: "vs last month" }}
          />
          <SummaryCard
            title="Pending Tasks"
            value={28}
            subtitle="This week"
            icon={CheckSquare}
          />
          <SummaryCard
            title="Open Issues"
            value={3}
            subtitle="Requires attention"
            icon={AlertTriangle}
          />
        </SummaryCardGrid>

        <div className="rounded-lg border border-border bg-card">
          <div className="px-4 pt-3 pb-0 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">Recent Projects</h2>
          </div>

          <FilterBar
            searchPlaceholder="Search projects..."
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            filters={[
              { key: "status", label: "Status", options: statusFilters },
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
            className="px-4"
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
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => navigateToProject(project)}
                  className="group p-4 rounded-lg border border-border bg-card hover:bg-accent/50 hover:border-primary/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="min-w-0">
                      <p className="font-mono text-xs text-muted-foreground">
                        {project.code}
                      </p>
                      <p className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                        {project.name}
                      </p>
                    </div>
                    <StatusBadge status={project.status} />
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    {project.client}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(project.value)}
                    </span>
                    <span className="text-muted-foreground">{project.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
