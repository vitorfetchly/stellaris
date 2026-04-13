"use client"

import { useState, useMemo } from "react"
import { Search, Plus, Package, X, Check, Tag, Layers, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

// Catalog item type
export interface CatalogItem {
  id: string
  name: string
  sku: string
  category: string
  unitCost: number
  vendor?: string
  availability?: "in-stock" | "on-order" | "discontinued"
}

// BOM row type (used externally)
export interface BomItem {
  id: number
  item: string
  sku?: string
  category: string
  quantity: number
  unitCost: number
  total: number
  source: "catalog" | "custom"
  catalogId?: string
}

// Mock catalog data
const catalogItems: CatalogItem[] = [
  { id: "CAT-001", name: "Hikvision DS-2CD2386G2-IU 4K Camera", sku: "HIK-4K-IU-86G2", category: "Cameras", unitCost: 450, vendor: "Hikvision", availability: "in-stock" },
  { id: "CAT-002", name: "Hikvision DS-2CD2T47G2-L ColorVu Camera", sku: "HIK-CV-T47G2", category: "Cameras", unitCost: 320, vendor: "Hikvision", availability: "in-stock" },
  { id: "CAT-003", name: "Hikvision DS-2DE4A425IWG-E PTZ Camera", sku: "HIK-PTZ-4A425", category: "Cameras", unitCost: 1100, vendor: "Hikvision", availability: "in-stock" },
  { id: "CAT-004", name: "HikCentral Professional NVR 64ch", sku: "HIK-NVR-64CH", category: "Recording", unitCost: 3500, vendor: "Hikvision", availability: "in-stock" },
  { id: "CAT-005", name: "HikCentral Professional NVR 32ch", sku: "HIK-NVR-32CH", category: "Recording", unitCost: 2200, vendor: "Hikvision", availability: "in-stock" },
  { id: "CAT-006", name: "ZKTeco SpeedFace-V5L Biometric Reader", sku: "ZKT-SF-V5L", category: "Access Control", unitCost: 650, vendor: "ZKTeco", availability: "in-stock" },
  { id: "CAT-007", name: "ZKTeco C2-260 Access Controller", sku: "ZKT-C2-260", category: "Access Control", unitCost: 280, vendor: "ZKTeco", availability: "on-order" },
  { id: "CAT-008", name: "Honeywell Galaxy Integration Module", sku: "HON-GAL-INT", category: "Integration", unitCost: 2200, vendor: "Honeywell", availability: "in-stock" },
  { id: "CAT-009", name: "Network Switch 48-Port PoE+", sku: "NET-SW-48POE", category: "Networking", unitCost: 1200, vendor: "Cisco", availability: "in-stock" },
  { id: "CAT-010", name: "Network Switch 24-Port PoE+", sku: "NET-SW-24POE", category: "Networking", unitCost: 780, vendor: "Cisco", availability: "in-stock" },
  { id: "CAT-011", name: "CAT6A Cabling (per 1000ft)", sku: "CBL-CAT6A-1K", category: "Infrastructure", unitCost: 280, vendor: "Belden", availability: "in-stock" },
  { id: "CAT-012", name: "UPS Battery Backup 3000VA", sku: "UPS-3000VA", category: "Power", unitCost: 850, vendor: "APC", availability: "in-stock" },
  { id: "CAT-013", name: "UPS Battery Backup 1500VA", sku: "UPS-1500VA", category: "Power", unitCost: 480, vendor: "APC", availability: "in-stock" },
  { id: "CAT-014", name: "Mounting Hardware Kit (per camera)", sku: "MNT-CAM-KIT", category: "Installation", unitCost: 25, vendor: "Generic", availability: "in-stock" },
  { id: "CAT-015", name: "Conduit 3/4\" EMT (per 10ft)", sku: "CDT-EMT-34-10", category: "Infrastructure", unitCost: 12, vendor: "Generic", availability: "in-stock" },
]

const availabilityConfig = {
  "in-stock": { label: "In Stock", className: "text-success" },
  "on-order": { label: "On Order", className: "text-warning" },
  "discontinued": { label: "Discontinued", className: "text-destructive" },
}

const categories = ["All", ...Array.from(new Set(catalogItems.map(i => i.category))).sort()]

interface CustomItemForm {
  name: string
  category: string
  unitCost: string
  sku: string
  vendor: string
  description: string
}

const emptyCustomForm: CustomItemForm = {
  name: "",
  category: "",
  unitCost: "",
  sku: "",
  vendor: "",
  description: "",
}

interface BomDrawerProps {
  open: boolean
  onClose: () => void
  onAddItems: (items: Omit<BomItem, "id">[]) => void
  existingItemIds?: string[]
}

export function BomDrawer({ open, onClose, onAddItems, existingItemIds = [] }: BomDrawerProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [mode, setMode] = useState<"search" | "custom">("search")
  const [customForm, setCustomForm] = useState<CustomItemForm>(emptyCustomForm)
  const [customErrors, setCustomErrors] = useState<Partial<CustomItemForm>>({})

  const filteredItems = useMemo(() => {
    return catalogItems.filter((item) => {
      const matchesSearch =
        !searchQuery ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.vendor?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory])

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
        if (!quantities[id]) {
          setQuantities((q) => ({ ...q, [id]: 1 }))
        }
      }
      return next
    })
  }

  const updateQuantity = (id: string, value: string) => {
    const num = parseInt(value)
    if (!isNaN(num) && num > 0) {
      setQuantities((q) => ({ ...q, [id]: num }))
    }
  }

  const handleAddSelected = () => {
    const items: Omit<BomItem, "id">[] = []
    selectedIds.forEach((id) => {
      const catalog = catalogItems.find((c) => c.id === id)
      if (!catalog) return
      const qty = quantities[id] ?? 1
      items.push({
        item: catalog.name,
        sku: catalog.sku,
        category: catalog.category,
        quantity: qty,
        unitCost: catalog.unitCost,
        total: qty * catalog.unitCost,
        source: "catalog",
        catalogId: catalog.id,
      })
    })
    onAddItems(items)
    setSelectedIds(new Set())
    setQuantities({})
    setSearchQuery("")
  }

  const validateCustomForm = () => {
    const errors: Partial<CustomItemForm> = {}
    if (!customForm.name.trim()) errors.name = "Required"
    if (!customForm.category.trim()) errors.category = "Required"
    if (!customForm.unitCost.trim() || isNaN(parseFloat(customForm.unitCost))) errors.unitCost = "Valid number required"
    setCustomErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleAddCustom = () => {
    if (!validateCustomForm()) return
    const qty = 1
    const unitCost = parseFloat(customForm.unitCost)
    onAddItems([{
      item: customForm.name.trim(),
      sku: customForm.sku.trim() || undefined,
      category: customForm.category.trim(),
      quantity: qty,
      unitCost,
      total: qty * unitCost,
      source: "custom",
    }])
    setCustomForm(emptyCustomForm)
    setCustomErrors({})
    setMode("search")
  }

  const handleClose = () => {
    setSelectedIds(new Set())
    setQuantities({})
    setSearchQuery("")
    setMode("search")
    setCustomForm(emptyCustomForm)
    setCustomErrors({})
    onClose()
  }

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm" onClick={handleClose} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 z-50 h-full w-[480px] border-l border-border bg-card shadow-xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border px-4 py-3 shrink-0">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Add Items to BOM</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Search existing products or create a custom item</p>
          </div>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground shrink-0" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Mode tabs */}
        <div className="flex border-b border-border shrink-0">
          <button
            onClick={() => setMode("search")}
            className={cn(
              "flex-1 py-2 text-xs font-medium transition-colors",
              mode === "search"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Package className="h-3.5 w-3.5 inline mr-1.5" />
            Catalog
          </button>
          <button
            onClick={() => setMode("custom")}
            className={cn(
              "flex-1 py-2 text-xs font-medium transition-colors",
              mode === "custom"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Plus className="h-3.5 w-3.5 inline mr-1.5" />
            Custom Item
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {mode === "search" ? (
            <div className="flex flex-col h-full">
              {/* Search & filter */}
              <div className="p-3 space-y-2 border-b border-border">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by item name, SKU, category, or vendor..."
                    className="pl-8 h-8 text-xs"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                {/* Category chips */}
                <div className="flex gap-1.5 flex-wrap">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={cn(
                        "text-[10px] px-2 py-0.5 rounded-full border transition-colors",
                        selectedCategory === cat
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Results */}
              <div className="flex-1 overflow-y-auto">
                {filteredItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                    <AlertCircle className="h-8 w-8 text-muted-foreground mb-3" />
                    <p className="text-sm font-medium text-foreground mb-1">No matching item found</p>
                    <p className="text-xs text-muted-foreground mb-4">
                      Try a different search term or create a custom item
                    </p>
                    <Button size="sm" variant="outline" onClick={() => setMode("custom")}>
                      <Plus className="h-3.5 w-3.5 mr-1.5" />
                      Create Custom Item
                    </Button>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {filteredItems.map((item) => {
                      const isSelected = selectedIds.has(item.id)
                      const avail = item.availability ? availabilityConfig[item.availability] : null
                      return (
                        <div
                          key={item.id}
                          onClick={() => toggleSelect(item.id)}
                          className={cn(
                            "flex items-start gap-3 px-3 py-2.5 cursor-pointer transition-colors",
                            isSelected
                              ? "bg-primary/8 hover:bg-primary/12"
                              : "hover:bg-accent/50"
                          )}
                        >
                          {/* Checkbox */}
                          <div className={cn(
                            "mt-0.5 h-4 w-4 rounded border shrink-0 flex items-center justify-center transition-colors",
                            isSelected
                              ? "bg-primary border-primary"
                              : "border-border"
                          )}>
                            {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-xs font-medium text-foreground leading-tight">{item.name}</p>
                              <span className="text-xs font-semibold text-foreground shrink-0">
                                ${item.unitCost.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                              <span className="text-[10px] text-muted-foreground font-mono">{item.sku}</span>
                              <span className="text-[10px] px-1 py-0 rounded bg-muted text-muted-foreground">{item.category}</span>
                              {item.vendor && (
                                <span className="text-[10px] text-muted-foreground">{item.vendor}</span>
                              )}
                              {avail && (
                                <span className={cn("text-[10px] font-medium", avail.className)}>
                                  {avail.label}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Qty input (shown only when selected) */}
                          {isSelected && (
                            <div onClick={(e) => e.stopPropagation()} className="shrink-0">
                              <div className="flex items-center gap-1">
                                <span className="text-[10px] text-muted-foreground">Qty</span>
                                <Input
                                  type="number"
                                  min={1}
                                  value={quantities[item.id] ?? 1}
                                  onChange={(e) => updateQuantity(item.id, e.target.value)}
                                  className="h-6 w-14 text-xs text-center px-1"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Custom item form */
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-primary/8 border border-primary/20 mb-4">
                <Layers className="h-4 w-4 text-primary shrink-0" />
                <p className="text-xs text-foreground">
                  Custom items are marked separately from catalog items and won&apos;t be linked to inventory.
                </p>
              </div>

              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">
                  Item Name <span className="text-destructive">*</span>
                </label>
                <Input
                  value={customForm.name}
                  onChange={(e) => setCustomForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Custom Junction Box"
                  className={cn("h-8 text-xs", customErrors.name && "border-destructive")}
                />
                {customErrors.name && <p className="text-[10px] text-destructive mt-0.5">{customErrors.name}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-foreground mb-1 block">
                    Category <span className="text-destructive">*</span>
                  </label>
                  <Input
                    value={customForm.category}
                    onChange={(e) => setCustomForm((f) => ({ ...f, category: e.target.value }))}
                    placeholder="e.g. Infrastructure"
                    className={cn("h-8 text-xs", customErrors.category && "border-destructive")}
                    list="category-suggestions"
                  />
                  <datalist id="category-suggestions">
                    {categories.filter(c => c !== "All").map(c => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                  {customErrors.category && <p className="text-[10px] text-destructive mt-0.5">{customErrors.category}</p>}
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground mb-1 block">
                    Unit Cost <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">$</span>
                    <Input
                      value={customForm.unitCost}
                      onChange={(e) => setCustomForm((f) => ({ ...f, unitCost: e.target.value }))}
                      placeholder="0.00"
                      className={cn("h-8 text-xs pl-5", customErrors.unitCost && "border-destructive")}
                    />
                  </div>
                  {customErrors.unitCost && <p className="text-[10px] text-destructive mt-0.5">{customErrors.unitCost}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-foreground mb-1 block">
                    SKU <span className="text-[10px] text-muted-foreground font-normal">(optional)</span>
                  </label>
                  <Input
                    value={customForm.sku}
                    onChange={(e) => setCustomForm((f) => ({ ...f, sku: e.target.value }))}
                    placeholder="e.g. CUST-001"
                    className="h-8 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground mb-1 block">
                    Vendor <span className="text-[10px] text-muted-foreground font-normal">(optional)</span>
                  </label>
                  <Input
                    value={customForm.vendor}
                    onChange={(e) => setCustomForm((f) => ({ ...f, vendor: e.target.value }))}
                    placeholder="e.g. Local Supplier"
                    className="h-8 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">
                  Description <span className="text-[10px] text-muted-foreground font-normal">(optional)</span>
                </label>
                <textarea
                  value={customForm.description}
                  onChange={(e) => setCustomForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Additional notes about this item..."
                  rows={2}
                  className="w-full rounded-md border border-input bg-input px-3 py-2 text-xs resize-none focus:outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground"
                />
              </div>

              <Button size="sm" className="w-full" onClick={handleAddCustom}>
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                Add Custom Item to BOM
              </Button>
            </div>
          )}
        </div>

        {/* Footer (catalog mode only) */}
        {mode === "search" && (
          <div className="border-t border-border px-4 py-3 flex items-center justify-between shrink-0 bg-card">
            <span className="text-xs text-muted-foreground">
              {selectedIds.size > 0
                ? `${selectedIds.size} item${selectedIds.size > 1 ? "s" : ""} selected`
                : "Select items to add"}
            </span>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleAddSelected}
                disabled={selectedIds.size === 0}
              >
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                Add Selected
                {selectedIds.size > 0 && (
                  <span className="ml-1.5 bg-primary-foreground/20 text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                    {selectedIds.size}
                  </span>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
