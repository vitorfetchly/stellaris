"use client"

import { use, useEffect, useState, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  Edit,
  Copy,
  Send,
  ChevronDown,
  ExternalLink,
  MoreHorizontal,
  Link2,
  History,
  FileText,
  DollarSign,
  AlertTriangle,
  Clock,
  Users,
  Building2,
  Calendar,
  Package,
  Wrench,
  Truck,
  CheckCircle,
  XCircle,
  Plus,
  Trash2,
  Calculator,
  TrendingUp,
  TrendingDown,
  MessageSquare,
  Upload,
  ChevronRight,
  Paperclip,
  Save,
  X,
  Search,
  Database,
  PenLine,
} from "lucide-react"
import {
  AppShell,
  StatusBadge,
  StatusType,
  DashboardPanel,
  MetricRow,
  ActivityItem,
  EntityHeader,
  LifecycleStage,
  LifecycleState,
  BomDrawer,
} from "@/components/erp"
import type { BomItem as BomItemType } from "@/components/erp"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

import { useNavigationStore } from "@/lib/stores/navigation-store"
import { cn } from "@/lib/utils"

// Mock proposal data
const proposalData = {
  entityId: "ENT-2026-0058",
  proposalId: "PROP-2026-0042",
  name: "Corporate HQ Security Overhaul - Full Package",
  status: "under-negotiation" as StatusType,
  version: 3,
  isActiveVersion: true,
  createdDate: "2026-03-20",
  lastUpdated: "2026-03-28",
  submittedDate: "2026-03-22",
  validUntil: "2026-04-22",
  
  // Opportunity linkage
  opportunity: {
    id: "OPP-2026-0058",
    name: "Corporate HQ Security Overhaul",
    href: "/opportunities/ENT-2026-0058",
  },
  
  // Customer & Salesperson
  customer: {
    name: "TechCorp Industries",
    type: "Enterprise",
    industry: "Technology",
  },
  salesperson: "John Smith",
  technicalLead: "Charles Wilson",
  
  // Scope Section
  scope: {
    description: "Complete security infrastructure upgrade for new corporate campus expansion. Includes CCTV, Access Control, and Intrusion Detection systems across 3 buildings with integration to existing Honeywell infrastructure.",
    assumptions: [
      "Client provides power and network drops at camera locations",
      "Existing Honeywell system is compatible with proposed middleware",
      "Site access available during business hours for installation",
      "Client IT team assists with network configuration",
    ],
    constraints: [
      "Installation must not disrupt daily operations",
      "Phased implementation required - Building A first",
      "Budget approval required before Phase 2",
      "Existing warranty on Honeywell equipment must be maintained",
    ],
    deliverables: [
      "200+ IP camera installation and configuration",
      "Biometric access control for 45 doors",
      "Integration with existing alarm system",
      "Mobile app deployment for security team",
      "Training for 15 security personnel",
    ],
  },
  
  // System Design / Attachments
  systemDesign: {
    description: "Multi-site IP-based surveillance with centralized NVR, biometric access control at all entry points, and integrated intrusion detection.",
    components: [
      { name: "Hikvision 4K IP Cameras", quantity: 120, unitType: "Building A" },
      { name: "Hikvision 4K IP Cameras", quantity: 80, unitType: "Building B & C" },
      { name: "Access Control Panels", quantity: 15, unitType: "Per floor" },
      { name: "Biometric Readers", quantity: 45, unitType: "Per door" },
      { name: "NVR Units", quantity: 8, unitType: "Per building zone" },
    ],
    attachments: [
      { name: "System Architecture Diagram.pdf", type: "pdf", size: "2.4 MB", date: "Mar 25" },
      { name: "Camera Placement Map.dwg", type: "cad", size: "15.2 MB", date: "Mar 26" },
      { name: "Integration Spec Document.pdf", type: "pdf", size: "890 KB", date: "Mar 27" },
    ],
  },
  
  // Bill of Materials
  billOfMaterials: [
    { id: 1, item: "Hikvision DS-2CD2386G2-IU 4K Camera", category: "Cameras", quantity: 200, unitCost: 450, total: 90000, source: "catalog" as const, sku: "HIK-2386-4K", vendor: "Hikvision" },
    { id: 2, item: "HikCentral Professional NVR 64ch", category: "Recording", quantity: 8, unitCost: 3500, total: 28000, source: "catalog" as const, sku: "HIK-NVR-64", vendor: "Hikvision" },
    { id: 3, item: "ZKTeco SpeedFace-V5L Biometric Reader", category: "Access Control", quantity: 45, unitCost: 650, total: 29250, source: "catalog" as const, sku: "ZKT-V5L", vendor: "ZKTeco" },
    { id: 4, item: "Honeywell Galaxy Integration Module", category: "Integration", quantity: 3, unitCost: 2200, total: 6600, source: "catalog" as const, sku: "HON-GAL-INT", vendor: "Honeywell" },
    { id: 5, item: "CAT6A Cabling (per 1000ft)", category: "Infrastructure", quantity: 15, unitCost: 280, total: 4200, source: "catalog" as const, sku: "CAB-6A-1K", vendor: "Belden" },
    { id: 6, item: "Network Switch 48-Port PoE+", category: "Networking", quantity: 12, unitCost: 1200, total: 14400, source: "catalog" as const, sku: "NET-48P-POE", vendor: "Cisco" },
    { id: 7, item: "UPS Battery Backup 3000VA", category: "Power", quantity: 8, unitCost: 850, total: 6800, source: "catalog" as const, sku: "UPS-3000", vendor: "APC" },
    { id: 8, item: "Mounting Hardware Kit", category: "Installation", quantity: 200, unitCost: 25, total: 5000, source: "catalog" as const, sku: "MNT-KIT-01", vendor: "Generic" },
    { id: 9, item: "Custom Security Signage Package", category: "Misc", quantity: 25, unitCost: 45, total: 1125, source: "custom" as const },
  ],
  
  // Labor
  labor: [
    { id: 1, task: "Project Management", role: "PM", hours: 120, rate: 125, total: 15000 },
    { id: 2, task: "Camera Installation", role: "Tech", hours: 400, rate: 85, total: 34000 },
    { id: 3, task: "Access Control Installation", role: "Tech", hours: 180, rate: 85, total: 15300 },
    { id: 4, task: "Network Configuration", role: "Engineer", hours: 80, rate: 110, total: 8800 },
    { id: 5, task: "System Integration", role: "Engineer", hours: 60, rate: 135, total: 8100 },
    { id: 6, task: "Testing & Commissioning", role: "QA", hours: 40, rate: 95, total: 3800 },
    { id: 7, task: "Training", role: "Trainer", hours: 24, rate: 100, total: 2400 },
  ],
  
  // Subcontractors
  subcontractors: [
    { id: 1, scope: "Electrical Work (conduit, power)", vendor: "Alpha Electric Co.", quote: 18500, status: "selected" },
    { id: 2, scope: "Network Cabling Installation", vendor: "NetWire Solutions", quote: 12000, status: "selected" },
    { id: 3, scope: "Concrete Cutting for Conduit", vendor: "BuildRight Construction", quote: 3500, status: "pending" },
    { id: 4, scope: "Network Cabling Installation", vendor: "CablePro Inc.", quote: 14500, status: "rejected" },
  ],
  
  // Versions
  versions: [
    { version: 3, status: "under-negotiation", createdDate: "2026-03-28", author: "John Smith", notes: "Adjusted pricing after client feedback" },
    { version: 2, status: "revision-requested", createdDate: "2026-03-22", author: "John Smith", notes: "Initial submission to client" },
    { version: 1, status: "draft", createdDate: "2026-03-20", author: "John Smith", notes: "First draft" },
  ],
  
  // Activity Log
  activity: [
    { icon: Calculator, title: "Pricing updated", description: "Margin adjusted to 32%", time: "2h ago" },
    { icon: MessageSquare, title: "Client feedback received", description: "Requested Phase 2 pricing breakdown", time: "1d ago" },
    { icon: Send, title: "Proposal submitted", description: "Version 2 sent to client", time: "6d ago" },
    { icon: Upload, title: "Document added", description: "Integration Spec Document.pdf", time: "1w ago" },
    { icon: FileText, title: "Scope updated", description: "Added training deliverable", time: "1w ago" },
    { icon: Plus, title: "Proposal created", description: "From opportunity OPP-2026-0058", time: "8d ago" },
  ],
}

