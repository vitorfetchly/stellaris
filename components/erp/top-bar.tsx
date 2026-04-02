"use client"

import { cn } from "@/lib/utils"
import { Search, Bell, Activity, ChevronDown, LogOut, User, Settings } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useState } from "react"
import { SidePanel } from "./side-panel"

interface Notification {
  id: string
  title: string
  description: string
  time: string
  read: boolean
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "New proposal submitted",
    description: "Proposal #1234 was submitted for approval",
    time: "5 min ago",
    read: false,
  },
  {
    id: "2",
    title: "Task completed",
    description: "Camera installation - Project Alpha",
    time: "1 hour ago",
    read: false,
  },
  {
    id: "3",
    title: "Material received",
    description: "50x Hikvision IP Cameras delivered",
    time: "3 hours ago",
    read: true,
  },
]

export function TopBar() {
  const [searchValue, setSearchValue] = useState("")
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [activityOpen, setActivityOpen] = useState(false)

  const unreadCount = mockNotifications.filter((n) => !n.read).length

  return (
    <>
      <header className="flex items-center h-12 px-4 border-b border-border bg-background gap-4">
        {/* Global Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects, tasks, documents..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-9 h-8 bg-secondary border-border text-sm w-full"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex h-5 items-center gap-1 rounded border border-border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-1">
          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground relative"
            onClick={() => setNotificationsOpen(true)}
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                {unreadCount}
              </span>
            )}
          </Button>

          {/* Activity */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={() => setActivityOpen(true)}
          >
            <Activity className="h-4 w-4" />
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 gap-2 pl-2 pr-1 text-sm text-muted-foreground hover:text-foreground"
              >
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="bg-primary/20 text-primary text-xs">
                    JD
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:inline">John D.</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">John Doe</p>
                <p className="text-xs text-muted-foreground">john@stellaris.io</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="h-4 w-4 mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:text-destructive">
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Notifications Panel */}
      <SidePanel
        open={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        title="Notifications"
        width="sm"
      >
        <div className="space-y-2">
          {mockNotifications.map((notification) => (
            <div
              key={notification.id}
              className={cn(
                "p-3 rounded-lg border border-border cursor-pointer transition-colors hover:bg-accent/50",
                !notification.read && "bg-accent/30"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {notification.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {notification.description}
                  </p>
                </div>
                {!notification.read && (
                  <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5" />
                )}
              </div>
              <p className="text-[10px] text-muted-foreground mt-2">
                {notification.time}
              </p>
            </div>
          ))}
        </div>
      </SidePanel>

      {/* Activity Panel */}
      <SidePanel
        open={activityOpen}
        onClose={() => setActivityOpen(false)}
        title="Recent Activity"
        width="md"
      >
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <p>Recent system activity history.</p>
          </div>
          <div className="space-y-3">
            {[
              { action: "updated proposal", target: "#1234", user: "Mary S.", time: "10:32" },
              { action: "created task", target: "Configure DVR", user: "John D.", time: "10:15" },
              { action: "started project", target: "Shopping Center X", user: "Charles M.", time: "09:45" },
              { action: "requested material", target: "CAT6 Cables - 500m", user: "Anna L.", time: "09:20" },
              { action: "reported issue", target: "Camera offline", user: "Peter R.", time: "08:55" },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-2 rounded hover:bg-accent/50 transition-colors"
              >
                <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">
                    <span className="font-medium">{item.user}</span>{" "}
                    <span className="text-muted-foreground">{item.action}</span>{" "}
                    <span className="text-primary">{item.target}</span>
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    Today at {item.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SidePanel>
    </>
  )
}
