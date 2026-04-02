"use client"

import { cn } from "@/lib/utils"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ReactNode } from "react"

interface SidePanelProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  width?: "sm" | "md" | "lg"
  className?: string
}

const widthClasses = {
  sm: "w-80",
  md: "w-96",
  lg: "w-[480px]",
}

export function SidePanel({
  open,
  onClose,
  title,
  children,
  width = "md",
  className,
}: SidePanelProps) {
  if (!open) return null

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={cn(
          "fixed right-0 top-0 z-50 h-full border-l border-border bg-card shadow-lg",
          "animate-in slide-in-from-right duration-200",
          widthClasses[width],
          className
        )}
      >
        {title && (
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h2 className="text-sm font-semibold text-foreground">{title}</h2>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        <div className="h-full overflow-auto p-4">{children}</div>
      </div>
    </>
  )
}
