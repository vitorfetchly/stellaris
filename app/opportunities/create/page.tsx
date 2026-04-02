"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Save,
  Send,
  Building2,
  Users,
  FileText,
  Calendar,
  MapPin,
  DollarSign,
  AlertTriangle,
  Plus,
  Search,
  Check,
  X,
  Upload,
  Paperclip,
  User,
  Tag,
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useNavigationStore } from "@/lib/stores/navigation-store"
import { cn } from "@/lib/utils"

// Mock existing customers for lookup
const existingCustomers = [
  { id: "1", name: "TechCorp Industries", type: "Enterprise", address: "500 Innovation Drive, Silicon Valley, CA" },
  { id: "2", name: "MegaMart Stores", type: "Retail", address: "1200 Commerce Blvd, Chicago, IL" },
  { id: "3", name: "CloudNet Solutions", type: "Technology", address: "88 Cloud Way, Seattle, WA" },
  { id: "4", name: "Metro General Hospital", type: "Healthcare", address: "450 Medical Center Dr, Boston, MA" },
  { id: "5", name: "State University", type: "Education", address: "1 University Ave, Austin, TX" },
  { id: "6", name: "LogiFreight Inc.", type: "Logistics", address: "900 Warehouse Rd, Memphis, TN" },
  { id: "7", name: "First National Bank", type: "Financial", address: "100 Banking St, New York, NY" },
]

// Mock team members for assignment
const teamMembers = [
  { id: "1", name: "John Smith", role: "Senior Sales Rep" },
  { id: "2", name: "Mary Johnson", role: "Account Executive" },
  { id: "3", name: "Charles Wilson", role: "Technical Sales" },
  { id: "4", name: "Anna Lee", role: "Sales Rep" },
  { id: "5", name: "Peter Brown", role: "Account Executive" },
]

// Duplicate warning mock
const potentialDuplicates = [
  { entityId: "ENT-2026-0058", name: "Corporate HQ Security", customer: "TechCorp Industries", status: "assigned" },
]

interface FormData {
  // Basic Info
  title: string
  requestType: "service" | "project" | ""
  source: string
  
  // Customer
  customerMode: "existing" | "new"
  existingCustomerId: string
  newCustomerName: string
  submitterFirstName: string
  submitterLastName: string
  contactEmail: string
  contactPhone: string
  
  // Opportunity Details
  scope: string
  estimatedBudget: string
  siteAddress: string
  targetStartDate: string
  targetCompletionDate: string
  
  // Ownership
  assigneeId: string
  customerType: "new" | "existing" | ""
  
  // Supporting Context
  stakeholders: string
  notes: string
  attachments: File[]
}