// BOM Item Type
interface BOMItem {
  id: number
  item: string
  category: string
  quantity: number
  unitCost: number
  total: number
  source: "catalog" | "custom"
  sku?: string
  vendor?: string
}

// Entity/Lifecycle data
const entityData = {
  entityId: "ENT-2026-0058",
  currentStage: "proposal" as LifecycleStage,
  customerName: "TechCorp Industries",
  programName: null,
  programHref: null,
  lastModifiedBy: "John Smith",
  lastModifiedAt: "Mar 28, 2026 at 2:45 PM",
  lifecycle: [
    {
      stage: "request" as LifecycleStage,
      completedAt: "Mar 10, 2026",
      completedBy: "System",
      referenceId: "REQ-2026-0058",
      href: "/requests/REQ-2026-0058",
    },
    {
      stage: "opportunity" as LifecycleStage,
      completedAt: "Mar 15, 2026",
      completedBy: "Mary Johnson",
      referenceId: "OPP-2026-0058",
      href: "/opportunities/ENT-2026-0058",
    },
    {
      stage: "proposal" as LifecycleStage,
    },
  ] as LifecycleState[],
}

function formatDate(dateString: string): string {
  const date = new Date(dateString + "T00:00:00")
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

// Editable table row component
function EditableCell({ 
  value, 
  onChange, 
  type = "text",
  className 
}: { 
  value: string | number
  onChange: (value: string | number) => void
  type?: "text" | "number" | "currency"
  className?: string
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(String(value))
  
  const handleBlur = () => {
    setIsEditing(false)
    if (type === "number" || type === "currency") {
      const numValue = parseFloat(editValue.replace(/[^0-9.-]/g, "")) || 0
      onChange(numValue)
    } else {
      onChange(editValue)
    }
  }
  
  if (isEditing) {
    return (
      <Input
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={(e) => e.key === "Enter" && handleBlur()}
        autoFocus
        className={cn("h-7 text-xs", className)}
      />
    )
  }
  
  return (
    <span 
      onClick={() => setIsEditing(true)}
      className={cn("cursor-pointer hover:bg-accent/50 px-1 py-0.5 rounded", className)}
    >
      {type === "currency" ? formatCurrency(Number(value)) : value}
    </span>
  )
}

// Alert item component
function AlertItem({ 
  title, 
  description, 
  severity 
}: { 
  title: string
  description?: string
  severity: "error" | "warning" | "info"
}) {
  const colors = {
    error: "bg-destructive/10 text-destructive border-destructive/30",
    warning: "bg-warning/10 text-warning border-warning/30",
    info: "bg-primary/10 text-primary border-primary/30",
  }
  
  return (
    <div className={cn("flex items-start gap-2 p-2 rounded border text-xs", colors[severity])}>
      <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        <span className="font-medium">{title}</span>
        {description && <p className="text-[10px] opacity-80 mt-0.5">{description}</p>}
      </div>
    </div>
  )
}

export default function ProposalDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const searchParams = useSearchParams()
  const isNewProposal = searchParams.get("new") === "true"
  
  // For new proposals, use empty/draft state; otherwise fetch existing data
  const proposal = isNewProposal ? {
    ...proposalData,
    name: `${proposalData.opportunity.name} - New Proposal`,
    status: "draft" as StatusType,
    version: 1,
    isActiveVersion: true,
    createdDate: new Date().toISOString().split("T")[0],
    lastUpdated: new Date().toISOString().split("T")[0],
    submittedDate: null,
    validUntil: null,
    // Empty sections for new proposals
    scope: {
      description: "",
      assumptions: [],
      constraints: [],
      deliverables: [],
    },
    systemDesign: {
      description: "",
      components: [],
      attachments: [],
    },
    billOfMaterials: [],
    labor: [],
    subcontractors: [],
    versions: [{ version: 1, status: "draft", createdDate: new Date().toISOString().split("T")[0], author: "Current User", notes: "Initial draft" }],
    activity: [{ icon: Plus, title: "Proposal created", description: `From opportunity ${proposalData.opportunity.name}`, time: "Just now" }],
  } : proposalData
  
  const setActiveModule = useNavigationStore((state) => state.setActiveModule)
  const [selectedVersion, setSelectedVersion] = useState(String(proposal.version))
  const [activeTab, setActiveTab] = useState("scope")
  
  // Pricing state (for real-time calculations)
  const [markupPercent, setMarkupPercent] = useState(isNewProposal ? 30 : 32)
  
  // Add Item drawer state
  const [addItemDrawerOpen, setAddItemDrawerOpen] = useState(false)
  
  // BOM state (for managing items locally)
  const [bomItems, setBomItems] = useState(proposal.billOfMaterials)
  
  useEffect(() => {
    setActiveModule("proposals")
  }, [setActiveModule])
  
  // Calculate financials
  const financials = useMemo(() => {
    const materialCost = proposal.billOfMaterials.reduce((sum, item) => sum + item.total, 0)
    const laborCost = proposal.labor.reduce((sum, item) => sum + item.total, 0)
    const subcontractorCost = proposal.subcontractors
      .filter(s => s.status === "selected")
      .reduce((sum, item) => sum + item.quote, 0)
    const totalCost = materialCost + laborCost + subcontractorCost
    const margin = totalCost * (markupPercent / 100)
    const finalPrice = totalCost + margin
    
    return {
      materialCost,
      laborCost,
      subcontractorCost,
      totalCost,
      margin,
      marginPercent: markupPercent,
      finalPrice,
    }
  }, [proposal, markupPercent])
  
  // Alerts based on data
  const alerts = useMemo(() => {
    const items: { title: string; description?: string; severity: "error" | "warning" | "info" }[] = []
    
    if (isNewProposal) {
      items.push({ title: "New proposal", description: "Fill in the sections below to build your proposal", severity: "info" })
      if (proposal.billOfMaterials.length === 0) {
        items.push({ title: "Add materials", description: "Bill of Materials is empty", severity: "warning" })
      }
      if (proposal.labor.length === 0) {
        items.push({ title: "Add labor", description: "Labor estimates are empty", severity: "warning" })
      }
    } else {
      if (financials.marginPercent < 25) {
        items.push({ title: "Low margin alert", description: "Margin below 25% threshold", severity: "error" })
      }
      
      const pendingSubs = proposal.subcontractors.filter(s => s.status === "pending").length
      if (pendingSubs > 0) {
        items.push({ title: `${pendingSubs} pending subcontractor selection`, severity: "warning" })
      }
      
      if (!proposal.submittedDate) {
        items.push({ title: "Proposal not yet submitted", severity: "info" })
      }
    }
    
    return items
  }, [financials, proposal, isNewProposal])
  
  const isLocked = !isNewProposal && (proposal.status === "submitted" || proposal.status === "approved")
  
  // Handle BOM item quantity change
  const handleBomQuantityChange = (itemId: number, newQty: number) => {
    setBomItems(
      bomItems.map((item) =>
        item.id === itemId
          ? { ...item, quantity: newQty, total: newQty * item.unitCost }
          : item
      )
    )
  }
  
  // Handle BOM item unit cost change
  const handleBomUnitCostChange = (itemId: number, newCost: number) => {
    setBomItems(
      bomItems.map((item) =>
        item.id === itemId
          ? { ...item, unitCost: newCost, total: item.quantity * newCost }
          : item
      )
    )
  }
  
  // Handle BOM item removal
  const handleRemoveBomItem = (itemId: number) => {
    setBomItems(bomItems.filter((item) => item.id !== itemId))
  }
  
  // Handle BOM item duplicate
  const handleDuplicateBomItem = (itemId: number) => {
    const itemToDuplicate = bomItems.find((item) => item.id === itemId)
    if (itemToDuplicate) {
      setBomItems([...bomItems, { ...itemToDuplicate, id: Date.now() }])
    }
  }
  

  
  // Calculate material cost from local BOM state
  const materialCostFromBom = useMemo(() => {
    return bomItems.reduce((sum, item) => sum + item.total, 0)
  }, [bomItems])

  return (
    <AppShell>
      <div className="flex flex-col gap-4 p-4">
        {/* Page Header */}
        <div className="flex flex-col gap-3 pb-4 border-b border-border">
          <nav className="flex items-center gap-1 text-xs text-muted-foreground">
            <a href="/" className="hover:text-foreground transition-colors">Home</a>
            <span className="mx-1">/</span>
            <a href="/opportunities" className="hover:text-foreground transition-colors">Opportunities</a>
            <span className="mx-1">/</span>
            <a href={proposal.opportunity.href} className="hover:text-foreground transition-colors text-primary">
              {proposal.opportunity.name}
            </a>
            <span className="mx-1">/</span>
            <span className="text-foreground">Proposal</span>
          </nav>
          
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-3">
                <h1 className="text-lg font-semibold text-foreground">{proposal.name}</h1>
                <StatusBadge status={proposal.status} />
                <Select value={selectedVersion} onValueChange={setSelectedVersion}>
                  <SelectTrigger className="h-6 w-[100px] text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {proposal.versions.map((v) => (
                      <SelectItem key={v.version} value={String(v.version)}>
                        v{v.version} {v.version === proposal.version && "(current)"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <a 
                  href={proposal.opportunity.href}
                  className="flex items-center gap-1 text-primary hover:underline"
                >
                  <ExternalLink className="h-3 w-3" />
                  {proposal.opportunity.name}
                </a>
                <span className="flex items-center gap-1">
                  <Building2 className="h-3 w-3" />
                  {proposal.customer.name}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {proposal.salesperson}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open in new tab
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link2 className="h-4 w-4 mr-2" />
                    Copy link
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <History className="h-4 w-4 mr-2" />
                    View full history
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete proposal
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {!isLocked && (
                <Button size="sm" variant="outline">
                  <Edit className="h-4 w-4 mr-1.5" />
                  Edit
                </Button>
              )}
              <Button size="sm" variant="outline">
                <Copy className="h-4 w-4 mr-1.5" />
                Duplicate as New Version
              </Button>
              {!isLocked && (
                <Button size="sm">
                  <Send className="h-4 w-4 mr-1.5" />
                  Submit Proposal
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Entity Header / Lifecycle Bar */}
        <EntityHeader
          entityId={entityData.entityId}
          currentStage={entityData.currentStage}
          status={proposal.status === "under-negotiation" ? "In Negotiation" : proposal.status}
          customerName={entityData.customerName}
          lifecycle={entityData.lifecycle}
          lastModifiedBy={entityData.lastModifiedBy}
          lastModifiedAt={entityData.lastModifiedAt}
        />

        {/* Top Summary Bar */}
        <div className="grid grid-cols-6 gap-3 p-3 rounded-lg border border-border bg-card">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Customer</span>
            <span className="text-sm font-medium text-foreground">{proposal.customer.name}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Salesperson</span>
            <span className="text-sm font-medium text-foreground">{proposal.salesperson}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Total Price</span>
            <span className="text-lg font-semibold text-primary">{formatCurrency(financials.finalPrice)}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Total Cost</span>
            <span className="text-lg font-semibold text-foreground">{formatCurrency(financials.totalCost)}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Margin</span>
            <span className={cn(
              "text-lg font-semibold",
              financials.marginPercent >= 30 ? "text-success" :
              financials.marginPercent >= 25 ? "text-foreground" :
              "text-warning"
            )}>
              {financials.marginPercent}%
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Valid Until</span>
            <span className="text-sm font-medium text-foreground">
              {proposal.validUntil ? formatDate(proposal.validUntil) : "Not set"}
            </span>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-12 gap-4">
          {/* Left Column - Main Content (8 cols) */}
          <div className="col-span-8 flex flex-col gap-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full justify-start border-b border-border rounded-none bg-transparent p-0 h-auto">
                <TabsTrigger 
                  value="scope" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
                >
                  <FileText className="h-3.5 w-3.5 mr-1.5" />
                  Scope
                </TabsTrigger>
                <TabsTrigger 
                  value="design" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
                >
                  <Package className="h-3.5 w-3.5 mr-1.5" />
                  System Design
                </TabsTrigger>
                <TabsTrigger 
                  value="bom" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
                >
                  <Package className="h-3.5 w-3.5 mr-1.5" />
                  Bill of Materials
                </TabsTrigger>
                <TabsTrigger 
                  value="labor" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
                >
                  <Wrench className="h-3.5 w-3.5 mr-1.5" />
                  Labor
                </TabsTrigger>
                <TabsTrigger 
                  value="subcontractors" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
                >
                  <Truck className="h-3.5 w-3.5 mr-1.5" />
                  Subcontractors
                </TabsTrigger>
              </TabsList>

              {/* Scope Tab */}
              <TabsContent value="scope" className="mt-4 space-y-4">
                <DashboardPanel title="Description" icon={FileText}>
                  <Textarea
                    defaultValue={proposal.scope.description}
                    placeholder="Enter the scope description..."
                    className="min-h-[100px] resize-none text-sm"
                    readOnly={isLocked}
                  />
                </DashboardPanel>
                
                <div className="grid grid-cols-2 gap-4">
                  <DashboardPanel title="Assumptions" icon={CheckCircle}>
                    <ul className="space-y-1.5">
                      {proposal.scope.assumptions.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-foreground">
                          <ChevronRight className="h-3 w-3 text-primary mt-0.5 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    {!isLocked && (
                      <Button size="sm" variant="ghost" className="mt-2 h-7 text-xs">
                        <Plus className="h-3 w-3 mr-1" />
                        Add assumption
                      </Button>
                    )}
                  </DashboardPanel>
                  
                  <DashboardPanel title="Constraints" icon={AlertTriangle}>
                    <ul className="space-y-1.5">
                      {proposal.scope.constraints.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-foreground">
                          <ChevronRight className="h-3 w-3 text-warning mt-0.5 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    {!isLocked && (
                      <Button size="sm" variant="ghost" className="mt-2 h-7 text-xs">
                        <Plus className="h-3 w-3 mr-1" />
                        Add constraint
                      </Button>
                    )}
                  </DashboardPanel>
                </div>
                
                <DashboardPanel title="Deliverables" icon={CheckCircle}>
                  <ul className="space-y-1.5">
                    {proposal.scope.deliverables.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-foreground">
                        <span className="h-4 w-4 rounded-full bg-primary/10 text-primary text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  {!isLocked && (
                    <Button size="sm" variant="ghost" className="mt-2 h-7 text-xs">
                      <Plus className="h-3 w-3 mr-1" />
                      Add deliverable
                    </Button>
                  )}
                </DashboardPanel>
              </TabsContent>

              {/* System Design Tab */}
              <TabsContent value="design" className="mt-4 space-y-4">
                <DashboardPanel title="System Overview" icon={Package}>
                  <Textarea
                    defaultValue={proposal.systemDesign.description}
                    placeholder="Enter the system design overview..."
                    className="min-h-[80px] resize-none text-sm"
                    readOnly={isLocked}
                  />
                </DashboardPanel>
                
                <DashboardPanel title="Components" icon={Package}>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">Component</TableHead>
                        <TableHead className="text-xs text-right w-[80px]">Qty</TableHead>
                        <TableHead className="text-xs w-[120px]">Unit Type</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {proposal.systemDesign.components.map((comp, i) => (
                        <TableRow key={i}>
                          <TableCell className="text-xs">{comp.name}</TableCell>
                          <TableCell className="text-xs text-right font-medium">{comp.quantity}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">{comp.unitType}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </DashboardPanel>
                
                <DashboardPanel title="Attachments" icon={Paperclip}>
                  <div className="space-y-1.5">
                    {proposal.systemDesign.attachments.map((file, i) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded hover:bg-accent/50 group cursor-pointer">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs text-foreground">{file.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{file.size}</span>
                          <span>{file.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {!isLocked && (
                    <Button size="sm" variant="outline" className="mt-2 h-7 text-xs">
                      <Upload className="h-3 w-3 mr-1" />
                      Upload file
                    </Button>
                  )}
                </DashboardPanel>
              </TabsContent>

              {/* Bill of Materials Tab */}
              <TabsContent value="bom" className="mt-4">
                <DashboardPanel 
                  title="Bill of Materials" 
                  icon={Package}
                  action={!isLocked ? { label: "Add item", onClick: () => setAddItemDrawerOpen(true) } : undefined}
                >
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs w-[32px]"></TableHead>
                        <TableHead className="text-xs">Item Description</TableHead>
                        <TableHead className="text-xs w-[100px]">Category</TableHead>
                        <TableHead className="text-xs text-right w-[70px]">Qty</TableHead>
                        <TableHead className="text-xs text-right w-[100px]">Unit Cost</TableHead>
                        <TableHead className="text-xs text-right w-[100px]">Total</TableHead>
                        {!isLocked && <TableHead className="w-[60px]"></TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bomItems.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={isLocked ? 6 : 7} className="text-center py-8 text-muted-foreground text-xs">
                            No materials added yet. Click "+ Add item" to start building your bill of materials.
                          </TableCell>
                        </TableRow>
                      ) : (
                        bomItems.map((item) => (
                          <TableRow key={item.id} className="group">
                            <TableCell className="py-2">
                              <span 
                                className={cn(
                                  "inline-flex items-center justify-center h-5 w-5 rounded",
                                  item.source === "catalog" 
                                    ? "bg-primary/10 text-primary" 
                                    : "bg-muted text-muted-foreground"
                                )}
                                title={item.source === "catalog" ? `Catalog: ${item.sku}` : "Custom item"}
                              >
                                {item.source === "catalog" ? (
                                  <Database className="h-3 w-3" />
                                ) : (
                                  <PenLine className="h-3 w-3" />
                                )}
                              </span>
                            </TableCell>
                            <TableCell className="text-xs py-2">
                              <div>
                                <span className="font-medium">{item.item}</span>
                                {item.sku && (
                                  <span className="text-[10px] text-muted-foreground ml-2">
                                    {item.sku}
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground py-2">{item.category}</TableCell>
                            <TableCell className="text-xs text-right py-2">
                              {!isLocked ? (
                                <EditableCell
                                  value={item.quantity}
                                  onChange={(val) => handleBomQuantityChange(item.id, Number(val))}
                                  type="number"
                                  className="w-14 text-right"
                                />
                              ) : (
                                item.quantity
                              )}
                            </TableCell>
                            <TableCell className="text-xs text-right py-2">
                              {!isLocked ? (
                                <EditableCell
                                  value={item.unitCost}
                                  onChange={(val) => handleBomUnitCostChange(item.id, Number(val))}
                                  type="currency"
                                  className="w-20 text-right"
                                />
                              ) : (
                                formatCurrency(item.unitCost)
                              )}
                            </TableCell>
                            <TableCell className="text-xs text-right font-medium py-2">
                              {formatCurrency(item.total)}
                            </TableCell>
                            {!isLocked && (
                              <TableCell className="py-2">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button 
                                      size="sm" 
                                      variant="ghost" 
                                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      <MoreHorizontal className="h-3 w-3" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    {item.source === "catalog" && (
                                      <DropdownMenuItem>
                                        <ExternalLink className="h-3.5 w-3.5 mr-2" />
                                        View catalog item
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem onClick={() => handleDuplicateBomItem(item.id)}>
                                      <Copy className="h-3.5 w-3.5 mr-2" />
                                      Duplicate
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem 
                                      onClick={() => handleRemoveBomItem(item.id)}
                                      className="text-destructive"
                                    >
                                      <Trash2 className="h-3.5 w-3.5 mr-2" />
                                      Remove
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            )}
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-border">
                    <div className="text-xs text-muted-foreground">
                      {bomItems.length} item{bomItems.length !== 1 ? "s" : ""}
                      <span className="mx-2">•</span>
                      {bomItems.filter(i => i.source === "catalog").length} from catalog
                      <span className="mx-2">•</span>
                      {bomItems.filter(i => i.source === "custom").length} custom
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-muted-foreground mr-4">Material Total:</span>
                      <span className="text-sm font-semibold">{formatCurrency(materialCostFromBom)}</span>
                    </div>
                  </div>
                </DashboardPanel>
              </TabsContent>

              {/* Labor Tab */}
              <TabsContent value="labor" className="mt-4">
                <DashboardPanel 
                  title="Labor Estimate" 
                  icon={Wrench}
                  action={!isLocked ? { label: "Add task", onClick: () => {} } : undefined}
                >
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">Task</TableHead>
                        <TableHead className="text-xs w-[80px]">Role</TableHead>
                        <TableHead className="text-xs text-right w-[60px]">Hours</TableHead>
                        <TableHead className="text-xs text-right w-[80px]">Rate</TableHead>
                        <TableHead className="text-xs text-right w-[100px]">Total</TableHead>
                        {!isLocked && <TableHead className="w-[40px]"></TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {proposal.labor.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={isLocked ? 5 : 6} className="text-center py-8 text-muted-foreground text-xs">
                            No labor tasks added yet. Click "Add task" to estimate labor hours.
                          </TableCell>
                        </TableRow>
                      ) : (
                        proposal.labor.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="text-xs font-medium">{item.task}</TableCell>
                            <TableCell className="text-xs text-muted-foreground">{item.role}</TableCell>
                            <TableCell className="text-xs text-right">{item.hours}</TableCell>
                            <TableCell className="text-xs text-right">{formatCurrency(item.rate)}/hr</TableCell>
                            <TableCell className="text-xs text-right font-medium">{formatCurrency(item.total)}</TableCell>
                            {!isLocked && (
                              <TableCell>
                                <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                  <Trash2 className="h-3 w-3 text-muted-foreground" />
                                </Button>
                              </TableCell>
                            )}
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                  <div className="flex justify-end mt-3 pt-3 border-t border-border">
                    <div className="text-right">
                      <span className="text-xs text-muted-foreground mr-4">Labor Total:</span>
                      <span className="text-sm font-semibold">{formatCurrency(financials.laborCost)}</span>
                    </div>
                  </div>
                </DashboardPanel>
              </TabsContent>

              {/* Subcontractors Tab */}
              <TabsContent value="subcontractors" className="mt-4">
                <DashboardPanel 
                  title="Subcontractor Quotes" 
                  icon={Truck}
                  action={!isLocked ? { label: "Add quote", onClick: () => {} } : undefined}
                >
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">Scope of Work</TableHead>
                        <TableHead className="text-xs w-[150px]">Vendor</TableHead>
                        <TableHead className="text-xs text-right w-[100px]">Quote</TableHead>
                        <TableHead className="text-xs w-[100px]">Status</TableHead>
                        {!isLocked && <TableHead className="w-[40px]"></TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {proposal.subcontractors.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={isLocked ? 4 : 5} className="text-center py-8 text-muted-foreground text-xs">
                            No subcontractor quotes added yet. Click "Add quote" to request quotes.
                          </TableCell>
                        </TableRow>
                      ) : (
                        proposal.subcontractors.map((item) => (
                          <TableRow key={item.id} className={item.status === "rejected" ? "opacity-50" : ""}>
                            <TableCell className="text-xs font-medium">{item.scope}</TableCell>
                            <TableCell className="text-xs">{item.vendor}</TableCell>
                            <TableCell className="text-xs text-right font-medium">{formatCurrency(item.quote)}</TableCell>
                            <TableCell>
                              <span className={cn(
                                "text-[10px] px-1.5 py-0.5 rounded font-medium",
                                item.status === "selected" ? "bg-success/15 text-success" :
                                item.status === "pending" ? "bg-warning/15 text-warning" :
                                "bg-muted text-muted-foreground"
                              )}>
                                {item.status}
                              </span>
                            </TableCell>
                            {!isLocked && (
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                      <MoreHorizontal className="h-3 w-3" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                      <CheckCircle className="h-3.5 w-3.5 mr-2" />
                                      Select
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <XCircle className="h-3.5 w-3.5 mr-2" />
                                      Reject
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-destructive">
                                      <Trash2 className="h-3.5 w-3.5 mr-2" />
                                      Remove
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            )}
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                  <div className="flex justify-end mt-3 pt-3 border-t border-border">
                    <div className="text-right">
                      <span className="text-xs text-muted-foreground mr-4">Selected Total:</span>
                      <span className="text-sm font-semibold">{formatCurrency(financials.subcontractorCost)}</span>
                    </div>
                  </div>
                </DashboardPanel>
              </TabsContent>
            </Tabs>
            
            {/* Activity & Version History */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <DashboardPanel title="Activity" icon={Clock}>
                <div className="space-y-1">
                  {proposal.activity.map((item, index) => (
                    <ActivityItem
                      key={index}
                      icon={item.icon}
                      title={item.title}
                      description={item.description}
                      time={item.time}
                    />
                  ))}
                </div>
              </DashboardPanel>
              
              <DashboardPanel title="Version History" icon={History}>
                <div className="space-y-2">
                  {proposal.versions.map((v) => (
                    <div 
                      key={v.version}
                      className={cn(
                        "flex items-start gap-3 p-2 rounded border transition-colors cursor-pointer",
                        v.version === proposal.version 
                          ? "border-primary/30 bg-primary/5" 
                          : "border-border hover:bg-accent/50"
                      )}
                    >
                      <div className={cn(
                        "h-6 w-6 rounded-full flex items-center justify-center text-xs font-medium shrink-0",
                        v.version === proposal.version ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      )}>
                        v{v.version}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium">{v.author}</span>
                          <StatusBadge status={v.status as StatusType} />
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{v.notes}</p>
                        <span className="text-[10px] text-muted-foreground">{formatDate(v.createdDate)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </DashboardPanel>
            </div>
          </div>

          {/* Right Column - Sidebar (4 cols) */}
          <div className="col-span-4 flex flex-col gap-4">
            {/* Financial Summary */}
            <DashboardPanel title="Financial Summary" icon={DollarSign}>
              <div className="space-y-3">
                <MetricRow label="Material Cost" value={formatCurrency(financials.materialCost)} />
                <MetricRow label="Labor Cost" value={formatCurrency(financials.laborCost)} />
                <MetricRow label="Subcontractor Cost" value={formatCurrency(financials.subcontractorCost)} />
                <div className="border-t border-border pt-2">
                  <MetricRow 
                    label="Total Cost" 
                    value={formatCurrency(financials.totalCost)} 
                    className="font-semibold"
                  />
                </div>
              </div>
            </DashboardPanel>
            
            {/* Pricing Panel */}
            <DashboardPanel title="Pricing" icon={Calculator}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Markup / Margin</span>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={markupPercent}
                      onChange={(e) => setMarkupPercent(Number(e.target.value))}
                      className="h-7 w-16 text-xs text-right"
                      disabled={isLocked}
                    />
                    <span className="text-xs text-muted-foreground">%</span>
                  </div>
                </div>
                <MetricRow label="Margin Amount" value={formatCurrency(financials.margin)} />
                <div className="border-t border-border pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">Final Price</span>
                    <span className="text-lg font-bold text-primary">{formatCurrency(financials.finalPrice)}</span>
                  </div>
                </div>
              </div>
            </DashboardPanel>
            
            {/* Alerts Panel */}
            {alerts.length > 0 && (
              <DashboardPanel title="Alerts" icon={AlertTriangle}>
                <div className="space-y-2">
                  {alerts.map((alert, i) => (
                    <AlertItem key={i} {...alert} />
                  ))}
                </div>
              </DashboardPanel>
            )}
            
            {/* Quick Stats */}
            <DashboardPanel title="Quick Stats" icon={TrendingUp}>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-0.5 p-2 rounded bg-muted/50">
                  <span className="text-[10px] text-muted-foreground">BOM Items</span>
                  <span className="text-sm font-semibold">{proposal.billOfMaterials.length}</span>
                </div>
                <div className="flex flex-col gap-0.5 p-2 rounded bg-muted/50">
                  <span className="text-[10px] text-muted-foreground">Labor Hours</span>
                  <span className="text-sm font-semibold">
                    {proposal.labor.reduce((sum, l) => sum + l.hours, 0)}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5 p-2 rounded bg-muted/50">
                  <span className="text-[10px] text-muted-foreground">Subcontractors</span>
                  <span className="text-sm font-semibold">
                    {proposal.subcontractors.filter(s => s.status === "selected").length}/{proposal.subcontractors.length}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5 p-2 rounded bg-muted/50">
                  <span className="text-[10px] text-muted-foreground">Attachments</span>
                  <span className="text-sm font-semibold">{proposal.systemDesign.attachments.length}</span>
                </div>
              </div>
            </DashboardPanel>
            
            {/* Quick Actions */}
            <DashboardPanel title="Quick Actions">
              <div className="grid grid-cols-2 gap-2">
                <Button size="sm" variant="outline" className="h-8 text-xs justify-start">
                  <FileText className="h-3.5 w-3.5 mr-1.5" />
                  Export PDF
                </Button>
                <Button size="sm" variant="outline" className="h-8 text-xs justify-start">
                  <Send className="h-3.5 w-3.5 mr-1.5" />
                  Email Client
                </Button>
                <Button size="sm" variant="outline" className="h-8 text-xs justify-start">
                  <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
                  Add Note
                </Button>
                <Button size="sm" variant="outline" className="h-8 text-xs justify-start">
                  <Calendar className="h-3.5 w-3.5 mr-1.5" />
                  Schedule Call
                </Button>
              </div>
            </DashboardPanel>
          </div>
        </div>
      </div>
      
      {/* Add Items to BOM Drawer */}
      <BomDrawer
        open={addItemDrawerOpen}
        onClose={() => setAddItemDrawerOpen(false)}
        onAddItems={(items) => {
          const newItems = items.map((item) => ({
            ...item,
            id: Date.now() + Math.random(),
          }))
          setBomItems((prev) => [...prev, ...newItems])
          setAddItemDrawerOpen(false)
        }}
        existingItemIds={bomItems.filter((i) => i.catalogId).map((i) => i.catalogId!)}
      />
    </AppShell>
  )
}
