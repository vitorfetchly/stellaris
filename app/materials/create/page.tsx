"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Save,
  Package,
  DollarSign,
  Settings,
  Upload,
  X,
  Tag,
  Building2,
  FileText,
  Info,
} from "lucide-react"
import { AppShell } from "@/components/erp"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { useNavigationStore } from "@/lib/stores/navigation-store"
import { cn } from "@/lib/utils"

// Mock categories
const categories = [
  { id: "electrical", name: "Electrical" },
  { id: "plumbing", name: "Plumbing" },
  { id: "hvac", name: "HVAC" },
  { id: "structural", name: "Structural" },
  { id: "finishing", name: "Finishing" },
  { id: "hardware", name: "Hardware" },
  { id: "safety", name: "Safety Equipment" },
  { id: "tools", name: "Tools & Equipment" },
]

// Mock vendors
const vendors = [
  { id: "1", name: "ABC Suppliers" },
  { id: "2", name: "BuildMart Inc." },
  { id: "3", name: "Industrial Supply Co." },
  { id: "4", name: "ProTools Direct" },
  { id: "5", name: "SafetyFirst Equipment" },
  { id: "6", name: "ElectriCorp" },
  { id: "7", name: "HVAC Solutions" },
]

// Units of measure
const unitsOfMeasure = [
  { id: "unit", name: "Unit (ea)" },
  { id: "box", name: "Box" },
  { id: "pack", name: "Pack" },
  { id: "meter", name: "Meter (m)" },
  { id: "foot", name: "Foot (ft)" },
  { id: "kg", name: "Kilogram (kg)" },
  { id: "lb", name: "Pound (lb)" },
  { id: "liter", name: "Liter (L)" },
  { id: "gallon", name: "Gallon (gal)" },
  { id: "sqm", name: "Square Meter (m²)" },
  { id: "sqft", name: "Square Foot (ft²)" },
]

interface FormData {
  // Core Material Info
  name: string
  sku: string
  category: string
  description: string
  
  // Cost & Procurement
  defaultCost: string
  vendorId: string
  supplierItemCode: string
  unitOfMeasure: string
  leadTime: string
  manufacturer: string
  
  // Status & Notes
  isActive: boolean
  tags: string[]
  notes: string
}

// Form section component
function FormSection({ 
  title, 
  description,
  icon: Icon, 
  children,
  className 
}: { 
  title: string
  description?: string
  icon: React.ElementType
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-start gap-3 pb-3 border-b border-border">
        <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary/10">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          {description && (
            <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
          )}
        </div>
      </div>
      <div className="space-y-4 pl-11">
        {children}
      </div>
    </div>
  )
}

// Form field wrapper
function FormField({ 
  label, 
  required, 
  helper,
  error,
  children,
  className
}: { 
  label: string
  required?: boolean
  helper?: string
  error?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label className="text-xs font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
        {!required && <span className="text-muted-foreground ml-1 font-normal">(optional)</span>}
      </Label>
      {children}
      {helper && !error && (
        <p className="text-[10px] text-muted-foreground">{helper}</p>
      )}
      {error && (
        <p className="text-[10px] text-destructive">{error}</p>
      )}
    </div>
  )
}

