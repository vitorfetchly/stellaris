"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Target,
  FileText,
  FolderKanban,
  CheckSquare,
  DollarSign,
  Package,
  AlertTriangle,
  Files,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigationStore } from "@/lib/stores/navigation-store"

const navigationItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { id: "opportunities", label: "Opportunities", icon: Target, href: "/opportunities" },
  { id: "proposals", label: "Proposals", icon: FileText, href: "/proposals" },
  { id: "projects", label: "Projects", icon: FolderKanban, href: "/projects" },
  { id: "tasks", label: "Tasks", icon: CheckSquare, href: "/tasks" },
  { id: "costs", label: "Costs", icon: DollarSign, href: "/costs" },
  { id: "materials", label: "Materials", icon: Package, href: "/materials" },
  { id: "issues", label: "Issues", icon: AlertTriangle, href: "/issues" },
  { id: "documents", label: "Documents", icon: Files, href: "/documents" },
]

const bottomItems = [
  { id: "settings", label: "Settings", icon: Settings, href: "/settings" },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { sidebarCollapsed, toggleSidebar } = useNavigationStore()

  return (
    <aside
      className={cn(
        "flex flex-col h-full bg-sidebar border-r border-sidebar-border transition-all duration-200",
        sidebarCollapsed ? "w-16" : "w-56"
      )}
    >
      {/* Logo */}
      <div className="flex items-center h-12 px-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-primary">
            <span className="text-sm font-bold text-primary-foreground">S</span>
          </div>
          {!sidebarCollapsed && (
            <span className="text-sm font-semibold text-sidebar-foreground truncate">
              Stellaris
            </span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2">
        <ul className="space-y-0.5 px-2">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== "/" && pathname.startsWith(item.href))
            
            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  )}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <item.icon className={cn("h-4 w-4 shrink-0", isActive && "text-primary")} />
                  {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Bottom section */}
      <div className="border-t border-sidebar-border py-2">
        <ul className="space-y-0.5 px-2">
          {bottomItems.map((item) => {
            const isActive = pathname === item.href

            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  )}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Collapse toggle */}
        <div className="px-2 mt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className={cn(
              "w-full justify-center text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50",
              !sidebarCollapsed && "justify-start"
            )}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4 mr-2" />
                <span>Collapse</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </aside>
  )
}
