"use client"

import { use, useEffect, useState } from "react"
import {
  Edit,
  DollarSign,
  CheckSquare,
  Package,
  AlertTriangle,
  Clock,
  FileText,
  Users,
  MapPin,
  Calendar,
  TrendingUp,
  ExternalLink,
  MoreHorizontal,
  MessageSquare,
  Upload,
  Link2,
  Camera,
  Wrench,
  AlertCircle,
  History,
  Plus,
  ChevronRight,
  Paperclip,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  Truck,
  Flag,
  Building2,
} from "lucide-react"
import {
  AppShell,
  StatusBadge,
  StatusType,
  DashboardPanel,
  MetricRow,
  ProgressBar,
  ActivityItem,
  DocumentItem,
  IssueItem,
  TaskItem,
  MaterialStatus,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useNavigationStore } from "@/lib/stores/navigation-store"
import { cn } from "@/lib/utils"

// Mock entity/project data with lifecycle tracking
const entityData = {
  entityId: "ENT-2025-0042",
  currentStage: "project" as LifecycleStage,
  customerName: "Alpha Ventures Ltd.",
  programName: "Retail Security Expansion 2025",
  programHref: "/programs/PGM-2025-008",
  lastModifiedBy: "John Smith",
  lastModifiedAt: "Mar 28, 2026 at 10:32 AM",
  lifecycle: [
    {
      stage: "request" as LifecycleStage,
      completedAt: "Jan 5, 2026",
      completedBy: "Mary Johnson",
      referenceId: "REQ-2025-0042",
      href: "/requests/REQ-2025-0042",
    },
    {
      stage: "opportunity" as LifecycleStage,
      completedAt: "Jan 12, 2026",
      completedBy: "Mary Johnson",
      referenceId: "OPP-2025-0042",
      href: "/opportunities/OPP-2025-0042",
    },
    {
      stage: "proposal" as LifecycleStage,
      completedAt: "Jan 28, 2026",
      completedBy: "Charles Wilson",
      referenceId: "PROP-2025-0042",
      href: "/proposals/PROP-2025-0042",
    },
    {
      stage: "won" as LifecycleStage,
      completedAt: "Feb 1, 2026",
      completedBy: "Anna Lee",
    },
    {
      stage: "project" as LifecycleStage,
    },
  ] as LifecycleState[],
}

