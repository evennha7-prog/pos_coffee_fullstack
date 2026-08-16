"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { IconChevronDown } from "@tabler/icons-react"
import { ImageUpload } from "@/components/image-upload"
import { Product, Category } from "@/lib/api"

interface EditProductProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  product: Product | null
  onSave: (productData: any) => void
  categories?: (Category | string)[]
}

export default function EditProduct({
  isOpen,
  onOpenChange,
  product,
  onSave,
  categories = [],
}: EditProductProps) {
  const [name, setName] = useState("")
  const [category, setCategory] = useState("Meat")
  const [code, setCode] = useState("")
  const [costPrice, setCostPrice] = useState("")
  const [price, setPrice] = useState("")
  const [stock, setStock] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [note, setNote] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (product) {
      setName(product.name || "")
      setCategory(product.categoryName || product.category || "Meat")
      setCode(product.code || "")
      setCostPrice(product.cost_price !== undefined ? product.cost_price.toString() : "")
      setPrice(
        product.sale_price !== undefined
          ? product.sale_price.toString()
          : product.price !== undefined
          ? product.price.toString()
          : ""
      )
      setStock(
        product.current_stock !== undefined
          ? product.current_stock.toString()
          : product.stock !== undefined
          ? product.stock.toString()
          : ""
      )
      setImageUrl(product.image_url || product.icon || "")
      setNote(product.note || "")
      setErrors({})
    }
  }, [product, isOpen])

  const validate = () => {
    const tempErrors: Record<string, string> = {}
    if (!name.trim()) tempErrors.name = "Product name is required"
    if (!price || parseFloat(price) <= 0) tempErrors.price = "Sale price must be greater than 0"
    if (stock === "" || parseInt(stock) < 0) tempErrors.stock = "Stock must be 0 or more"
    setErrors(tempErrors)
    return Object.keys(tempErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    const stockNum = parseInt(stock)
    let status = "In Stock"
    if (stockNum === 0) {
      status = "Out of Stock"
    } else if (stockNum <= 15) {
      status = "Low Stock"
    }

    onSave({
      ...product,
      name: name.trim(),
      category,
      categoryName: category,
      code: code.trim() || product?.code,
      cost_price: costPrice ? parseFloat(costPrice) : 0,
      price: parseFloat(price),
      sale_price: parseFloat(price),
      stock: stockNum,
      current_stock: stockNum,
      status,
      image_url: imageUrl.trim(),
      note: note.trim(),
    })

    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:w-full max-w-[560px] max-h-[92vh] overflow-y-auto p-4 sm:p-6 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-bold text-foreground">
            Edit Product
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-muted-foreground">
            Update this product's image, name, price, SKU code, or inventory stock.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Image Upload / Selection */}
          <ImageUpload
            value={imageUrl}
            onChange={setImageUrl}
            label="Product Photo / Image"
          />

          {/* Name Field */}
          <div className="space-y-1">
            <Label htmlFor="edit-product-name" className="text-xs sm:text-sm font-medium">
              Product Name / ឈ្មោះទំនិញ <span className="text-destructive">*</span>
            </Label>
            <Input
              id="edit-product-name"
              placeholder="e.g. សាច់ជ្រូកបេខុនអាំងផ្សែង or Smoked Bacon"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (errors.name) setErrors({ ...errors, name: "" })
              }}
              className={cn("h-9 sm:h-10 text-xs sm:text-sm rounded-xl", errors.name && "border-destructive focus-visible:ring-destructive/20")}
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Category Field */}
            <div className="space-y-1">
              <Label htmlFor="edit-product-category" className="text-xs sm:text-sm font-medium">
                Category
              </Label>
              <div className="relative">
                <select
                  id="edit-product-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="h-9 sm:h-10 w-full min-w-0 rounded-xl border border-input bg-input/30 pl-3 pr-8 py-1 text-xs sm:text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 appearance-none cursor-pointer"
                >
                  <option value="Meat">Meat / សាច់</option>
                  <option value="Coffee">Coffee / កាហ្វេ</option>
                  <option value="Tea">Tea / តែ</option>
                  <option value="Pastries">Pastries / នំ</option>
                  <option value="Beans">Beans / គ្រាប់កាហ្វេ</option>
                  <option value="Beverages">Beverages / ភេសជ្ជៈ</option>
                  {categories
                    .map((c) => (typeof c === "string" ? c : c.name))
                    .filter(
                      (name) =>
                        !["Meat", "Coffee", "Tea", "Pastries", "Beans", "Beverages", "All"].includes(
                          name
                        )
                    )
                    .map((catName) => (
                      <option key={catName} value={catName}>
                        {catName}
                      </option>
                    ))}
                </select>
                <IconChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 pointer-events-none text-muted-foreground" />
              </div>
            </div>

            {/* Custom SKU Code */}
            <div className="space-y-1">
              <Label htmlFor="edit-product-code" className="text-xs sm:text-sm font-medium">
                SKU / Code
              </Label>
              <Input
                id="edit-product-code"
                placeholder="e.g. 1190 or SKU-1190"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="font-mono text-xs sm:text-sm h-9 sm:h-10 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Original / Cost Price Field */}
            <div className="space-y-1">
              <Label htmlFor="edit-product-cost" className="text-xs sm:text-sm font-medium">
                Cost / Strikethrough ($)
              </Label>
              <Input
                id="edit-product-cost"
                type="number"
                step="0.01"
                min="0"
                placeholder="4.50"
                value={costPrice}
                onChange={(e) => setCostPrice(e.target.value)}
                className="h-9 sm:h-10 text-xs sm:text-sm rounded-xl"
              />
            </div>

            {/* Price Field */}
            <div className="space-y-1">
              <Label htmlFor="edit-product-price" className="text-xs sm:text-sm font-medium">
                Sale Price ($) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="edit-product-price"
                type="number"
                step="0.01"
                min="0"
                placeholder="3.38"
                value={price}
                onChange={(e) => {
                  setPrice(e.target.value)
                  if (errors.price) setErrors({ ...errors, price: "" })
                }}
                className={cn(
                  "h-9 sm:h-10 text-xs sm:text-sm rounded-xl font-bold text-emerald-600",
                  errors.price && "border-destructive focus-visible:ring-destructive/20"
                )}
              />
              {errors.price && <p className="text-xs text-destructive">{errors.price}</p>}
            </div>

            {/* Stock Field */}
            <div className="space-y-1">
              <Label htmlFor="edit-product-stock" className="text-xs sm:text-sm font-medium">
                Stock Qty <span className="text-destructive">*</span>
              </Label>
              <Input
                id="edit-product-stock"
                type="number"
                min="0"
                placeholder="170"
                value={stock}
                onChange={(e) => {
                  setStock(e.target.value)
                  if (errors.stock) setErrors({ ...errors, stock: "" })
                }}
                className={cn("h-9 sm:h-10 text-xs sm:text-sm rounded-xl", errors.stock && "border-destructive focus-visible:ring-destructive/20")}
              />
              {errors.stock && <p className="text-xs text-destructive">{errors.stock}</p>}
            </div>
          </div>

          {/* Note / Description */}
          <div className="space-y-1">
            <Label htmlFor="edit-product-note" className="text-xs sm:text-sm font-medium">
              Note / Description
            </Label>
            <Input
              id="edit-product-note"
              placeholder="e.g. 1.2kg per pack, fresh daily"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="h-9 sm:h-10 text-xs sm:text-sm rounded-xl"
            />
          </div>

          {/* Footer Actions */}
          <DialogFooter className="pt-4 border-t flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3 w-full">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="cursor-pointer w-full sm:w-auto h-9 sm:h-10 rounded-xl text-xs sm:text-sm"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer font-semibold w-full sm:w-auto h-9 sm:h-10 rounded-xl text-xs sm:text-sm"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
