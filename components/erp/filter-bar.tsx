"use client"

import { cn } from "@/lib/utils"
import { Search, LayoutGrid, List, Filter, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ReactNode, useState } from "react"

interface FilterOption {
  value: string
  label: string
}

interface FilterConfig {
  key: string
  label: string
  options: FilterOption[]
}

interface FilterBarProps {
  searchPlaceholder?: string
  searchValue?: string
  onSearchChange?: (value: string) => void
  filters?: FilterConfig[]
  filterValues?: Record<string, string>
  onFilterChange?: (key: string, value: string) => void
  viewMode?: "table" | "cards"
  onViewModeChange?: (mode: "table" | "cards") => void
  showViewToggle?: boolean
  actions?: ReactNode
  className?: string
}

export function FilterBar({
  searchPlaceholder = "Search...",
  searchValue = "",
  onSearchChange,
  filters = [],
  filterValues = {},
  onFilterChange,
  viewMode = "table",
  onViewModeChange,
  showViewToggle = true,
  actions,
  className,
}: FilterBarProps) {
  const [showFilters, setShowFilters] = useState(false)
  const activeFiltersCount = Object.values(filterValues).filter(Boolean).length

  return (
    <div className={cn("flex flex-col gap-2 py-3", className)}>
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="pl-8 h-8 bg-secondary border-border text-sm"
          />
        </div>
        
        {filters.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "h-8 gap-1.5",
              activeFiltersCount > 0 && "border-primary text-primary"
            )}
          >
            <Filter className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Filters</span>
            {activeFiltersCount > 0 && (
              <span className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                {activeFiltersCount}
              </span>
            )}
          </Button>
        )}

        {showViewToggle && (
          <div className="flex items-center rounded-md border border-border bg-secondary">
            <button
              onClick={() => onViewModeChange?.("table")}
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-l transition-colors",
                viewMode === "table"
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => onViewModeChange?.("cards")}
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-r transition-colors",
                viewMode === "cards"
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
        )}

        {actions && <div className="ml-auto flex items-center gap-2">{actions}</div>}
      </div>

      {showFilters && filters.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap pt-1">
          {filters.map((filter) => (
            <Select
              key={filter.key}
              value={filterValues[filter.key] || ""}
              onValueChange={(value) => onFilterChange?.(filter.key, value)}
            >
              <SelectTrigger className="h-7 w-auto min-w-[120px] text-xs bg-secondary">
                <SelectValue placeholder={filter.label} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {filter.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-muted-foreground hover:text-foreground"
              onClick={() => {
                filters.forEach((f) => onFilterChange?.(f.key, ""))
              }}
            >
              <X className="h-3 w-3 mr-1" />
              Clear filters
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
