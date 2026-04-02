"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Edit,
  Users,
  Calendar,
  Building2,
  FileText,
  MessageSquare,
  Upload,
  Clock,
  AlertTriangle,
  ExternalLink,
  MoreHorizontal,
  Link2,
  UserPlus,
  Send,
  CheckCircle,
  XCircle,
  Plus,
  Mail,
  Phone,
  MapPin,
  Tag,
  ChevronRight,
  Paperclip,
  History,
} from "lucide-react"
import {
  AppShell,
  StatusBadge,
  StatusType,
  DashboardPanel,
  MetricRow,
  ActivityItem,
  DocumentItem,
  EntityHeader,
  LifecycleStage,
  LifecycleState,
} from "@/components/erp"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useNavigationStore } from "@/lib/stores/navigation-store"
import { cn } from "@/lib/utils"

// Mock opportunity data for the detail view
const opportunityData = {
  entityId: "ENT-2026-0058",
  name: "Corporate HQ Security Overhaul",
  scope: "Full CCTV + Access Control + Intrusion Detection for 3-building campus",
  status: "assigned" as StatusType,
  owner: "John Smith",
  ownerEmail: "john.smith@stellaris.io",
  createdDate: "2026-03-15",
  lastUpdated: "2026-03-28",
  estimatedValue: 285000,
  confidence: 75,
  requestType: "New Installation",
  priority: "High",
  source: "Customer Request",
  
  // Customer & Contact Info
  customer: {
    name: "TechCorp Industries",
    type: "Enterprise",
    industry: "Technology",
    address: "500 Innovation Drive, Silicon Valley, CA 94025",
    accountManager: "Sarah Chen",
  },
  contacts: [
    { name: "Michael Chen", role: "VP Facilities", email: "m.chen@techcorp.com", phone: "+1 (555) 234-5678", isPrimary: true },
    { name: "Lisa Park", role: "Security Director", email: "l.park@techcorp.com", phone: "+1 (555) 234-5679", isPrimary: false },
    { name: "David Kim", role: "IT Manager", email: "d.kim@techcorp.com", phone: "+1 (555) 234-5680", isPrimary: false },
  ],

  // Classification
  classification: {
    segment: "Enterprise",
    region: "West Coast",
    vertical: "Technology",
    dealSize: "Large ($250K+)",
    complexity: "High",
  },

  // Request/Source Details
  request: {
    sourceId: "REQ-2026-0058",
    receivedDate: "2026-03-10",
    channel: "Direct Inquiry",
    description: "Complete security infrastructure upgrade for new corporate campus expansion. Client requires integrated solution with existing Honeywell systems.",
    requirements: [
      "200+ camera installation across 3 buildings",
      "Biometric access control for all entry points",
      "Integration with existing Honeywell alarm system",
      "24/7 monitoring capability",
      "Mobile app access for security team",
    ],
  },

  // Ownership & Routing
  routing: {
    assignedDate: "2026-03-18",
    assignedBy: "Mary Johnson",
    salesRep: "John Smith",
    technicalLead: "Charles Wilson",
    teamNotes: "High-value opportunity. Technical pre-sales support requested.",
  },

  // Key Dates
  dates: {
    targetProposal: "2026-04-15",
    expectedDecision: "2026-05-01",
    targetProjectStart: "2026-06-01",
    followUpDate: "2026-04-01",
  },

  // Blockers / Missing Info
  blockers: [
    { id: 1, title: "Site survey not yet scheduled", severity: "high", resolved: false },
    { id: 2, title: "Budget confirmation pending from client", severity: "medium", resolved: false },
    { id: 3, title: "Technical requirements document received", severity: "low", resolved: true },
  ],

  // Related Records
  proposals: [
    { id: "PROP-2026-0058-A", name: "Initial Proposal - Phase 1", status: "draft", value: 145000, createdDate: "2026-03-25" },
  ],

  // Attachments
  attachments: [
    { name: "TechCorp_RFQ_2026.pdf", type: "pdf", size: "2.4 MB", date: "Mar 15" },
    { name: "Campus_Floor_Plans.pdf", type: "pdf", size: "8.1 MB", date: "Mar 18" },
    { name: "Current_System_Inventory.xlsx", type: "xls", size: "156 KB", date: "Mar 20" },
    { name: "Site_Photos.zip", type: "img", size: "45.2 MB", date: "Mar 22" },
  ],

  // Notes
  notes: [
    { id: 1, author: "John Smith", date: "Mar 28, 2026 10:32 AM", content: "Spoke with Michael Chen. They want to fast-track Phase 1 if possible. May need to split proposal into phases." },
    { id: 2, author: "Charles Wilson", date: "Mar 25, 2026 2:15 PM", content: "Reviewed floor plans. Integration with Honeywell system is feasible but will require additional middleware. Adding 15% contingency to technical estimate." },
    { id: 3, author: "Mary Johnson", date: "Mar 18, 2026 9:00 AM", content: "Assigned to John Smith based on enterprise account experience. High priority - client has existing relationship with competitor." },
  ],

  // Activity Log
  activity: [
    { icon: MessageSquare, title: "Note added", description: "John Smith added a note", time: "2h ago" },
    { icon: FileText, title: "Proposal draft created", description: "Initial Proposal - Phase 1", time: "3d ago" },
    { icon: Upload, title: "Attachment added", description: "Site_Photos.zip uploaded", time: "6d ago" },
    { icon: UserPlus, title: "Owner assigned", description: "Assigned to John Smith", time: "10d ago" },
    { icon: CheckCircle, title: "Status changed", description: "Changed to Evaluated", time: "12d ago" },
    { icon: Plus, title: "Opportunity created", description: "From request REQ-2026-0058", time: "13d ago" },
  ],
}

