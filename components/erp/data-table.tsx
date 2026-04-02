"use client"

import { cn } from "@/lib/utils"
import { ChevronUp, ChevronDown, MoreHorizontal } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ReactNode, useState } from "react"

export interface Column<T> {
  key: string
  header: string
  width?: string
  sortable?: boolean
  render?: (row: T, index: number) => ReactNode
  className?: string
}

export interface RowAction<T> {
  label: string
  onClick: (row: T) => void
  icon?: ReactNode
  variant?: "default" | "destructive"
  separator?: boolean
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  rowActions?: RowAction<T>[]
  onRowClick?: (row: T) => void
  selectable?: boolean
  selectedRows?: Set<string>
  onSelectionChange?: (selected: Set<string>) => void
  getRowId?: (row: T) => string
  sortKey?: string
  sortDirection?: "asc" | "desc"
  onSort?: (key: string) => void
  stickyHeader?: boolean
  compact?: boolean
  className?: string
  emptyState?: ReactNode
}

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  rowActions,
  onRowClick,
  selectable = false,
  selectedRows = new Set(),
  onSelectionChange,
  getRowId = (row) => String(row.id || ""),
  sortKey,
  sortDirection = "asc",
  onSort,
  stickyHeader = true,
  compact = true,
  className,
  emptyState,
}: DataTableProps<T>) {
  const allSelected = data.length > 0 && data.every((row) => selectedRows.has(getRowId(row)))
  const someSelected = data.some((row) => selectedRows.has(getRowId(row)))

  const handleSelectAll = () => {
    if (allSelected) {
      onSelectionChange?.(new Set())
    } else {
      onSelectionChange?.(new Set(data.map(getRowId)))
    }
  }

  const handleSelectRow = (row: T) => {
    const id = getRowId(row)
    const newSelected = new Set(selectedRows)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    onSelectionChange?.(newSelected)
  }

  return (
    <div className={cn("relative overflow-auto rounded-lg border border-border", className)}>
      <Table>
        <TableHeader className={cn(stickyHeader && "sticky top-0 z-10 bg-card")}>
          <TableRow className="hover:bg-transparent border-border">
            {selectable && (
              <TableHead className="w-10 px-3">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all"
                  className={someSelected && !allSelected ? "opacity-50" : ""}
                />
              </TableHead>
            )}
            {columns.map((column) => (
              <TableHead
                key={column.key}
                className={cn(
                  "text-xs font-medium text-muted-foreground uppercase tracking-wide",
                  compact ? "py-2 px-3" : "py-3 px-4",
                  column.sortable && "cursor-pointer select-none hover:text-foreground",
                  column.width,
                  column.className
                )}
                style={column.width ? { width: column.width } : undefined}
                onClick={() => column.sortable && onSort?.(column.key)}
              >
                <div className="flex items-center gap-1">
                  {column.header}
                  {column.sortable && sortKey === column.key && (
                    <span className="text-foreground">
                      {sortDirection === "asc" ? (
                        <ChevronUp className="h-3 w-3" />
                      ) : (
                        <ChevronDown className="h-3 w-3" />
                      )}
                    </span>
                  )}
                </div>
              </TableHead>
            ))}
            {rowActions && rowActions.length > 0 && (
              <TableHead className={cn("w-10", compact ? "py-2 px-3" : "py-3 px-4")} />
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length + (selectable ? 1 : 0) + (rowActions ? 1 : 0)}
                className="h-32"
              >
                {emptyState || (
                  <div className="text-center text-sm text-muted-foreground">
                    No records found
                  </div>
                )}
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, index) => {
              const rowId = getRowId(row)
              const isSelected = selectedRows.has(rowId)

              return (
                <TableRow
                  key={rowId}
                  className={cn(
                    "border-border/50 transition-colors",
                    onRowClick && "cursor-pointer",
                    isSelected && "bg-accent/50"
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  {selectable && (
                    <TableCell
                      className="px-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => handleSelectRow(row)}
                        aria-label="Select row"
                      />
                    </TableCell>
                  )}
                  {columns.map((column) => (
                    <TableCell
                      key={column.key}
                      className={cn(
                        "text-sm",
                        compact ? "py-2 px-3" : "py-3 px-4",
                        column.className
                      )}
                    >
                      {column.render
                        ? column.render(row, index)
                        : (row[column.key] as ReactNode)}
                    </TableCell>
                  ))}
                  {rowActions && rowActions.length > 0 && (
                    <TableCell
                      className={cn(compact ? "py-2 px-3" : "py-3 px-4")}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-foreground"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          {rowActions.map((action, actionIndex) => (
                            <div key={actionIndex}>
                              {action.separator && <DropdownMenuSeparator />}
                              <DropdownMenuItem
                                onClick={() => action.onClick(row)}
                                className={cn(
                                  action.variant === "destructive" &&
                                    "text-destructive focus:text-destructive"
                                )}
                              >
                                {action.icon && (
                                  <span className="mr-2">{action.icon}</span>
                                )}
                                {action.label}
                              </DropdownMenuItem>
                            </div>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}
