"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { IconChevronDown } from "@tabler/icons-react"

export default function CreateProduct({ isOpen, onOpenChange, onCreate }) {
  const [name, setName] = useState("")
  const [category, setCategory] = useState("Coffee")
  const [price, setPrice] = useState("")
  const [stock, setStock] = useState("")
  const [errors, setErrors] = useState({})

  const validate = () => {
    const tempErrors = {}
    if (!name.trim()) tempErrors.name = "Product name is required"
    if (!price || parseFloat(price) <= 0) tempErrors.price = "Price must be greater than 0"
    if (stock === "" || parseInt(stock) < 0) tempErrors.stock = "Stock must be 0 or more"
    setErrors(tempErrors)
    return Object.keys(tempErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    // Auto-calculate status from stock
    const stockNum = parseInt(stock)
    let status = "In Stock"
    if (stockNum === 0) {
      status = "Out of Stock"
    } else if (stockNum <= 15) {
      status = "Low Stock"
    }

    onCreate({
      name: name.trim(),
      category,
      price: parseFloat(price),
      stock: stockNum,
      status
    })

    // Reset Form
    setName("")
    setCategory("Coffee")
    setPrice("")
    setStock("")
    setErrors({})
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add Product</DialogTitle>
          <DialogDescription>
            Add a new product item or bean package to your shop's inventory.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Name Field */}
          <div className="space-y-1">
            <Label htmlFor="product-name" className="text-sm font-medium">
              Product Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="product-name"
              placeholder="e.g. Cold Brew Latte"
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
            <Label htmlFor="product-category" className="text-sm font-medium">
              Category
            </Label>
            <div className="relative">
              <select
                id="product-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-9 w-full min-w-0 rounded-4xl border border-input bg-input/30 pl-3 pr-8 py-1 text-base transition-colors outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 md:text-sm appearance-none cursor-pointer"
              >
                <option value="Coffee">Coffee</option>
                <option value="Pastries">Pastries</option>
                <option value="Tea">Tea</option>
                <option value="Beans">Beans</option>
                <option value="Merchandise">Merchandise</option>
              </select>
              <IconChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 pointer-events-none text-muted-foreground" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Price Field */}
            <div className="space-y-1">
              <Label htmlFor="product-price" className="text-sm font-medium">
                Price ($) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="product-price"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={price}
                onChange={(e) => {
                  setPrice(e.target.value)
                  if (errors.price) setErrors({ ...errors, price: "" })
                }}
                className={cn(errors.price && "border-destructive focus-visible:ring-destructive/20")}
              />
              {errors.price && <p className="text-xs text-destructive">{errors.price}</p>}
            </div>

            {/* Stock Field */}
            <div className="space-y-1">
              <Label htmlFor="product-stock" className="text-sm font-medium">
                Stock Qty <span className="text-destructive">*</span>
              </Label>
              <Input
                id="product-stock"
                type="number"
                min="0"
                placeholder="0"
                value={stock}
                onChange={(e) => {
                  setStock(e.target.value)
                  if (errors.stock) setErrors({ ...errors, stock: "" })
                }}
                className={cn(errors.stock && "border-destructive focus-visible:ring-destructive/20")}
              />
              {errors.stock && <p className="text-xs text-destructive">{errors.stock}</p>}
            </div>
          </div>

          {/* Footer Actions */}
          <DialogFooter className="pt-4 border-t gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setName("")
                setCategory("Coffee")
                setPrice("")
                setStock("")
                setErrors({})
                onOpenChange(false)
              }}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer">
              Create Product
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
