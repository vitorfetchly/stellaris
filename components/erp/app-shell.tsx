"use client"

import { AppSidebar } from "./app-sidebar"
import { TopBar } from "./top-bar"
import { ReactNode } from "react"

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AppSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-auto p-4">{children}</main>
      </div>
    </div>
  )
}
