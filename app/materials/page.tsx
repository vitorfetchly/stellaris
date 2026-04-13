"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  Plus,
  Eye,
  Edit,
  Ban,
  Package,
  Building2,
  Activity,
  FileText,
  FolderKanban,
  Boxes,
} from "lucide-react"
import {
  AppShell,
  PageHeader,
  FilterBar,
  DataTable,
  Column,
  RowAction,
  EmptyState,
  TableLoadingState,
} from "@/components/erp"
import { useNavigationStore } from "@/lib/stores/navigation-store"
import { formatShortDate } from "@/lib/date-utils"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Material type
interface Material {
  id: string
  sku: string
  name: string
  description: string
  category: string
  defaultCost: number
  vendor: string
  isActive: boolean
  usageCount: number
  lastUsed: string | null
  activeProjectsCount: number
  linkedProposalsCount: number
  linkedProjectsCount: number
  createdAt: string
  updatedAt: string
}

// Mock data
const mockMaterials: Material[] = [
  {
    id: "1",
    sku: "CAM-HIK-DS2",
    name: "Hikvision DS-2CD2386G2 Turret Camera",
    description: "8MP AcuSense fixed turret network camera with IR",
    category: "Cameras",
    defaultCost: 420,
    vendor: "Hikvision",
    isActive: true,
    usageCount: 47,
    lastUsed: "2026-04-10",
    activeProjectsCount: 5,
    linkedProposalsCount: 12,
    linkedProjectsCount: 8,
    createdAt: "2024-06-15",
    updatedAt: "2026-03-28",
  },
  {
    id: "2",
    sku: "CAM-HIK-PTZ4K",
    name: "Hikvision DS-2DE4425IW PTZ Camera",
    description: "4MP 25x IR Network Speed Dome PTZ camera",
    category: "Cameras",
    defaultCost: 1250,
    vendor: "Hikvision",
    isActive: true,
    usageCount: 18,
    lastUsed: "2026-04-08",
    activeProjectsCount: 3,
    linkedProposalsCount: 6,
    linkedProjectsCount: 4,
    createdAt: "2024-08-20",
    updatedAt: "2026-02-15",
  },
  {
    id: "3",
    sku: "NVR-HIK-32CH",
    name: "Hikvision DS-7732NXI-K4 NVR",
    description: "32-channel 4K NVR with 4 SATA interfaces, AcuSense",
    category: "Recorders",
    defaultCost: 890,
    vendor: "Hikvision",
    isActive: true,
    usageCount: 22,
    lastUsed: "2026-04-05",
    activeProjectsCount: 4,
    linkedProposalsCount: 8,
    linkedProjectsCount: 6,
    createdAt: "2024-05-10",
    updatedAt: "2026-01-20",
  },
  {
    id: "4",
    sku: "ACC-HID-RDR",
    name: "HID iCLASS SE R10 Reader",
    description: "Contactless smart card reader for access control",
    category: "Access Control",
    defaultCost: 185,
    vendor: "HID Global",
    isActive: true,
    usageCount: 156,
    lastUsed: "2026-04-12",
    activeProjectsCount: 8,
    linkedProposalsCount: 24,
    linkedProjectsCount: 18,
    createdAt: "2023-11-05",
    updatedAt: "2026-04-01",
  },
  {
    id: "5",
    sku: "ACC-HID-CTRL",
    name: "HID VertX EVO V1000 Controller",
    description: "Networked access controller for up to 2 readers",
    category: "Access Control",
    defaultCost: 650,
    vendor: "HID Global",
    isActive: true,
    usageCount: 38,
    lastUsed: "2026-04-11",
    activeProjectsCount: 6,
    linkedProposalsCount: 14,
    linkedProjectsCount: 10,
    createdAt: "2024-01-18",
    updatedAt: "2026-03-15",
  },
  {
    id: "6",
    sku: "ALM-DSC-PNL",
    name: "DSC PowerSeries Neo HS2064",
    description: "Hybrid alarm panel with 64 zones, PowerG ready",
    category: "Alarm Systems",
    defaultCost: 380,
    vendor: "DSC",
    isActive: true,
    usageCount: 28,
    lastUsed: "2026-04-02",
    activeProjectsCount: 2,
    linkedProposalsCount: 9,
    linkedProjectsCount: 7,
    createdAt: "2024-03-22",
    updatedAt: "2026-02-28",
  },
  {
    id: "7",
    sku: "ALM-DSC-MOT",
    name: "DSC PowerG PG9914 Motion Detector",
    description: "Wireless PIR motion detector with pet immunity",
    category: "Alarm Systems",
    defaultCost: 95,
    vendor: "DSC",
    isActive: true,
    usageCount: 84,
    lastUsed: "2026-04-09",
    activeProjectsCount: 4,
    linkedProposalsCount: 16,
    linkedProjectsCount: 12,
    createdAt: "2024-02-10",
    updatedAt: "2026-03-20",
  },
  {
    id: "8",
    sku: "CAB-CAT6-BLK",
    name: "Cat6 UTP Cable 305m Black",
    description: "Category 6 unshielded twisted pair cable, black",
    category: "Cabling",
    defaultCost: 145,
    vendor: "CommScope",
    isActive: true,
    usageCount: 210,
    lastUsed: "2026-04-12",
    activeProjectsCount: 9,
    linkedProposalsCount: 32,
    linkedProjectsCount: 28,
    createdAt: "2023-08-14",
    updatedAt: "2026-04-05",
  },
  {
    id: "9",
    sku: "CAB-FIB-SM6",
    name: "Single Mode Fiber 6-Core",
    description: "OS2 single mode fiber optic cable, 6 cores",
    category: "Cabling",
    defaultCost: 280,
    vendor: "CommScope",
    isActive: true,
    usageCount: 15,
    lastUsed: "2026-03-18",
    activeProjectsCount: 2,
    linkedProposalsCount: 5,
    linkedProjectsCount: 3,
    createdAt: "2024-07-08",
    updatedAt: "2026-01-10",
  },
  {
    id: "10",
    sku: "MON-SAM-32",
    name: "Samsung 32\" Professional Monitor",
    description: "32\" FHD LED monitor for security monitoring",
    category: "Displays",
    defaultCost: 320,
    vendor: "Samsung",
    isActive: true,
    usageCount: 24,
    lastUsed: "2026-04-06",
    activeProjectsCount: 3,
    linkedProposalsCount: 8,
    linkedProjectsCount: 5,
    createdAt: "2024-04-25",
    updatedAt: "2026-03-12",
  },
  {
    id: "11",
    sku: "CAM-AXIS-P1",
    name: "Axis P1448-LE Network Camera",
    description: "12MP outdoor fixed dome camera with IR",
    category: "Cameras",
    defaultCost: 890,
    vendor: "Axis Communications",
    isActive: false,
    usageCount: 12,
    lastUsed: "2025-08-15",
    activeProjectsCount: 0,
    linkedProposalsCount: 4,
    linkedProjectsCount: 3,
    createdAt: "2023-09-20",
    updatedAt: "2025-11-05",
  },
  {
    id: "12",
    sku: "PWR-UPS-1500",
    name: "APC Smart-UPS 1500VA",
    description: "1500VA LCD RM 2U 120V with SmartConnect",
    category: "Power",
    defaultCost: 680,
    vendor: "APC",
    isActive: true,
    usageCount: 31,
    lastUsed: "2026-04-03",
    activeProjectsCount: 4,
    linkedProposalsCount: 10,
    linkedProjectsCount: 8,
    createdAt: "2024-01-30",
    updatedAt: "2026-02-22",
  },
  {
    id: "13",
    sku: "NET-SW-24P",
    name: "Cisco CBS350-24P PoE+ Switch",
    description: "24-port Gigabit PoE+ managed switch, 195W",
    category: "Networking",
    defaultCost: 520,
    vendor: "Cisco",
    isActive: true,
    usageCount: 45,
    lastUsed: "2026-04-11",
    activeProjectsCount: 7,
    linkedProposalsCount: 18,
    linkedProjectsCount: 14,
    createdAt: "2024-02-28",
    updatedAt: "2026-03-30",
  },
  {
    id: "14",
    sku: "INT-SFT-VMS",
    name: "Milestone XProtect Essential+",
    description: "VMS software license per camera, perpetual",
    category: "Software",
    defaultCost: 65,
    vendor: "Milestone Systems",
    isActive: true,
    usageCount: 92,
    lastUsed: "2026-04-10",
    activeProjectsCount: 6,
    linkedProposalsCount: 20,
    linkedProjectsCount: 15,
    createdAt: "2024-05-15",
    updatedAt: "2026-04-02",
  },
  {
    id: "15",
    sku: "MNT-POLE-HD",
    name: "Heavy-Duty Pole Mount Bracket",
    description: "Stainless steel pole mount for PTZ cameras",
    category: "Mounting",
    defaultCost: 85,
    vendor: "Generic",
    isActive: true,
    usageCount: 0,
    lastUsed: null,
    activeProjectsCount: 0,
    linkedProposalsCount: 0,
    linkedProjectsCount: 0,
    createdAt: "2026-03-15",
    updatedAt: "2026-03-15",
  },
  {
    id: "16",
    sku: "CAM-DAH-IPC",
    name: "Dahua IPC-HDBW5442E Dome Camera",
    description: "4MP AI IR dome camera with built-in mic",
    category: "Cameras",
    defaultCost: 285,
    vendor: "Dahua",
    isActive: false,
    usageCount: 8,
    lastUsed: "2025-06-20",
    activeProjectsCount: 0,
    linkedProposalsCount: 2,
    linkedProjectsCount: 2,
    createdAt: "2024-04-10",
    updatedAt: "2025-09-18",
  },
]