// Form section component
function FormSection({ 
  title, 
  icon: Icon, 
  children,
  className 
}: { 
  title: string
  icon: React.ElementType
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center gap-2 pb-2 border-b border-border">
        <Icon className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      </div>
      <div className="space-y-3">
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

// Customer search/select component
function CustomerSelector({ 
  mode,
  onModeChange,
  selectedCustomerId,
  onSelectCustomer,
  newCustomerName,
  onNewCustomerNameChange,
}: {
  mode: "existing" | "new"
  onModeChange: (mode: "existing" | "new") => void
  selectedCustomerId: string
  onSelectCustomer: (id: string) => void
  newCustomerName: string
  onNewCustomerNameChange: (name: string) => void
}) {
  const [searchQuery, setSearchQuery] = useState("")
  const [showDropdown, setShowDropdown] = useState(false)
  
  const filteredCustomers = existingCustomers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  const selectedCustomer = existingCustomers.find(c => c.id === selectedCustomerId)
  
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Button
          type="button"
          variant={mode === "existing" ? "default" : "outline"}
          size="sm"
          onClick={() => onModeChange("existing")}
          className="flex-1"
        >
          <Search className="h-3 w-3 mr-1.5" />
          Existing Customer
        </Button>
        <Button
          type="button"
          variant={mode === "new" ? "default" : "outline"}
          size="sm"
          onClick={() => onModeChange("new")}
          className="flex-1"
        >
          <Plus className="h-3 w-3 mr-1.5" />
          New Customer
        </Button>
      </div>
      
      {mode === "existing" ? (
        <div className="relative">
          {selectedCustomer ? (
            <div className="flex items-center justify-between p-2 rounded-md border border-primary bg-primary/5">
              <div>
                <p className="text-sm font-medium text-foreground">{selectedCustomer.name}</p>
                <p className="text-xs text-muted-foreground">{selectedCustomer.type} • {selectedCustomer.address}</p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onSelectCustomer("")}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search customers..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setShowDropdown(true)
                  }}
                  onFocus={() => setShowDropdown(true)}
                  className="pl-8 h-9"
                />
              </div>
              {showDropdown && searchQuery && (
                <div className="absolute z-10 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-48 overflow-y-auto">
                  {filteredCustomers.length > 0 ? (
                    filteredCustomers.map(customer => (
                      <button
                        key={customer.id}
                        type="button"
                        onClick={() => {
                          onSelectCustomer(customer.id)
                          setSearchQuery("")
                          setShowDropdown(false)
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-accent/50 transition-colors"
                      >
                        <p className="text-sm font-medium text-foreground">{customer.name}</p>
                        <p className="text-xs text-muted-foreground">{customer.type}</p>
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-4 text-center">
                      <p className="text-sm text-muted-foreground">No customers found</p>
                      <Button
                        type="button"
                        variant="link"
                        size="sm"
                        onClick={() => {
                          onModeChange("new")
                          onNewCustomerNameChange(searchQuery)
                          setShowDropdown(false)
                        }}
                        className="mt-1"
                      >
                        Create "{searchQuery}" as new customer
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <Input
          type="text"
          placeholder="Enter new customer business name"
          value={newCustomerName}
          onChange={(e) => onNewCustomerNameChange(e.target.value)}
          className="h-9"
        />
      )}
    </div>
  )
}

export default function CreateOpportunityPage() {
  const router = useRouter()
  const setActiveModule = useNavigationStore((state) => state.setActiveModule)
  
  const [formData, setFormData] = useState<FormData>({
    title: "",
    requestType: "",
    source: "",
    customerMode: "existing",
    existingCustomerId: "",
    newCustomerName: "",
    submitterFirstName: "",
    submitterLastName: "",
    contactEmail: "",
    contactPhone: "",
    scope: "",
    estimatedBudget: "",
    siteAddress: "",
    targetStartDate: "",
    targetCompletionDate: "",
    assigneeId: "",
    customerType: "",
    stakeholders: "",
    notes: "",
    attachments: [],
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  useEffect(() => {
    setActiveModule("opportunities")
  }, [setActiveModule])
  
  // Check for duplicates when title changes
  useEffect(() => {
    if (formData.title.toLowerCase().includes("security") || formData.title.toLowerCase().includes("corporate")) {
      setShowDuplicateWarning(true)
    } else {
      setShowDuplicateWarning(false)
    }
  }, [formData.title])
  
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
    
    if (!formData.title.trim()) {
      newErrors.title = "Opportunity title is required"
    }
    
    if (!formData.requestType) {
      newErrors.requestType = "Request type is required"
    }
    
    if (formData.customerMode === "existing" && !formData.existingCustomerId) {
      newErrors.customer = "Please select a customer"
    }
    
    if (formData.customerMode === "new" && !formData.newCustomerName.trim()) {
      newErrors.newCustomerName = "Customer name is required"
    }
    
    if (!formData.scope.trim()) {
      newErrors.scope = "Scope description is required"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSaveDraft = async () => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    console.log("Saving draft:", formData)
    router.push("/opportunities")
  }
  
  const handleCreate = async () => {
    if (!validateForm()) return
    
    setIsSubmitting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Generate new entity ID
    const newEntityId = `ENT-2026-${String(Math.floor(Math.random() * 1000)).padStart(4, "0")}`
    console.log("Creating opportunity:", { ...formData, entityId: newEntityId })
    
    // Navigate to the new opportunity detail
    router.push(`/opportunities/${newEntityId}`)
  }
  
  const selectedCustomer = existingCustomers.find(c => c.id === formData.existingCustomerId)
  
  return (
    <AppShell>
      <div className="flex flex-col h-full">
        {/* Page Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-card">
          <div className="flex flex-col gap-1">
            <nav className="flex items-center gap-1 text-xs text-muted-foreground">
              <a href="/" className="hover:text-foreground transition-colors">Home</a>
              <span className="mx-1">/</span>
              <a href="/opportunities" className="hover:text-foreground transition-colors">Opportunities</a>
              <span className="mx-1">/</span>
              <span className="text-foreground">Create</span>
            </nav>
            <h1 className="text-lg font-semibold text-foreground">Create Opportunity</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveDraft}
              disabled={isSubmitting}
            >
              <Save className="h-4 w-4 mr-1.5" />
              Save Draft
            </Button>
            <Button
              size="sm"
              onClick={handleCreate}
              disabled={isSubmitting}
            >
              <Send className="h-4 w-4 mr-1.5" />
              {isSubmitting ? "Creating..." : "Create Opportunity"}
            </Button>
          </div>
        </div>
        
        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Duplicate Warning */}
            {showDuplicateWarning && (
              <div className="flex items-start gap-3 p-3 rounded-lg border border-warning/50 bg-warning/10">
                <AlertTriangle className="h-4 w-4 text-warning mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-warning">Potential Duplicate Detected</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Similar opportunities found. Please verify before creating.
                  </p>
                  <div className="mt-2 space-y-1">
                    {potentialDuplicates.map(dup => (
                      <a
                        key={dup.entityId}
                        href={`/opportunities/${dup.entityId}`}
                        className="flex items-center gap-2 text-xs text-primary hover:underline"
                      >
                        <span className="font-mono">{dup.entityId}</span>
                        <span>•</span>
                        <span>{dup.name}</span>
                        <span className="text-muted-foreground">({dup.customer})</span>
                      </a>
                    ))}
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDuplicateWarning(false)}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Basic Info */}
                <FormSection title="Basic Information" icon={FileText}>
                  <FormField label="Opportunity Title" required error={errors.title}>
                    <Input
                      type="text"
                      placeholder="e.g., Corporate HQ Security Overhaul"
                      value={formData.title}
                      onChange={(e) => updateField("title", e.target.value)}
                      className="h-9"
                    />
                  </FormField>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <FormField label="Request Type" required error={errors.requestType}>
                      <Select
                        value={formData.requestType}
                        onValueChange={(value) => updateField("requestType", value as "service" | "project")}
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="project">Project</SelectItem>
                          <SelectItem value="service">Service</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormField>
                    
                    <FormField label="Source / Channel">
                      <Select
                        value={formData.source}
                        onValueChange={(value) => updateField("source", value)}
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Select source" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="direct">Direct Inquiry</SelectItem>
                          <SelectItem value="referral">Referral</SelectItem>
                          <SelectItem value="website">Website</SelectItem>
                          <SelectItem value="trade-show">Trade Show</SelectItem>
                          <SelectItem value="cold-call">Cold Call</SelectItem>
                          <SelectItem value="partner">Partner</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormField>
                  </div>
                  
                  <div className="flex items-center gap-2 px-2 py-1.5 rounded bg-muted/50 text-xs text-muted-foreground">
                    <Tag className="h-3 w-3" />
                    <span>Status will be set to <span className="font-medium text-foreground">Created</span> on save</span>
                  </div>
                </FormSection>
                
                {/* Customer Section */}
                <FormSection title="Customer" icon={Building2}>
                  <CustomerSelector
                    mode={formData.customerMode}
                    onModeChange={(mode) => updateField("customerMode", mode)}
                    selectedCustomerId={formData.existingCustomerId}
                    onSelectCustomer={(id) => updateField("existingCustomerId", id)}
                    newCustomerName={formData.newCustomerName}
                    onNewCustomerNameChange={(name) => updateField("newCustomerName", name)}
                  />
                  {errors.customer && (
                    <p className="text-[10px] text-destructive">{errors.customer}</p>
                  )}
                  {errors.newCustomerName && (
                    <p className="text-[10px] text-destructive">{errors.newCustomerName}</p>
                  )}
                  
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border">
                    <FormField label="Contact First Name">
                      <Input
                        type="text"
                        placeholder="First name"
                        value={formData.submitterFirstName}
                        onChange={(e) => updateField("submitterFirstName", e.target.value)}
                        className="h-9"
                      />
                    </FormField>
                    <FormField label="Contact Last Name">
                      <Input
                        type="text"
                        placeholder="Last name"
                        value={formData.submitterLastName}
                        onChange={(e) => updateField("submitterLastName", e.target.value)}
                        className="h-9"
                      />
                    </FormField>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <FormField label="Contact Email">
                      <Input
                        type="email"
                        placeholder="email@company.com"
                        value={formData.contactEmail}
                        onChange={(e) => updateField("contactEmail", e.target.value)}
                        className="h-9"
                      />
                    </FormField>
                    <FormField label="Contact Phone">
                      <Input
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={formData.contactPhone}
                        onChange={(e) => updateField("contactPhone", e.target.value)}
                        className="h-9"
                      />
                    </FormField>
                  </div>
                  
                  {selectedCustomer && (
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                      <Check className="h-3 w-3 text-success" />
                      Customer data will be auto-populated from existing record
                    </div>
                  )}
                </FormSection>
                
                {/* Ownership */}
                <FormSection title="Ownership" icon={Users}>
                  <FormField label="Assignee / Salesperson">
                    <Select
                      value={formData.assigneeId}
                      onValueChange={(value) => updateField("assigneeId", value)}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Leave unassigned or select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unassigned">Unassigned</SelectItem>
                        {teamMembers.map(member => (
                          <SelectItem key={member.id} value={member.id}>
                            {member.name} ({member.role})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>
                  
                  <FormField label="Customer Type">
                    <RadioGroup
                      value={formData.customerType}
                      onValueChange={(value) => updateField("customerType", value as "new" | "existing")}
                      className="flex gap-4"
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="new" id="cust-new" />
                        <Label htmlFor="cust-new" className="text-sm font-normal cursor-pointer">New Customer</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="existing" id="cust-existing" />
                        <Label htmlFor="cust-existing" className="text-sm font-normal cursor-pointer">Existing Customer</Label>
                      </div>
                    </RadioGroup>
                  </FormField>
                </FormSection>
              </div>
              
              {/* Right Column */}
              <div className="space-y-6">
                {/* Opportunity Details */}
                <FormSection title="Opportunity Details" icon={FileText}>
                  <FormField label="Scope / Request Description" required error={errors.scope}>
                    <Textarea
                      placeholder="Describe the scope of work, key requirements, and any relevant context..."
                      value={formData.scope}
                      onChange={(e) => updateField("scope", e.target.value)}
                      className="min-h-24 resize-none"
                    />
                  </FormField>
                  
                  <FormField label="Estimated Budget" helper="Approximate budget if known">
                    <div className="relative">
                      <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="0"
                        value={formData.estimatedBudget}
                        onChange={(e) => updateField("estimatedBudget", e.target.value)}
                        className="h-9 pl-8"
                      />
                    </div>
                  </FormField>
                  
                  <FormField label="Site Address">
                    <div className="relative">
                      <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Enter site address"
                        value={formData.siteAddress}
                        onChange={(e) => updateField("siteAddress", e.target.value)}
                        className="h-9 pl-8"
                      />
                    </div>
                  </FormField>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <FormField label="Target Start Date">
                      <div className="relative">
                        <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                        <Input
                          type="date"
                          value={formData.targetStartDate}
                          onChange={(e) => updateField("targetStartDate", e.target.value)}
                          className="h-9 pl-8"
                        />
                      </div>
                    </FormField>
                    <FormField label="Target Completion">
                      <div className="relative">
                        <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                        <Input
                          type="date"
                          value={formData.targetCompletionDate}
                          onChange={(e) => updateField("targetCompletionDate", e.target.value)}
                          className="h-9 pl-8"
                        />
                      </div>
                    </FormField>
                  </div>
                </FormSection>
                
                {/* Supporting Context */}
                <FormSection title="Supporting Context" icon={User}>
                  <FormField label="Key Stakeholders" helper="List key decision makers or influencers">
                    <Textarea
                      placeholder="e.g., John Smith (CFO), Mary Johnson (VP Operations)"
                      value={formData.stakeholders}
                      onChange={(e) => updateField("stakeholders", e.target.value)}
                      className="min-h-16 resize-none"
                    />
                  </FormField>
                  
                  <FormField label="Notes / Assumptions">
                    <Textarea
                      placeholder="Any additional notes, assumptions, or context..."
                      value={formData.notes}
                      onChange={(e) => updateField("notes", e.target.value)}
                      className="min-h-20 resize-none"
                    />
                  </FormField>
                  
                  <FormField label="Attachments">
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-accent/30 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                          <p className="text-xs text-muted-foreground">
                            <span className="font-medium text-primary">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-[10px] text-muted-foreground mt-1">PDF, DOC, XLS, Images (max 10MB)</p>
                        </div>
                        <input type="file" className="hidden" multiple />
                      </label>
                    </div>
                    {formData.attachments.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {formData.attachments.map((file, index) => (
                          <div key={index} className="flex items-center gap-2 text-xs">
                            <Paperclip className="h-3 w-3 text-muted-foreground" />
                            <span className="text-foreground">{file.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </FormField>
                </FormSection>
              </div>
            </div>
            
            {/* Bottom Actions (mobile-friendly duplicate) */}
            <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/opportunities")}
              >
                Cancel
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveDraft}
                disabled={isSubmitting}
              >
                <Save className="h-4 w-4 mr-1.5" />
                Save Draft
              </Button>
              <Button
                size="sm"
                onClick={handleCreate}
                disabled={isSubmitting}
              >
                <Send className="h-4 w-4 mr-1.5" />
                {isSubmitting ? "Creating..." : "Create Opportunity"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
