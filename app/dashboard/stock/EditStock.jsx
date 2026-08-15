"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { IconChevronDown } from "@tabler/icons-react"

export default function EditStock({ isOpen, onOpenChange, stockItem, onSave }) {
  const [sku, setSku] = useState("")
  const [name, setName] = useState("")
  const [category, setCategory] = useState("Coffee Beans")
  const [qty, setQty] = useState(0)
  const [unit, setUnit] = useState("kg")
  const [reorderLevel, setReorderLevel] = useState(10)
  const [quality, setQuality] = useState("Good")
  const [caseQty, setCaseQty] = useState(0)
  const [unitsPerCase, setUnitsPerCase] = useState(0)
  
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (stockItem) {
      setSku(stockItem.sku || "")
      setName(stockItem.name || "")
      setCategory(stockItem.category || "Coffee Beans")
      setQty(stockItem.currentQty || 0)
      setUnit(stockItem.unit || "kg")
      setReorderLevel(stockItem.reorderLevel || 10)
      setQuality(stockItem.quality || "Good")
      setCaseQty(stockItem.caseQty || 0)
      setUnitsPerCase(stockItem.unitsPerCase || 0)
      setErrors({})
    }
  }, [stockItem, isOpen])

  const validate = () => {
    const tempErrors = {}
    if (!sku.trim()) tempErrors.sku = "SKU is required"
    if (!name.trim()) tempErrors.name = "Item name is required"
    if (qty < 0) tempErrors.qty = "Quantity cannot be negative"
    if (reorderLevel < 0) tempErrors.reorderLevel = "Reorder level cannot be negative"
    
    setErrors(tempErrors)
    return Object.keys(tempErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    onSave({
      ...stockItem,
      sku: sku.trim(),
      name: name.trim(),
      category,
      currentQty: qty,
      unit,
      reorderLevel,
      quality,
      caseQty,
      unitsPerCase,
      lastUpdated: new Date().toISOString().replace("T", " ").substring(0, 16),
    })

    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Edit Stock Item</DialogTitle>
          <DialogDescription>
            Modify the selected stock item information and details.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* SKU Field */}
          <div className="space-y-1">
            <Label htmlFor="edit-stock-sku" className="text-sm font-medium">
              SKU / Product Code <span className="text-destructive">*</span>
            </Label>
            <Input
              id="edit-stock-sku"
              placeholder="e.g. CB-ARA-01"
              value={sku}
              onChange={(e) => {
                setSku(e.target.value)
                if (errors.sku) setErrors({ ...errors, sku: "" })
              }}
              className={cn(errors.sku && "border-destructive focus-visible:ring-destructive/20")}
            />
            {errors.sku && <p className="text-xs text-destructive">{errors.sku}</p>}
          </div>

          {/* Name Field */}
          <div className="space-y-1">
            <Label htmlFor="edit-stock-name" className="text-sm font-medium">
              Item Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="edit-stock-name"
              placeholder="e.g. Arabica Coffee Beans"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (errors.name) setErrors({ ...errors, name: "" })
              }}
              className={cn(errors.name && "border-destructive focus-visible:ring-destructive/20")}
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
          </div>

          {/* Category Field */}
          <div className="space-y-1">
            <Label htmlFor="edit-stock-cat" className="text-sm font-medium">
              Category
            </Label>
            <div className="relative">
              <select
                id="edit-stock-cat"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-9 w-full min-w-0 rounded-4xl border border-input bg-input/30 pl-3 pr-8 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 appearance-none cursor-pointer text-foreground"
              >
                <option value="Coffee Beans">Coffee Beans</option>
                <option value="Dairy">Dairy</option>
                <option value="Syrups">Syrups</option>
                <option value="Packaging">Packaging</option>
                <option value="Bakery">Bakery</option>
              </select>
              <IconChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 pointer-events-none text-muted-foreground" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Quantity of Case */}
            <div className="space-y-1">
              <Label htmlFor="edit-stock-case-qty" className="text-sm font-medium">
                Quantity of Case
              </Label>
              <Input
                id="edit-stock-case-qty"
                type="number"
                value={caseQty || ""}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 0
                  setCaseQty(val)
                  setQty(val * unitsPerCase)
                }}
              />
            </div>

            {/* Quantity in Case */}
            <div className="space-y-1">
              <Label htmlFor="edit-stock-units-per-case" className="text-sm font-medium">
                Quantity in Case
              </Label>
              <Input
                id="edit-stock-units-per-case"
                type="number"
                value={unitsPerCase || ""}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 0
                  setUnitsPerCase(val)
                  setQty(caseQty * val)
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Qty Field */}
            <div className="space-y-1">
              <Label htmlFor="edit-stock-qty" className="text-sm font-medium">
                Physical Qty
              </Label>
              <Input
                id="edit-stock-qty"
                type="number"
                value={qty || ""}
                onChange={(e) => setQty(parseInt(e.target.value) || 0)}
              />
            </div>

            {/* Unit Field */}
            <div className="space-y-1">
              <Label htmlFor="edit-stock-unit" className="text-sm font-medium">
                Unit
              </Label>
              <div className="relative">
                <select
                  id="edit-stock-unit"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="h-9 w-full min-w-0 rounded-4xl border border-input bg-input/30 pl-3 pr-8 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 appearance-none cursor-pointer text-foreground"
                >
                  <option value="kg">kg</option>
                  <option value="packs">packs</option>
                  <option value="bottles">bottles</option>
                  <option value="pcs">pcs</option>
                  <option value="cans">cans</option>
                  <option value="case">case</option>
                </select>
                <IconChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 pointer-events-none text-muted-foreground" />
              </div>
            </div>
          </div>

          {/* Quality Field */}
          <div className="space-y-1">
            <Label htmlFor="edit-stock-quality" className="text-sm font-medium">
              Quality Status
            </Label>
            <div className="relative">
              <select
                id="edit-stock-quality"
                value={quality}
                onChange={(e) => setQuality(e.target.value)}
                className="h-9 w-full min-w-0 rounded-4xl border border-input bg-input/30 pl-3 pr-8 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 appearance-none cursor-pointer text-foreground"
              >
                <option value="Good">Good</option>
                <option value="Standard">Standard</option>
                <option value="Premium">Premium</option>
                <option value="Damaged">Damaged</option>
              </select>
              <IconChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 pointer-events-none text-muted-foreground" />
            </div>
          </div>

          {/* Reorder Level Field */}
          <div className="space-y-1">
            <Label htmlFor="edit-stock-reorder" className="text-sm font-medium">
              Reorder Level
            </Label>
            <Input
              id="edit-stock-reorder"
              type="number"
              value={reorderLevel || ""}
              onChange={(e) => setReorderLevel(parseInt(e.target.value) || 0)}
            />
          </div>

          {/* Footer Actions */}
          <DialogFooter className="pt-4 border-t gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer">
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