const categoryFilters = [
  { value: "cameras", label: "Cameras" },
  { value: "recorders", label: "Recorders" },
  { value: "access-control", label: "Access Control" },
  { value: "alarm-systems", label: "Alarm Systems" },
  { value: "cabling", label: "Cabling" },
  { value: "displays", label: "Displays" },
  { value: "power", label: "Power" },
  { value: "networking", label: "Networking" },
  { value: "software", label: "Software" },
  { value: "mounting", label: "Mounting" },
]

const vendorFilters = [
  { value: "hikvision", label: "Hikvision" },
  { value: "hid-global", label: "HID Global" },
  { value: "dsc", label: "DSC" },
  { value: "commscope", label: "CommScope" },
  { value: "axis-communications", label: "Axis Communications" },
  { value: "samsung", label: "Samsung" },
  { value: "apc", label: "APC" },
  { value: "cisco", label: "Cisco" },
  { value: "milestone-systems", label: "Milestone Systems" },
  { value: "dahua", label: "Dahua" },
  { value: "generic", label: "Generic" },
]

const statusFilters = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
]

const usageFilters = [
  { value: "used", label: "Used" },
  { value: "never-used", label: "Never Used" },
  { value: "recently-used", label: "Recently Used (30d)" },
]

export default function MaterialsListPage() {
  const router = useRouter()
  const setActiveModule = useNavigationStore((state) => state.setActiveModule)
  const [searchValue, setSearchValue] = useState("")
  const [filterValues, setFilterValues] = useState<Record<string, string>>({})
  const [viewMode, setViewMode] = useState<"table" | "cards">("table")
  const [isLoading, setIsLoading] = useState(true)
  const [sortKey, setSortKey] = useState<string>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  useEffect(() => {
    setActiveModule("materials")
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 600)
    return () => clearTimeout(timer)
  }, [setActiveModule])

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortDirection("asc")
    }
  }

  const navigateToMaterial = (material: Material) => {
    router.push(`/materials/${material.id}`)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Filter logic
  const filteredMaterials = useMemo(() => {
    let result = mockMaterials.filter((material) => {
      const matchesSearch =
        !searchValue ||
        material.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        material.sku.toLowerCase().includes(searchValue.toLowerCase()) ||
        material.category.toLowerCase().includes(searchValue.toLowerCase()) ||
        material.vendor.toLowerCase().includes(searchValue.toLowerCase())

      const matchesCategory =
        !filterValues.category ||
        filterValues.category === "all" ||
        material.category.toLowerCase().replace(/\s+/g, "-") === filterValues.category

      const matchesVendor =
        !filterValues.vendor ||
        filterValues.vendor === "all" ||
        material.vendor.toLowerCase().replace(/\s+/g, "-") === filterValues.vendor

      const matchesStatus =
        !filterValues.status ||
        filterValues.status === "all" ||
        (filterValues.status === "active" && material.isActive) ||
        (filterValues.status === "inactive" && !material.isActive)

      const matchesUsage = (() => {
        if (!filterValues.usage || filterValues.usage === "all") return true
        if (filterValues.usage === "used") return material.usageCount > 0
        if (filterValues.usage === "never-used") return material.usageCount === 0
        if (filterValues.usage === "recently-used") {
          if (!material.lastUsed) return false
          const thirtyDaysAgo = new Date()
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
          return new Date(material.lastUsed) >= thirtyDaysAgo
        }
        return true
      })()

      return matchesSearch && matchesCategory && matchesVendor && matchesStatus && matchesUsage
    })

    // Sort
    result = [...result].sort((a, b) => {
      let aVal: string | number | boolean | null = a[sortKey as keyof Material]
      let bVal: string | number | boolean | null = b[sortKey as keyof Material]

      if (aVal === null) aVal = ""
      if (bVal === null) bVal = ""

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDirection === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal)
      }

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal
      }

      if (typeof aVal === "boolean" && typeof bVal === "boolean") {
        return sortDirection === "asc"
          ? (aVal === bVal ? 0 : aVal ? -1 : 1)
          : (aVal === bVal ? 0 : aVal ? 1 : -1)
      }

      return 0
    })

    return result
  }, [searchValue, filterValues, sortKey, sortDirection])

  const columns: Column<Material>[] = [
    {
      key: "sku",
      header: "SKU",
      width: "120px",
      sortable: true,
      render: (row) => (
        <span className="font-mono text-xs text-muted-foreground">{row.sku}</span>
      ),
    },
    {
      key: "name",
      header: "Item Name",
      sortable: true,
      render: (row) => (
        <div className="min-w-0">
          <button
            onClick={(e) => {
              e.stopPropagation()
              navigateToMaterial(row)
            }}
            className="font-medium text-foreground truncate hover:text-primary hover:underline underline-offset-2 transition-colors text-left block"
          >
            {row.name}
          </button>
          <p className="text-xs text-muted-foreground truncate max-w-xs">{row.description}</p>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      width: "120px",
      sortable: true,
      render: (row) => (
        <Badge variant="outline" className="font-normal text-xs">
          {row.category}
        </Badge>
      ),
    },
    {
      key: "defaultCost",
      header: "Default Cost",
      width: "100px",
      sortable: true,
      className: "text-right",
      render: (row) => (
        <span className="font-medium text-xs tabular-nums">
          {formatCurrency(row.defaultCost)}
        </span>
      ),
    },
    {
      key: "vendor",
      header: "Vendor",
      width: "130px",
      sortable: true,
      render: (row) => (
        <span className="text-sm text-foreground">{row.vendor}</span>
      ),
    },
    {
      key: "usageCount",
      header: "Usage",
      width: "70px",
      sortable: true,
      className: "text-center",
      render: (row) => (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span
                className={cn(
                  "text-xs font-medium tabular-nums",
                  row.usageCount === 0 ? "text-muted-foreground" : "text-foreground"
                )}
              >
                {row.usageCount}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>Used in {row.usageCount} BOM entries</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
    },
    {
      key: "lastUsed",
      header: "Last Used",
      width: "90px",
      sortable: true,
      render: (row) => (
        <span className="text-xs text-muted-foreground">
          {row.lastUsed ? formatShortDate(row.lastUsed) : "-"}
        </span>
      ),
    },
    {
      key: "activeProjectsCount",
      header: "Active",
      width: "65px",
      sortable: true,
      className: "text-center",
      render: (row) => (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center justify-center gap-1">
                <FolderKanban className="h-3 w-3 text-muted-foreground" />
                <span
                  className={cn(
                    "text-xs tabular-nums",
                    row.activeProjectsCount > 0 ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {row.activeProjectsCount}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{row.activeProjectsCount} active projects</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
    },
    {
      key: "isActive",
      header: "Status",
      width: "80px",
      sortable: true,
      render: (row) => (
        <Badge
          variant="outline"
          className={cn(
            "text-xs font-medium",
            row.isActive
              ? "bg-success/15 text-success border-success/30"
              : "bg-muted text-muted-foreground border-muted"
          )}
        >
          {row.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: "relationships",
      header: "Links",
      width: "80px",
      render: (row) => (
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-0.5 text-muted-foreground hover:text-foreground transition-colors cursor-default">
                  <FileText className="h-3 w-3" />
                  <span className="text-xs tabular-nums">{row.linkedProposalsCount}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{row.linkedProposalsCount} linked proposals</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-0.5 text-muted-foreground hover:text-foreground transition-colors cursor-default">
                  <FolderKanban className="h-3 w-3" />
                  <span className="text-xs tabular-nums">{row.linkedProjectsCount}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{row.linkedProjectsCount} linked projects</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ),
    },
    {
      key: "updatedAt",
      header: "Updated",
      width: "85px",
      sortable: true,
      render: (row) => (
        <span className="text-xs text-muted-foreground">
          {formatShortDate(row.updatedAt)}
        </span>
      ),
    },
  ]

  const rowActions: RowAction<Material>[] = [
    {
      label: "View Details",
      icon: <Eye className="h-4 w-4" />,
      onClick: (row) => navigateToMaterial(row),
    },
    {
      label: "Edit",
      icon: <Edit className="h-4 w-4" />,
      onClick: (row) => router.push(`/materials/${row.id}/edit`),
    },
    {
      label: "Deactivate",
      icon: <Ban className="h-4 w-4" />,
      onClick: (row) => console.log("Toggle status", row.id),
      variant: "destructive",
      separator: true,
    },
  ]

  // Summary stats
  const totalMaterials = mockMaterials.length
  const activeMaterials = mockMaterials.filter((m) => m.isActive).length
  const uniqueVendors = new Set(mockMaterials.map((m) => m.vendor)).size
  const recentlyUsed = mockMaterials.filter((m) => {
    if (!m.lastUsed) return false
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    return new Date(m.lastUsed) >= thirtyDaysAgo
  }).length

  return (
    <AppShell>
      <div className="space-y-4">
        <PageHeader
          title="Materials"
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Materials" },
          ]}
          primaryAction={{
            label: "Add Material",
            icon: <Plus className="h-4 w-4 mr-1.5" />,
            onClick: () => router.push("/materials/create"),
          }}
        />

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-3">
          <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10">
              <Package className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">{totalMaterials}</p>
              <p className="text-xs text-muted-foreground">Total Materials</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-success/10">
              <Boxes className="h-4 w-4 text-success" />
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">{activeMaterials}</p>
              <p className="text-xs text-muted-foreground">Active Items</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted">
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">{uniqueVendors}</p>
              <p className="text-xs text-muted-foreground">Vendors</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10">
              <Activity className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">{recentlyUsed}</p>
              <p className="text-xs text-muted-foreground">Recently Used (30d)</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card">
          <FilterBar
            searchPlaceholder="Search by name, SKU, category, or vendor..."
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            filters={[
              { key: "category", label: "Category", options: categoryFilters },
              { key: "vendor", label: "Vendor", options: vendorFilters },
              { key: "status", label: "Status", options: statusFilters },
              { key: "usage", label: "Usage", options: usageFilters },
            ]}
            filterValues={filterValues}
            onFilterChange={(key, value) =>
              setFilterValues((prev) => ({ ...prev, [key]: value }))
            }
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            showViewToggle={false}
          />

          {isLoading ? (
            <TableLoadingState rows={8} />
          ) : (
            <DataTable
              data={filteredMaterials}
              columns={columns}
              rowActions={rowActions}
              getRowId={(row) => row.id}
              onRowClick={navigateToMaterial}
              sortKey={sortKey}
              sortDirection={sortDirection}
              onSort={handleSort}
              emptyState={
                <EmptyState
                  icon={Package}
                  title="No materials found"
                  description={
                    searchValue || Object.values(filterValues).some(Boolean)
                      ? "Try adjusting your search or filters"
                      : "Add your first material to get started"
                  }
                  action={
                    !searchValue && !Object.values(filterValues).some(Boolean)
                      ? {
                          label: "Add Material",
                          onClick: () => router.push("/materials/create"),
                        }
                      : undefined
                  }
                />
              }
            />
          )}
        </div>
      </div>
    </AppShell>
  )
}
