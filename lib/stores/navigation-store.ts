"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface NavigationState {
  sidebarCollapsed: boolean
  activeModule: string
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  setActiveModule: (module: string) => void
}

export const useNavigationStore = create<NavigationState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      activeModule: "dashboard",
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      setActiveModule: (module) => set({ activeModule: module }),
    }),
    {
      name: "erp-navigation",
    }
  )
)