// Entity/Lifecycle data
const entityData = {
  entityId: "ENT-2026-0058",
  currentStage: "opportunity" as LifecycleStage,
  customerName: "TechCorp Industries",
  programName: null,
  programHref: null,
  lastModifiedBy: "John Smith",
  lastModifiedAt: "Mar 28, 2026 at 10:32 AM",
  lifecycle: [
    {
      stage: "request" as LifecycleStage,
      completedAt: "Mar 15, 2026",
      completedBy: "System",
      referenceId: "REQ-2026-0058",
      href: "/requests/REQ-2026-0058",
    },
    {
      stage: "opportunity" as LifecycleStage,
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

// Field display component
function FieldRow({ label, value, className }: { label: string; value: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-start py-1.5", className)}>
      <span className="text-xs text-muted-foreground w-32 shrink-0">{label}</span>
      <span className="text-sm text-foreground">{value}</span>
    </div>
  )
}

// Blocker item component
function BlockerItem({ title, severity, resolved }: { title: string; severity: string; resolved: boolean }) {
  const severityColors = {
    high: "bg-destructive/15 text-destructive border-destructive/30",
    medium: "bg-warning/15 text-warning border-warning/30",
    low: "bg-muted text-muted-foreground border-border",
  }
  
  return (
    <div className={cn(
      "flex items-center gap-2 px-2 py-1.5 rounded border text-xs",
      resolved ? "bg-muted/50 text-muted-foreground border-border line-through opacity-60" : severityColors[severity as keyof typeof severityColors]
    )}>
      {resolved ? (
        <CheckCircle className="h-3 w-3" />
      ) : (
        <AlertTriangle className="h-3 w-3" />
      )}
      <span className="flex-1">{title}</span>
      {!resolved && (
        <span className="text-[10px] uppercase font-medium">{severity}</span>
      )}
    </div>
  )
}

// Contact card component
function ContactCard({ contact, isPrimary }: { contact: typeof opportunityData.contacts[0]; isPrimary: boolean }) {
  return (
    <div className={cn(
      "flex flex-col gap-1.5 p-2.5 rounded-lg border",
      isPrimary ? "border-primary/30 bg-primary/5" : "border-border bg-card"
    )}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">{contact.name}</span>
        {isPrimary && (
          <span className="text-[9px] uppercase font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded">Primary</span>
        )}
      </div>
      <span className="text-xs text-muted-foreground">{contact.role}</span>
      <div className="flex items-center gap-3 pt-1">
        <a href={`mailto:${contact.email}`} className="flex items-center gap-1 text-xs text-primary hover:underline">
          <Mail className="h-3 w-3" />
          Email
        </a>
        <a href={`tel:${contact.phone}`} className="flex items-center gap-1 text-xs text-primary hover:underline">
          <Phone className="h-3 w-3" />
          Call
        </a>
      </div>
    </div>
  )
}

// Note component
function NoteItem({ note }: { note: typeof opportunityData.notes[0] }) {
  return (
    <div className="flex flex-col gap-1 py-2.5 border-b border-border last:border-0">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-foreground">{note.author}</span>
        <span className="text-[10px] text-muted-foreground">{note.date}</span>
      </div>
      <p className="text-sm text-foreground/90 leading-relaxed">{note.content}</p>
    </div>
  )
}

export default function OpportunityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const opportunity = opportunityData // In real app, fetch by id
  const setActiveModule = useNavigationStore((state) => state.setActiveModule)
  const [activeTab, setActiveTab] = useState("overview")
  const [isStartingProposal, setIsStartingProposal] = useState(false)

  useEffect(() => {
    setActiveModule("opportunities")
  }, [setActiveModule])

  const unresolvedBlockers = opportunity.blockers.filter(b => !b.resolved).length

  // Handle starting a proposal from this opportunity
  const handleStartProposal = async () => {
    setIsStartingProposal(true)
    // Simulate API call to create the proposal record
    await new Promise((resolve) => setTimeout(resolve, 800))
    // Navigate to proposal detail page with new flag for editable state
    router.push(`/proposals/${opportunity.entityId}?new=true`)
  }

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
            <span className="text-foreground">{opportunity.entityId}</span>
          </nav>
          
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-3">
                <h1 className="text-lg font-semibold text-foreground">{opportunity.name}</h1>
                <StatusBadge status={opportunity.status} />
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {opportunity.owner || "Unassigned"}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Created {formatDate(opportunity.createdDate)}
                </span>
                <span className="flex items-center gap-1">
                  <Building2 className="h-3 w-3" />
                  {opportunity.customer.name}
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
                    View history
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    <XCircle className="h-4 w-4 mr-2" />
                    Mark as Lost
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button size="sm" variant="outline">
                <UserPlus className="h-4 w-4 mr-1.5" />
                Assign
              </Button>
              <Button size="sm" variant="outline">
                <Edit className="h-4 w-4 mr-1.5" />
                Edit
              </Button>
              <Button size="sm" onClick={handleStartProposal} disabled={isStartingProposal}>
                <Send className="h-4 w-4 mr-1.5" />
                {isStartingProposal ? "Starting..." : "Start Proposal"}
              </Button>
            </div>
          </div>
        </div>

        {/* Entity Header / Lifecycle Bar */}
        <EntityHeader
          entityId={entityData.entityId}
          currentStage={entityData.currentStage}
          status="Active"
          customerName={entityData.customerName}
          lifecycle={entityData.lifecycle}
          lastModifiedBy={entityData.lastModifiedBy}
          lastModifiedAt={entityData.lastModifiedAt}
        />

        {/* Summary Bar */}
        <div className="grid grid-cols-6 gap-3 p-3 rounded-lg border border-border bg-card">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Estimated Value</span>
            <span className="text-lg font-semibold text-foreground">{formatCurrency(opportunity.estimatedValue)}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Confidence</span>
            <span className="text-lg font-semibold text-primary">{opportunity.confidence}%</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Request Type</span>
            <span className="text-sm font-medium text-foreground">{opportunity.requestType}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Priority</span>
            <span className="text-sm font-medium text-warning">{opportunity.priority}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Target Proposal</span>
            <span className="text-sm font-medium text-foreground">{formatDate(opportunity.dates.targetProposal)}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Blockers</span>
            {unresolvedBlockers > 0 ? (
              <span className="text-lg font-semibold text-destructive">{unresolvedBlockers}</span>
            ) : (
              <span className="text-sm font-medium text-success">None</span>
            )}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-12 gap-4">
          {/* Left Column - Main Content (8 cols) */}
          <div className="col-span-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full justify-start border-b border-border rounded-none bg-transparent p-0 h-auto">
                <TabsTrigger 
                  value="overview" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="request" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
                >
                  Request/Source
                </TabsTrigger>
                <TabsTrigger 
                  value="customer" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
                >
                  Customer & Contacts
                </TabsTrigger>
                <TabsTrigger 
                  value="notes" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
                >
                  Notes ({opportunity.notes.length})
                </TabsTrigger>
                <TabsTrigger 
                  value="attachments" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
                >
                  Attachments ({opportunity.attachments.length})
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Scope Summary */}
                  <DashboardPanel title="Scope Summary" icon={FileText}>
                    <div className="space-y-3">
                      <p className="text-sm text-foreground leading-relaxed">{opportunity.scope}</p>
                      <div className="border-t border-border pt-3">
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Key Requirements</span>
                        <ul className="mt-2 space-y-1">
                          {opportunity.request.requirements.slice(0, 4).map((req, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-foreground">
                              <ChevronRight className="h-3 w-3 text-primary mt-0.5 shrink-0" />
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </DashboardPanel>

                  {/* Classification */}
                  <DashboardPanel title="Classification" icon={Tag}>
                    <div className="space-y-0">
                      <FieldRow label="Segment" value={opportunity.classification.segment} />
                      <FieldRow label="Region" value={opportunity.classification.region} />
                      <FieldRow label="Vertical" value={opportunity.classification.vertical} />
                      <FieldRow label="Deal Size" value={opportunity.classification.dealSize} />
                      <FieldRow label="Complexity" value={opportunity.classification.complexity} />
                    </div>
                  </DashboardPanel>
                </div>

                {/* Ownership & Routing */}
                <DashboardPanel title="Ownership & Routing" icon={Users}>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-0">
                      <FieldRow label="Sales Rep" value={opportunity.routing.salesRep} />
                      <FieldRow label="Technical Lead" value={opportunity.routing.technicalLead} />
                    </div>
                    <div className="space-y-0">
                      <FieldRow label="Assigned Date" value={formatDate(opportunity.routing.assignedDate)} />
                      <FieldRow label="Assigned By" value={opportunity.routing.assignedBy} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-muted-foreground">Team Notes</span>
                      <p className="text-sm text-foreground">{opportunity.routing.teamNotes}</p>
                    </div>
                  </div>
                </DashboardPanel>

                {/* Blockers */}
                {opportunity.blockers.length > 0 && (
                  <DashboardPanel 
                    title="Blockers & Missing Info" 
                    icon={AlertTriangle}
                    action={{ label: "Add blocker", onClick: () => console.log("Add blocker") }}
                  >
                    <div className="space-y-2">
                      {opportunity.blockers.map((blocker) => (
                        <BlockerItem 
                          key={blocker.id} 
                          title={blocker.title} 
                          severity={blocker.severity} 
                          resolved={blocker.resolved} 
                        />
                      ))}
                    </div>
                  </DashboardPanel>
                )}
              </TabsContent>

              {/* Request/Source Tab */}
              <TabsContent value="request" className="mt-4 space-y-4">
                <DashboardPanel title="Original Request" icon={FileText}>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <FieldRow label="Source ID" value={
                        <a href={`/requests/${opportunity.request.sourceId}`} className="text-primary hover:underline font-mono text-xs">
                          {opportunity.request.sourceId}
                        </a>
                      } />
                      <FieldRow label="Received Date" value={formatDate(opportunity.request.receivedDate)} />
                      <FieldRow label="Channel" value={opportunity.request.channel} />
                    </div>
                    <div className="border-t border-border pt-3">
                      <span className="text-xs text-muted-foreground">Description</span>
                      <p className="mt-1 text-sm text-foreground leading-relaxed">{opportunity.request.description}</p>
                    </div>
                    <div className="border-t border-border pt-3">
                      <span className="text-xs text-muted-foreground">Requirements</span>
                      <ul className="mt-2 space-y-1.5">
                        {opportunity.request.requirements.map((req, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                            <CheckCircle className="h-3.5 w-3.5 text-success mt-0.5 shrink-0" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </DashboardPanel>
              </TabsContent>

              {/* Customer & Contacts Tab */}
              <TabsContent value="customer" className="mt-4 space-y-4">
                <DashboardPanel title="Customer Information" icon={Building2}>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-0">
                      <FieldRow label="Company" value={opportunity.customer.name} />
                      <FieldRow label="Type" value={opportunity.customer.type} />
                      <FieldRow label="Industry" value={opportunity.customer.industry} />
                    </div>
                    <div className="space-y-0">
                      <FieldRow label="Account Manager" value={opportunity.customer.accountManager} />
                      <FieldRow label="Address" value={
                        <span className="flex items-start gap-1">
                          <MapPin className="h-3 w-3 mt-0.5 text-muted-foreground shrink-0" />
                          {opportunity.customer.address}
                        </span>
                      } />
                    </div>
                  </div>
                </DashboardPanel>

                <DashboardPanel 
                  title="Contacts" 
                  icon={Users}
                  action={{ label: "Add contact", onClick: () => console.log("Add contact") }}
                >
                  <div className="grid grid-cols-3 gap-3">
                    {opportunity.contacts.map((contact, i) => (
                      <ContactCard key={i} contact={contact} isPrimary={contact.isPrimary} />
                    ))}
                  </div>
                </DashboardPanel>
              </TabsContent>

              {/* Notes Tab */}
              <TabsContent value="notes" className="mt-4">
                <DashboardPanel 
                  title="Notes" 
                  icon={MessageSquare}
                  action={{ label: "Add note", onClick: () => console.log("Add note") }}
                >
                  <div className="space-y-0">
                    {opportunity.notes.map((note) => (
                      <NoteItem key={note.id} note={note} />
                    ))}
                  </div>
                </DashboardPanel>
              </TabsContent>

              {/* Attachments Tab */}
              <TabsContent value="attachments" className="mt-4">
                <DashboardPanel 
                  title="Attachments" 
                  icon={Paperclip}
                  action={{ label: "Upload", onClick: () => console.log("Upload") }}
                >
                  <div className="space-y-1">
                    {opportunity.attachments.map((doc, i) => (
                      <DocumentItem 
                        key={i} 
                        name={doc.name} 
                        type={doc.type} 
                        date={doc.date}
                        onClick={() => console.log("Open document")}
                      />
                    ))}
                  </div>
                </DashboardPanel>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Side Panels (4 cols) */}
          <div className="col-span-4 space-y-4">
            {/* Key Dates */}
            <DashboardPanel title="Key Dates" icon={Calendar}>
              <div className="space-y-0">
                <MetricRow label="Target Proposal" value={formatDate(opportunity.dates.targetProposal)} />
                <MetricRow label="Expected Decision" value={formatDate(opportunity.dates.expectedDecision)} />
                <MetricRow label="Target Project Start" value={formatDate(opportunity.dates.targetProjectStart)} />
                <div className="border-t border-border mt-2 pt-2">
                  <MetricRow 
                    label="Follow-up Date" 
                    value={formatDate(opportunity.dates.followUpDate)} 
                    variant="warning"
                  />
                </div>
              </div>
            </DashboardPanel>

            {/* Related Proposals */}
            <DashboardPanel 
              title="Related Proposals" 
              icon={FileText}
              action={{ label: "View all", onClick: () => console.log("View proposals") }}
            >
              {opportunity.proposals.length > 0 ? (
                <div className="space-y-2">
                  {opportunity.proposals.map((proposal) => (
                    <a 
                      key={proposal.id}
                      href={`/proposals/${proposal.id}`}
                      className="flex flex-col gap-1 p-2 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs text-primary">{proposal.id}</span>
                        <StatusBadge status={proposal.status as StatusType} />
                      </div>
                      <span className="text-sm text-foreground">{proposal.name}</span>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{formatCurrency(proposal.value)}</span>
                        <span>{proposal.createdDate}</span>
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-xs text-muted-foreground mb-2">No proposals yet</p>
                  <Button size="sm" variant="outline">
                    <Plus className="h-3 w-3 mr-1" />
                    Create Proposal
                  </Button>
                </div>
              )}
            </DashboardPanel>

            {/* Quick Actions */}
            <DashboardPanel title="Quick Actions" icon={ChevronRight}>
              <div className="grid grid-cols-2 gap-2">
                <Button size="sm" variant="outline" className="justify-start text-xs h-8">
                  <MessageSquare className="h-3 w-3 mr-1.5" />
                  Add Note
                </Button>
                <Button size="sm" variant="outline" className="justify-start text-xs h-8">
                  <Upload className="h-3 w-3 mr-1.5" />
                  Attach File
                </Button>
                <Button size="sm" variant="outline" className="justify-start text-xs h-8">
                  <UserPlus className="h-3 w-3 mr-1.5" />
                  Assign Owner
                </Button>
                <Button size="sm" variant="outline" className="justify-start text-xs h-8">
                  <Calendar className="h-3 w-3 mr-1.5" />
                  Set Follow-up
                </Button>
                <Button size="sm" variant="outline" className="justify-start text-xs h-8">
                  <CheckCircle className="h-3 w-3 mr-1.5 text-success" />
                  Mark as Won
                </Button>
                <Button size="sm" variant="outline" className="justify-start text-xs h-8">
                  <XCircle className="h-3 w-3 mr-1.5 text-destructive" />
                  Mark as Lost
                </Button>
              </div>
            </DashboardPanel>

            {/* Activity Feed */}
            <DashboardPanel 
              title="Activity" 
              icon={Clock}
              action={{ label: "View all", onClick: () => console.log("View activity") }}
            >
              <div className="space-y-0">
                {opportunity.activity.map((item, i) => (
                  <ActivityItem
                    key={i}
                    icon={item.icon}
                    title={item.title}
                    description={item.description}
                    time={item.time}
                  />
                ))}
              </div>
            </DashboardPanel>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