const projectData = {
  id: "PRJ-001",
  name: "Alpha Shopping Center - CCTV System",
  client: "Alpha Ventures Ltd.",
  status: "in-progress" as StatusType,
  owner: "John Smith",
  ownerEmail: "john.smith@stellaris.io",
  startDate: "2026-02-01",
  dueDate: "2026-04-15",
  site: "123 Commerce Ave, Downtown",
  
  // Proposal linkage
  proposal: {
    id: "PROP-2025-0042",
    name: "Alpha Shopping Center - CCTV System Proposal",
    href: "/proposals/PROP-2025-0042",
  },
  opportunity: {
    id: "OPP-2025-0042",
    name: "Alpha Shopping Center Security",
    href: "/opportunities/OPP-2025-0042",
  },
  
  stakeholders: [
    { name: "Mary Johnson", role: "Project Manager", email: "mary.j@stellaris.io", phone: "+1 (555) 123-4567", isPrimary: true },
    { name: "Charles Wilson", role: "Technical Lead", email: "charles.w@stellaris.io", phone: "+1 (555) 123-4568", isPrimary: false },
    { name: "Anna Lee", role: "Client Rep", email: "anna.l@alpha.com", phone: "+1 (555) 234-5678", isPrimary: false },
  ],
  
  budget: {
    total: 185000,
    actual: 112500,
    committed: 28000,
    variance: 44500,
    margin: 24.1,
  },
  
  tasks: {
    total: 48,
    completed: 31,
    inProgress: 12,
    pending: 5,
    overdue: 2,
  },
  
  taskList: [
    { id: "TSK-001", title: "Install Zone A cameras (12 units)", status: "completed" as const, dueDate: "Mar 25", assignee: "J. Davis", priority: "high" },
    { id: "TSK-002", title: "Configure NVR primary system", status: "in-progress" as const, dueDate: "Mar 28", assignee: "C. Wilson", priority: "high" },
    { id: "TSK-003", title: "Run cabling for Zone B", status: "in-progress" as const, dueDate: "Mar 30", assignee: "J. Davis", priority: "medium" },
    { id: "TSK-004", title: "Test backup power systems", status: "pending" as const, dueDate: "Apr 02", assignee: "M. Johnson", priority: "medium" },
    { id: "TSK-005", title: "Client walkthrough Zone A", status: "pending" as const, dueDate: "Apr 05", assignee: "A. Lee", priority: "low" },
    { id: "TSK-006", title: "Install Zone B cameras (8 units)", status: "pending" as const, dueDate: "Apr 08", assignee: "J. Davis", priority: "high" },
    { id: "TSK-007", title: "Complete cable terminations", status: "overdue" as const, dueDate: "Mar 20", assignee: "J. Davis", priority: "high" },
  ],
  
  materials: {
    total: 156,
    ordered: 145,
    shipped: 98,
    delivered: 85,
    installed: 62,
  },
  
  materialList: [
    { id: "MAT-001", name: "Hikvision DS-2CD2386G2 4K Camera", quantity: 50, ordered: 50, delivered: 45, installed: 38, unitCost: 450 },
    { id: "MAT-002", name: "HikCentral NVR 64ch", quantity: 4, ordered: 4, delivered: 4, installed: 2, unitCost: 3500 },
    { id: "MAT-003", name: "CAT6A Cabling (1000ft)", quantity: 8, ordered: 8, delivered: 6, installed: 4, unitCost: 280 },
    { id: "MAT-004", name: "Network Switch 48-Port PoE+", quantity: 6, ordered: 6, delivered: 4, installed: 3, unitCost: 1200 },
    { id: "MAT-005", name: "UPS Battery Backup 3000VA", quantity: 4, ordered: 4, delivered: 2, installed: 0, unitCost: 850 },
    { id: "MAT-006", name: "Mounting Hardware Kit", quantity: 50, ordered: 45, delivered: 40, installed: 35, unitCost: 25 },
  ],
  
  costs: {
    labor: 67500,
    materials: 38000,
    equipment: 7000,
    subcontractors: 18500,
    other: 2000,
  },
  
  issues: [
    { id: "ISS-012", title: "DVR storage capacity insufficient", severity: "high" as const, assignee: "C. Wilson", status: "open", createdDate: "Mar 22" },
    { id: "ISS-015", title: "Cable routing conflict in Zone B", severity: "medium" as const, assignee: "J. Davis", status: "in-progress", createdDate: "Mar 25" },
    { id: "ISS-018", title: "Permit delay for external cameras", severity: "critical" as const, assignee: "M. Johnson", status: "open", createdDate: "Mar 26" },
  ],
  
  risks: [
    { id: "RSK-001", title: "Permit delays may impact schedule", severity: "high" as const, likelihood: "Medium", impact: "High", mitigation: "Expedite permit application with city planning" },
    { id: "RSK-002", title: "Supply chain delays for NVR units", severity: "medium" as const, likelihood: "Low", impact: "Medium", mitigation: "Alternative supplier identified" },
  ],
  
  activity: [
    { icon: CheckSquare, title: "Task completed", description: "Install Zone A cameras", time: "2h ago" },
    { icon: Package, title: "Material delivered", description: "24x Hikvision IP Cameras", time: "4h ago" },
    { icon: MessageSquare, title: "Comment added", description: "John Smith on cable routing", time: "5h ago" },
    { icon: Upload, title: "Document uploaded", description: "Zone B wiring diagram v2", time: "1d ago" },
    { icon: AlertTriangle, title: "Issue created", description: "Permit delay reported", time: "1d ago" },
  ],
  
  documents: [
    { name: "Project Scope Document v3.pdf", type: "pdf" as const, date: "Mar 20", size: "2.4 MB" },
    { name: "Zone B Wiring Diagram.pdf", type: "pdf" as const, date: "Mar 28", size: "1.8 MB" },
    { name: "Equipment Specifications.xlsx", type: "xls" as const, date: "Mar 15", size: "456 KB" },
    { name: "Site Photos - Zone A.zip", type: "img" as const, date: "Mar 25", size: "45.2 MB" },
    { name: "Client Requirements.docx", type: "doc" as const, date: "Feb 10", size: "128 KB" },
  ],
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

function formatDate(dateString: string): string {
  const date = new Date(dateString + "T00:00:00")
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
}

// Contact card component
function StakeholderCard({ stakeholder, isPrimary }: { stakeholder: typeof projectData.stakeholders[0]; isPrimary: boolean }) {
  return (
    <div className={cn(
      "flex flex-col gap-1.5 p-2.5 rounded-lg border",
      isPrimary ? "border-primary/30 bg-primary/5" : "border-border bg-card"
    )}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">{stakeholder.name}</span>
        {isPrimary && (
          <span className="text-[9px] uppercase font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded">Primary</span>
        )}
      </div>
      <span className="text-xs text-muted-foreground">{stakeholder.role}</span>
      <div className="flex items-center gap-3 pt-1">
        <a href={`mailto:${stakeholder.email}`} className="flex items-center gap-1 text-xs text-primary hover:underline">
          <Mail className="h-3 w-3" />
          Email
        </a>
        <a href={`tel:${stakeholder.phone}`} className="flex items-center gap-1 text-xs text-primary hover:underline">
          <Phone className="h-3 w-3" />
          Call
        </a>
      </div>
    </div>
  )
}

export default function ProjectDashboardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const project = projectData // In real app, fetch by id
  const setActiveModule = useNavigationStore((state) => state.setActiveModule)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    setActiveModule("projects")
  }, [setActiveModule])

  const taskProgress = Math.round((project.tasks.completed / project.tasks.total) * 100)
  const budgetUsed = project.budget.actual + project.budget.committed
  const budgetRemaining = project.budget.total - budgetUsed

  return (
    <AppShell>
      <div className="flex flex-col gap-4 p-4">
        {/* Page Header with Project Info */}
        <div className="flex flex-col gap-3 pb-4 border-b border-border">
          <nav className="flex items-center gap-1 text-xs text-muted-foreground">
            <a href="/" className="hover:text-foreground transition-colors">Home</a>
            <span className="mx-1">/</span>
            <a href="/projects" className="hover:text-foreground transition-colors">Projects</a>
            <span className="mx-1">/</span>
            <span className="text-foreground">{project.id}</span>
          </nav>
          
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-3">
                <h1 className="text-lg font-semibold text-foreground">{project.name}</h1>
                <StatusBadge status={project.status} />
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {project.owner}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(project.startDate)} - {formatDate(project.dueDate)}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {project.site}
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
                  <DropdownMenuItem>
                    <FileText className="h-4 w-4 mr-2" />
                    Export report
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button size="sm" variant="outline">
                <Edit className="h-4 w-4 mr-1.5" />
                Edit
              </Button>
            </div>
          </div>
        </div>

        {/* Entity Header / Lifecycle Bar */}
        <EntityHeader
          entityId={entityData.entityId}
          currentStage={entityData.currentStage}
          status={project.status === "in-progress" ? "Active" : project.status}
          customerName={entityData.customerName}
          programName={entityData.programName}
          programHref={entityData.programHref}
          lifecycle={entityData.lifecycle}
          lastModifiedBy={entityData.lastModifiedBy}
          lastModifiedAt={entityData.lastModifiedAt}
        />

        {/* Budget Summary Bar */}
        <div className="grid grid-cols-5 gap-3 p-3 rounded-lg border border-border bg-card">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Total Budget</span>
            <span className="text-lg font-semibold text-foreground">{formatCurrency(project.budget.total)}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Actual Cost</span>
            <span className="text-lg font-semibold text-foreground">{formatCurrency(project.budget.actual)}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Committed</span>
            <span className="text-lg font-semibold text-warning">{formatCurrency(project.budget.committed)}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Variance</span>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4 text-success" />
              <span className="text-lg font-semibold text-success">{formatCurrency(project.budget.variance)}</span>
            </div>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Margin</span>
            <span className="text-lg font-semibold text-success">{project.budget.margin}%</span>
          </div>
        </div>

        {/* Main Content Grid - Matches Opportunity/Proposal Layout */}
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
                  value="tasks" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
                >
                  Tasks ({project.tasks.total})
                </TabsTrigger>
                <TabsTrigger 
                  value="costs" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
                >
                  Costs
                </TabsTrigger>
                <TabsTrigger 
                  value="materials" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
                >
                  Materials ({project.materials.total})
                </TabsTrigger>
                <TabsTrigger 
                  value="issues" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
                >
                  Issues & Risks ({project.issues.length})
                </TabsTrigger>
                <TabsTrigger 
                  value="documents" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
                >
                  Documents ({project.documents.length})
                </TabsTrigger>
                <TabsTrigger 
                  value="stakeholders" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
                >
                  Stakeholders
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Progress Summary */}
                  <DashboardPanel title="Progress Summary" icon={CheckSquare}>
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-4">
                        <div className="relative h-16 w-16">
                          <svg className="h-16 w-16 -rotate-90" viewBox="0 0 36 36">
                            <circle
                              cx="18"
                              cy="18"
                              r="15.5"
                              fill="none"
                              className="stroke-muted"
                              strokeWidth="3"
                            />
                            <circle
                              cx="18"
                              cy="18"
                              r="15.5"
                              fill="none"
                              className="stroke-primary"
                              strokeWidth="3"
                              strokeDasharray={`${taskProgress} 100`}
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-sm font-semibold">{taskProgress}%</span>
                          </div>
                        </div>
                        <div className="flex-1 grid grid-cols-2 gap-2">
                          <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-success" />
                            <span className="text-xs text-muted-foreground">Completed</span>
                            <span className="text-xs font-medium ml-auto">{project.tasks.completed}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-primary" />
                            <span className="text-xs text-muted-foreground">In Progress</span>
                            <span className="text-xs font-medium ml-auto">{project.tasks.inProgress}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-muted-foreground" />
                            <span className="text-xs text-muted-foreground">Pending</span>
                            <span className="text-xs font-medium ml-auto">{project.tasks.pending}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-destructive" />
                            <span className="text-xs text-muted-foreground">Overdue</span>
                            <span className="text-xs font-medium ml-auto text-destructive">{project.tasks.overdue}</span>
                          </div>
                        </div>
                      </div>
                      <ProgressBar
                        value={project.materials.installed}
                        max={project.materials.total}
                        label="Material installation"
                        variant="success"
                        size="md"
                      />
                    </div>
                  </DashboardPanel>

                  {/* Cost Summary */}
                  <DashboardPanel title="Cost Summary" icon={DollarSign}>
                    <div className="flex flex-col gap-3">
                      <ProgressBar
                        value={budgetUsed}
                        max={project.budget.total}
                        label="Budget utilization"
                        variant={budgetUsed / project.budget.total > 0.9 ? "danger" : "default"}
                      />
                      <div className="grid grid-cols-2 gap-3 pt-1">
                        <div className="flex flex-col gap-0.5 p-2 rounded bg-muted/50">
                          <span className="text-[10px] text-muted-foreground">Spent</span>
                          <span className="text-sm font-medium">{formatCurrency(project.budget.actual)}</span>
                        </div>
                        <div className="flex flex-col gap-0.5 p-2 rounded bg-muted/50">
                          <span className="text-[10px] text-muted-foreground">Remaining</span>
                          <span className="text-sm font-medium text-success">{formatCurrency(budgetRemaining)}</span>
                        </div>
                      </div>
                    </div>
                  </DashboardPanel>
                </div>

                {/* Recent Tasks */}
                <DashboardPanel 
                  title="Recent Tasks" 
                  icon={CheckSquare}
                  action={{ label: "View all tasks", onClick: () => setActiveTab("tasks") }}
                >
                  <div className="flex flex-col gap-0.5">
                    {project.taskList.slice(0, 5).map((task) => (
                      <TaskItem
                        key={task.id}
                        title={task.title}
                        status={task.status}
                        dueDate={task.dueDate}
                        onClick={() => console.log("Task clicked")}
                      />
                    ))}
                  </div>
                </DashboardPanel>

                {/* Open Issues */}
                <DashboardPanel 
                  title="Open Issues" 
                  icon={AlertTriangle}
                  action={{ label: "View all", onClick: () => setActiveTab("issues") }}
                >
                  <div className="flex flex-col gap-1.5">
                    {project.issues.map((issue) => (
                      <IssueItem
                        key={issue.id}
                        id={issue.id}
                        title={issue.title}
                        severity={issue.severity}
                        assignee={issue.assignee}
                        onClick={() => console.log("Issue clicked")}
                      />
                    ))}
                  </div>
                </DashboardPanel>
              </TabsContent>

              {/* Tasks Tab */}
              <TabsContent value="tasks" className="mt-4">
                <DashboardPanel 
                  title="All Tasks" 
                  icon={CheckSquare}
                  action={{ label: "Add task", onClick: () => {} }}
                >
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs w-[80px]">ID</TableHead>
                        <TableHead className="text-xs">Task</TableHead>
                        <TableHead className="text-xs w-[100px]">Status</TableHead>
                        <TableHead className="text-xs w-[80px]">Priority</TableHead>
                        <TableHead className="text-xs w-[100px]">Assignee</TableHead>
                        <TableHead className="text-xs w-[80px]">Due</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {project.taskList.map((task) => (
                        <TableRow key={task.id} className="cursor-pointer hover:bg-accent/50">
                          <TableCell className="text-xs font-mono text-muted-foreground">{task.id}</TableCell>
                          <TableCell className="text-xs font-medium">{task.title}</TableCell>
                          <TableCell>
                            <span className={cn(
                              "text-[10px] px-1.5 py-0.5 rounded font-medium",
                              task.status === "completed" ? "bg-success/15 text-success" :
                              task.status === "in-progress" ? "bg-primary/15 text-primary" :
                              task.status === "overdue" ? "bg-destructive/15 text-destructive" :
                              "bg-muted text-muted-foreground"
                            )}>
                              {task.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className={cn(
                              "text-[10px] px-1.5 py-0.5 rounded font-medium",
                              task.priority === "high" ? "bg-destructive/15 text-destructive" :
                              task.priority === "medium" ? "bg-warning/15 text-warning" :
                              "bg-muted text-muted-foreground"
                            )}>
                              {task.priority}
                            </span>
                          </TableCell>
                          <TableCell className="text-xs">{task.assignee}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">{task.dueDate}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </DashboardPanel>
              </TabsContent>

              {/* Costs Tab */}
              <TabsContent value="costs" className="mt-4 space-y-4">
                <DashboardPanel title="Cost Breakdown" icon={DollarSign}>
                  <div className="space-y-3">
                    <ProgressBar
                      value={budgetUsed}
                      max={project.budget.total}
                      label="Total budget utilization"
                      variant={budgetUsed / project.budget.total > 0.9 ? "danger" : "default"}
                    />
                    <div className="pt-2 space-y-2">
                      <MetricRow label="Labor" value={formatCurrency(project.costs.labor)} />
                      <MetricRow label="Materials" value={formatCurrency(project.costs.materials)} />
                      <MetricRow label="Equipment" value={formatCurrency(project.costs.equipment)} />
                      <MetricRow label="Subcontractors" value={formatCurrency(project.costs.subcontractors)} />
                      <MetricRow label="Other" value={formatCurrency(project.costs.other)} />
                      <div className="pt-2 border-t border-border">
                        <MetricRow label="Total Actual" value={formatCurrency(project.budget.actual)} className="font-semibold" />
                        <MetricRow label="Committed" value={formatCurrency(project.budget.committed)} />
                      </div>
                    </div>
                  </div>
                </DashboardPanel>
              </TabsContent>

              {/* Materials Tab */}
              <TabsContent value="materials" className="mt-4">
                <DashboardPanel 
                  title="Material Tracking" 
                  icon={Package}
                  action={{ label: "Add material", onClick: () => {} }}
                >
                  <div className="space-y-4">
                    <div className="grid grid-cols-4 gap-3">
                      <div className="p-3 rounded-lg bg-muted/50">
                        <span className="text-[10px] text-muted-foreground uppercase">Total Items</span>
                        <p className="text-xl font-semibold">{project.materials.total}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-primary/10">
                        <span className="text-[10px] text-primary uppercase">Ordered</span>
                        <p className="text-xl font-semibold text-primary">{project.materials.ordered}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-warning/10">
                        <span className="text-[10px] text-warning uppercase">Delivered</span>
                        <p className="text-xl font-semibold text-warning">{project.materials.delivered}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-success/10">
                        <span className="text-[10px] text-success uppercase">Installed</span>
                        <p className="text-xl font-semibold text-success">{project.materials.installed}</p>
                      </div>
                    </div>
                    
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs">Material</TableHead>
                          <TableHead className="text-xs text-right w-[60px]">Qty</TableHead>
                          <TableHead className="text-xs text-right w-[70px]">Ordered</TableHead>
                          <TableHead className="text-xs text-right w-[70px]">Delivered</TableHead>
                          <TableHead className="text-xs text-right w-[70px]">Installed</TableHead>
                          <TableHead className="text-xs text-right w-[100px]">Value</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {project.materialList.map((mat) => (
                          <TableRow key={mat.id}>
                            <TableCell className="text-xs font-medium">{mat.name}</TableCell>
                            <TableCell className="text-xs text-right">{mat.quantity}</TableCell>
                            <TableCell className="text-xs text-right">{mat.ordered}</TableCell>
                            <TableCell className="text-xs text-right">{mat.delivered}</TableCell>
                            <TableCell className="text-xs text-right">{mat.installed}</TableCell>
                            <TableCell className="text-xs text-right font-medium">{formatCurrency(mat.quantity * mat.unitCost)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </DashboardPanel>
              </TabsContent>

              {/* Issues & Risks Tab */}
              <TabsContent value="issues" className="mt-4 space-y-4">
                <DashboardPanel 
                  title="Open Issues" 
                  icon={AlertTriangle}
                  action={{ label: "Report issue", onClick: () => {} }}
                >
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs w-[80px]">ID</TableHead>
                        <TableHead className="text-xs">Issue</TableHead>
                        <TableHead className="text-xs w-[80px]">Severity</TableHead>
                        <TableHead className="text-xs w-[80px]">Status</TableHead>
                        <TableHead className="text-xs w-[100px]">Assignee</TableHead>
                        <TableHead className="text-xs w-[80px]">Created</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {project.issues.map((issue) => (
                        <TableRow key={issue.id} className="cursor-pointer hover:bg-accent/50">
                          <TableCell className="text-xs font-mono text-muted-foreground">{issue.id}</TableCell>
                          <TableCell className="text-xs font-medium">{issue.title}</TableCell>
                          <TableCell>
                            <span className={cn(
                              "text-[10px] px-1.5 py-0.5 rounded font-medium",
                              issue.severity === "critical" ? "bg-destructive text-destructive-foreground" :
                              issue.severity === "high" ? "bg-destructive/15 text-destructive" :
                              issue.severity === "medium" ? "bg-warning/15 text-warning" :
                              "bg-muted text-muted-foreground"
                            )}>
                              {issue.severity}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className={cn(
                              "text-[10px] px-1.5 py-0.5 rounded font-medium",
                              issue.status === "open" ? "bg-destructive/15 text-destructive" :
                              issue.status === "in-progress" ? "bg-primary/15 text-primary" :
                              "bg-muted text-muted-foreground"
                            )}>
                              {issue.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-xs">{issue.assignee}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">{issue.createdDate}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </DashboardPanel>

                <DashboardPanel 
                  title="Project Risks" 
                  icon={Flag}
                  action={{ label: "Add risk", onClick: () => {} }}
                >
                  <div className="space-y-2">
                    {project.risks.map((risk) => (
                      <div 
                        key={risk.id}
                        className={cn(
                          "p-3 rounded-lg border",
                          risk.severity === "high" ? "border-destructive/30 bg-destructive/5" :
                          risk.severity === "medium" ? "border-warning/30 bg-warning/5" :
                          "border-border"
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="text-sm font-medium">{risk.title}</p>
                            <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground">
                              <span>Likelihood: {risk.likelihood}</span>
                              <span>Impact: {risk.impact}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                              <span className="font-medium">Mitigation:</span> {risk.mitigation}
                            </p>
                          </div>
                          <span className={cn(
                            "text-[10px] px-1.5 py-0.5 rounded font-medium shrink-0",
                            risk.severity === "high" ? "bg-destructive/15 text-destructive" :
                            risk.severity === "medium" ? "bg-warning/15 text-warning" :
                            "bg-muted text-muted-foreground"
                          )}>
                            {risk.severity}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </DashboardPanel>
              </TabsContent>

              {/* Documents Tab */}
              <TabsContent value="documents" className="mt-4">
                <DashboardPanel 
                  title="Project Documents" 
                  icon={FileText}
                  action={{ label: "Upload", onClick: () => {} }}
                >
                  <div className="flex flex-col gap-1">
                    {project.documents.map((doc, index) => (
                      <DocumentItem
                        key={index}
                        name={doc.name}
                        type={doc.type}
                        date={doc.date}
                        onClick={() => console.log("Document clicked")}
                      />
                    ))}
                  </div>
                </DashboardPanel>
              </TabsContent>

              {/* Stakeholders Tab */}
              <TabsContent value="stakeholders" className="mt-4 space-y-4">
                <DashboardPanel title="Project Stakeholders" icon={Users}>
                  <div className="grid grid-cols-2 gap-3">
                    {project.stakeholders.map((stakeholder, index) => (
                      <StakeholderCard 
                        key={index} 
                        stakeholder={stakeholder} 
                        isPrimary={stakeholder.isPrimary} 
                      />
                    ))}
                  </div>
                </DashboardPanel>

                <DashboardPanel title="Related Records" icon={Link2}>
                  <div className="space-y-2">
                    <a 
                      href={project.opportunity.href}
                      className="flex items-center justify-between p-2 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs font-medium">Opportunity</p>
                          <p className="text-[10px] text-muted-foreground">{project.opportunity.name}</p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </a>
                    <a 
                      href={project.proposal.href}
                      className="flex items-center justify-between p-2 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs font-medium">Proposal</p>
                          <p className="text-[10px] text-muted-foreground">{project.proposal.name}</p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </a>
                  </div>
                </DashboardPanel>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Sidebar (4 cols) */}
          <div className="col-span-4 flex flex-col gap-4">
            {/* Quick Stats */}
            <DashboardPanel title="Quick Stats" icon={CheckSquare}>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-0.5 p-2 rounded bg-muted/50 text-center">
                  <span className="text-lg font-semibold">{taskProgress}%</span>
                  <span className="text-[10px] text-muted-foreground">Complete</span>
                </div>
                <div className="flex flex-col gap-0.5 p-2 rounded bg-muted/50 text-center">
                  <span className="text-lg font-semibold text-destructive">{project.tasks.overdue}</span>
                  <span className="text-[10px] text-muted-foreground">Overdue</span>
                </div>
                <div className="flex flex-col gap-0.5 p-2 rounded bg-muted/50 text-center">
                  <span className="text-lg font-semibold text-destructive">{project.issues.length}</span>
                  <span className="text-[10px] text-muted-foreground">Open Issues</span>
                </div>
                <div className="flex flex-col gap-0.5 p-2 rounded bg-muted/50 text-center">
                  <span className="text-lg font-semibold">{project.documents.length}</span>
                  <span className="text-[10px] text-muted-foreground">Documents</span>
                </div>
              </div>
            </DashboardPanel>

            {/* Key Dates */}
            <DashboardPanel title="Key Dates" icon={Calendar}>
              <div className="space-y-2">
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-xs text-muted-foreground">Start Date</span>
                  <span className="text-xs font-medium">{formatDate(project.startDate)}</span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-xs text-muted-foreground">Due Date</span>
                  <span className="text-xs font-medium">{formatDate(project.dueDate)}</span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-xs text-muted-foreground">Days Remaining</span>
                  <span className="text-xs font-medium text-warning">16 days</span>
                </div>
              </div>
            </DashboardPanel>

            {/* Quick Actions */}
            <DashboardPanel title="Quick Actions" icon={Wrench}>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="justify-start text-xs h-8">
                  <Plus className="h-3.5 w-3.5 mr-1.5" />
                  Add Task
                </Button>
                <Button variant="outline" size="sm" className="justify-start text-xs h-8">
                  <AlertTriangle className="h-3.5 w-3.5 mr-1.5" />
                  Report Issue
                </Button>
                <Button variant="outline" size="sm" className="justify-start text-xs h-8">
                  <Upload className="h-3.5 w-3.5 mr-1.5" />
                  Upload File
                </Button>
                <Button variant="outline" size="sm" className="justify-start text-xs h-8">
                  <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
                  Add Note
                </Button>
              </div>
            </DashboardPanel>

            {/* Recent Activity */}
            <DashboardPanel title="Recent Activity" icon={Clock}>
              <div className="flex flex-col gap-0.5">
                {project.activity.map((item, index) => (
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
          </div>
        </div>
      </div>
    </AppShell>
  )
}