// Tag input component
function TagInput({
  tags,
  onTagsChange,
}: {
  tags: string[]
  onTagsChange: (tags: string[]) => void
}) {
  const [inputValue, setInputValue] = useState("")
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault()
      if (!tags.includes(inputValue.trim())) {
        onTagsChange([...tags, inputValue.trim()])
      }
      setInputValue("")
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      onTagsChange(tags.slice(0, -1))
    }
  }
  
  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove))
  }
  
  return (
    <div className="flex flex-wrap gap-1.5 p-2 min-h-[38px] rounded-md border border-input bg-background focus-within:ring-1 focus-within:ring-ring">
      {tags.map(tag => (
        <Badge
          key={tag}
          variant="secondary"
          className="h-6 gap-1 pr-1"
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(tag)}
            className="rounded-full hover:bg-muted-foreground/20 p-0.5"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={tags.length === 0 ? "Type and press Enter to add tags..." : ""}
        className="flex-1 min-w-[120px] bg-transparent text-sm outline-none placeholder:text-muted-foreground"
      />
    </div>
  )
}

export default function CreateMaterialPage() {
  const router = useRouter()
  const setActiveModule = useNavigationStore((state) => state.setActiveModule)
  
  const [formData, setFormData] = useState<FormData>({
    // Core Material Info
    name: "",
    sku: "",
    category: "",
    description: "",
    
    // Cost & Procurement
    defaultCost: "",
    vendorId: "",
    supplierItemCode: "",
    unitOfMeasure: "unit",
    leadTime: "",
    manufacturer: "",
    
    // Status & Notes
    isActive: true,
    tags: [],
    notes: "",
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  useEffect(() => {
    setActiveModule("materials")
  }, [setActiveModule])
  
  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = "Material name is required"
    }
    
    if (!formData.category) {
      newErrors.category = "Category is required"
    }
    
    if (!formData.defaultCost.trim()) {
      newErrors.defaultCost = "Default unit cost is required"
    } else if (isNaN(parseFloat(formData.defaultCost)) || parseFloat(formData.defaultCost) < 0) {
      newErrors.defaultCost = "Please enter a valid cost amount"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleCancel = () => {
    router.push("/materials")
  }
  
  const handleSave = async () => {
    if (!validateForm()) return
    
    setIsSubmitting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Generate new material ID
    const newMaterialId = `MAT-${String(Math.floor(Math.random() * 10000)).padStart(5, "0")}`
    console.log("Creating material:", { ...formData, id: newMaterialId })
    
    // Navigate to materials list
    router.push("/materials")
  }
  
  const handleImport = () => {
    // TODO: Implement import materials flow
    console.log("Import materials clicked")
  }
  
  return (
    <AppShell>
      <div className="flex flex-col h-full">
        {/* Page Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-card">
          <div className="flex flex-col gap-1">
            <nav className="flex items-center gap-1 text-xs text-muted-foreground">
              <a href="/" className="hover:text-foreground transition-colors">Home</a>
              <span className="mx-1">/</span>
              <a href="/materials" className="hover:text-foreground transition-colors">Materials</a>
              <span className="mx-1">/</span>
              <span className="text-foreground">Add Material</span>
            </nav>
            <h1 className="text-lg font-semibold text-foreground">Add Material</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleImport}
            >
              <Upload className="h-4 w-4 mr-1.5" />
              Import Materials
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSubmitting}
            >
              <Save className="h-4 w-4 mr-1.5" />
              {isSubmitting ? "Saving..." : "Save Material"}
            </Button>
          </div>
        </div>
        
        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto space-y-8">
            
            {/* Section 1: Core Material Info */}
            <FormSection 
              title="Core Material Info" 
              description="Basic information about the material"
              icon={Package}
            >
              <FormField label="Material Name" required error={errors.name}>
                <Input
                  type="text"
                  placeholder="e.g., Copper Wire 14 AWG"
                  value={formData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className="h-9"
                />
              </FormField>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField label="SKU / Item Code" helper="Unique identifier for inventory tracking">
                  <Input
                    type="text"
                    placeholder="e.g., CW-14AWG-100"
                    value={formData.sku}
                    onChange={(e) => updateField("sku", e.target.value)}
                    className="h-9"
                  />
                </FormField>
                
                <FormField label="Category" required error={errors.category}>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => updateField("category", value)}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
              </div>
              
              <FormField label="Description" helper="Detailed description for identification and search">
                <Textarea
                  placeholder="Enter material description, specifications, or usage notes..."
                  value={formData.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  className="min-h-[80px] resize-none"
                />
              </FormField>
            </FormSection>
            
            {/* Section 2: Cost & Procurement */}
            <FormSection 
              title="Cost & Procurement" 
              description="Pricing and supplier information"
              icon={DollarSign}
            >
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Default Unit Cost" required error={errors.defaultCost}>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                    <Input
                      type="text"
                      placeholder="0.00"
                      value={formData.defaultCost}
                      onChange={(e) => updateField("defaultCost", e.target.value)}
                      className="h-9 pl-7"
                    />
                  </div>
                </FormField>
                
                <FormField label="Unit of Measure">
                  <Select
                    value={formData.unitOfMeasure}
                    onValueChange={(value) => updateField("unitOfMeasure", value)}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {unitsOfMeasure.map(unit => (
                        <SelectItem key={unit.id} value={unit.id}>{unit.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Vendor / Supplier">
                  <Select
                    value={formData.vendorId}
                    onValueChange={(value) => updateField("vendorId", value)}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Select vendor" />
                    </SelectTrigger>
                    <SelectContent>
                      {vendors.map(vendor => (
                        <SelectItem key={vendor.id} value={vendor.id}>{vendor.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
                
                <FormField label="Supplier Item Code" helper="Vendor&apos;s part number">
                  <Input
                    type="text"
                    placeholder="e.g., VND-12345"
                    value={formData.supplierItemCode}
                    onChange={(e) => updateField("supplierItemCode", e.target.value)}
                    className="h-9"
                  />
                </FormField>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Lead Time" helper="Typical delivery time in days">
                  <Input
                    type="text"
                    placeholder="e.g., 5 days"
                    value={formData.leadTime}
                    onChange={(e) => updateField("leadTime", e.target.value)}
                    className="h-9"
                  />
                </FormField>
                
                <FormField label="Manufacturer / Brand">
                  <Input
                    type="text"
                    placeholder="e.g., Southwire"
                    value={formData.manufacturer}
                    onChange={(e) => updateField("manufacturer", e.target.value)}
                    className="h-9"
                  />
                </FormField>
              </div>
            </FormSection>
            
            {/* Section 3: Status & Notes */}
            <FormSection 
              title="Status & Notes" 
              description="Material availability and additional information"
              icon={Settings}
            >
              <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "flex items-center justify-center h-8 w-8 rounded-full",
                    formData.isActive ? "bg-emerald-500/10" : "bg-muted"
                  )}>
                    <div className={cn(
                      "h-2.5 w-2.5 rounded-full",
                      formData.isActive ? "bg-emerald-500" : "bg-muted-foreground"
                    )} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {formData.isActive ? "Active" : "Inactive"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formData.isActive 
                        ? "Material is available for use in proposals and projects" 
                        : "Material is hidden from selection in new proposals"}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) => updateField("isActive", checked)}
                />
              </div>
              
              <FormField label="Tags" helper="Press Enter to add a tag">
                <TagInput
                  tags={formData.tags}
                  onTagsChange={(tags) => updateField("tags", tags)}
                />
              </FormField>
              
              <FormField label="Internal Notes">
                <Textarea
                  placeholder="Add any internal notes, special handling instructions, or reminders..."
                  value={formData.notes}
                  onChange={(e) => updateField("notes", e.target.value)}
                  className="min-h-[80px] resize-none"
                />
              </FormField>
            </FormSection>
            
            {/* System Fields Info */}
            <div className="flex items-start gap-3 p-4 rounded-lg border border-border bg-muted/30">
              <Info className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">System Fields</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Created At, Created By, and Last Updated fields will be automatically set by the system when the material is saved.
                </p>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </AppShell>
  )
}
