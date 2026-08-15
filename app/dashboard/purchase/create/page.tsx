"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { 
  IconPlus, 
  IconTrash, 
  IconArrowLeft, 
  IconChevronDown, 
  IconSearch, 
  IconCoffee 
} from "@tabler/icons-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface PurchaseItem {
  code: string
  name: string
  price: number
  qty: number
  icon: string
}

interface ProductDetail {
  code: string
  name: string
  price: number
  icon: string
}

const AVAILABLE_PRODUCTS: ProductDetail[] = [
  { code: "00001", name: "Iced Caramel Macchiato", price: 18000, icon: "☕" },
  { code: "00002", name: "Double Shot Espresso", price: 12000, icon: "☕" },
  { code: "00003", name: "Butter Croissant", price: 14000, icon: "🥐" },
  { code: "00004", name: "Matcha Green Tea Latte", price: 19000, icon: "🍵" },
  { code: "00005", name: "Arabica Whole Beans (250g)", price: 56000, icon: "📦" },
  { code: "00006", name: "Fresh Dairy Milk (1L)", price: 8000, icon: "🥛" },
  { code: "00007", name: "Eco Paper Cups (50pcs)", price: 15000, icon: "🥤" },
]

export default function CreatePurchasePage() {
  const router = useRouter()
  
  // Import Product Form State
  const [supplier, setSupplier] = useState("")
  const [invoiceNumber, setInvoiceNumber] = useState("")
  const [importDate, setImportDate] = useState("")
  const [status, setStatus] = useState("")
  const [note, setNote] = useState("")

  // Product Details Selector State
  const [productCode, setProductCode] = useState("")
  const [selectedProduct, setSelectedProduct] = useState<ProductDetail | null>(null)
  const [quantity, setQuantity] = useState("1")
  const [unitPrice, setUnitPrice] = useState("0")

  // Selected Purchase Items List
  const [items, setItems] = useState<PurchaseItem[]>([])

  // Product Selection Dialog State
  const [isProductPickerOpen, setIsProductPickerOpen] = useState(false)
  const [dialogSearchQuery, setDialogSearchQuery] = useState("")

  // Validation state
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  // Format Riel currency helper
  const formatRiel = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value) + "៛"
  }

  // Calculate current subtotal for the selector
  const selectorTotal = (parseFloat(quantity) || 0) * (parseFloat(unitPrice) || 0)

  // Handle auto-population on product selection
  const handleSelectProduct = (prod: ProductDetail) => {
    setSelectedProduct(prod)
    setProductCode(prod.code)
    setUnitPrice(prod.price.toString())
    setIsProductPickerOpen(false)
  }

  // Add Item to Purchase Table
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault()
    if (!productCode.trim()) return

    const qtyVal = parseInt(quantity) || 0
    const priceVal = parseFloat(unitPrice) || 0

    if (qtyVal <= 0 || priceVal < 0) return

    // Find if product name exists
    const nameVal = selectedProduct ? selectedProduct.name : `Product ${productCode}`
    const iconVal = selectedProduct ? selectedProduct.icon : "📦"

    // Check if item already added
    const existingIndex = items.findIndex(item => item.code === productCode)
    if (existingIndex > -1) {
      const updated = [...items]
      updated[existingIndex].qty += qtyVal
      setItems(updated)
    } else {
      setItems([...items, { code: productCode, name: nameVal, price: priceVal, qty: qtyVal, icon: iconVal }])
    }

    // Reset selector inputs
    setProductCode("")
    setSelectedProduct(null)
    setQuantity("1")
    setUnitPrice("0")
  }

  // Remove Item from Table
  const handleRemoveItem = (code: string) => {
    setItems(items.filter(item => item.code !== code))
  }

  // Calculate Total Purchase Sum
  const totalPurchaseSum = items.reduce((sum, item) => sum + item.qty * item.price, 0)

  // Submit Purchase
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Simple validation check
    const errors: Record<string, string> = {}
    if (!supplier) errors.supplier = "Supplier is required"
    if (!invoiceNumber.trim()) errors.invoiceNumber = "Invoice number is required"
    if (!importDate) errors.importDate = "Import date is required"
    if (!status) errors.status = "Status is required"
    if (items.length === 0) errors.items = "Please add at least one product"

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      if (errors.items) alert(errors.items)
      return
    }

    alert("Purchase Order created successfully!")
    router.push("/dashboard/purchase/list")
  }

  // Filtered list for Dialog picker
  const filteredProducts = AVAILABLE_PRODUCTS.filter(p => 
    p.name.toLowerCase().includes(dialogSearchQuery.toLowerCase()) ||
    p.code.includes(dialogSearchQuery)
  )

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 bg-slate-50/50 dark:bg-background">
      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Create Purchase</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card 1: Import Product */}
        <Card className="border bg-card shadow-xs rounded-2xl">
          <CardContent className="p-6 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-foreground border-b-2 border-amber-500/80 w-fit pb-1">
                Import Product
              </h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
              {/* Supplier Select */}
              <div className="space-y-2">
                <Label htmlFor="supplier" className="text-sm font-medium">
                  Supplier
                </Label>
                <div className="relative">
                  <select
                    id="supplier"
                    value={supplier}
                    onChange={(e) => {
                      setSupplier(e.target.value)
                      if (formErrors.supplier) setFormErrors({ ...formErrors, supplier: "" })
                    }}
                    className={cn(
                      "h-10 w-full rounded-xl border border-input bg-input/20 pl-3 pr-8 py-2 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 appearance-none cursor-pointer",
                      formErrors.supplier && "border-destructive focus-visible:ring-destructive/20"
                    )}
                  >
                    <option value="">Select supplier</option>
                    <option value="Highland Coffee Beans Co.">Highland Coffee Beans Co.</option>
                    <option value="Fresh Dairy Milk Supplies">Fresh Dairy Milk Supplies</option>
                    <option value="Artisan Bakery Wholesales">Artisan Bakery Wholesales</option>
                    <option value="Eco Packaging Cambodia">Eco Packaging Cambodia</option>
                  </select>
                  <IconChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 pointer-events-none text-muted-foreground" />
                </div>
                {formErrors.supplier && <p className="text-xs text-destructive">{formErrors.supplier}</p>}
              </div>

              {/* Invoice Number */}
              <div className="space-y-2">
                <Label htmlFor="invoice-number" className="text-sm font-medium">
                  Invoice Number
                </Label>
                <Input
                  id="invoice-number"
                  placeholder="Enter invoice number"
                  value={invoiceNumber}
                  onChange={(e) => {
                    setInvoiceNumber(e.target.value)
                    if (formErrors.invoiceNumber) setFormErrors({ ...formErrors, invoiceNumber: "" })
                  }}
                  className={cn(
                    "h-10 rounded-xl",
                    formErrors.invoiceNumber && "border-destructive focus-visible:ring-destructive/20"
                  )}
                />
                {formErrors.invoiceNumber && <p className="text-xs text-destructive">{formErrors.invoiceNumber}</p>}
              </div>

              {/* Import Date */}
              <div className="space-y-2">
                <Label htmlFor="import-date" className="text-sm font-medium">
                  Import Date
                </Label>
                <Input
                  id="import-date"
                  type="date"
                  value={importDate}
                  onChange={(e) => {
                    setImportDate(e.target.value)
                    if (formErrors.importDate) setFormErrors({ ...formErrors, importDate: "" })
                  }}
                  className={cn(
                    "h-10 rounded-xl",
                    formErrors.importDate && "border-destructive focus-visible:ring-destructive/20"
                  )}
                />
                {formErrors.importDate && <p className="text-xs text-destructive">{formErrors.importDate}</p>}
              </div>

              {/* Status Select */}
              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-medium">
                  Status
                </Label>
                <div className="relative">
                  <select
                    id="status"
                    value={status}
                    onChange={(e) => {
                      setStatus(e.target.value)
                      if (formErrors.status) setFormErrors({ ...formErrors, status: "" })
                    }}
                    className={cn(
                      "h-10 w-full rounded-xl border border-input bg-input/20 pl-3 pr-8 py-2 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 appearance-none cursor-pointer",
                      formErrors.status && "border-destructive focus-visible:ring-destructive/20"
                    )}
                  >
                    <option value="">Select Purchase Status</option>
                    <option value="Received">Received</option>
                    <option value="Pending">Pending</option>
                    <option value="Ordered">Ordered</option>
                  </select>
                  <IconChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 pointer-events-none text-muted-foreground" />
                </div>
                {formErrors.status && <p className="text-xs text-destructive">{formErrors.status}</p>}
              </div>
            </div>

            {/* Note Textarea */}
            <div className="space-y-2 max-w-md">
              <Label htmlFor="note" className="text-sm font-medium">
                Note
              </Label>
              <textarea
                id="note"
                placeholder="Type shipping address..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full min-h-[90px] rounded-2xl border border-input bg-input/10 px-3 py-2 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 placeholder:text-muted-foreground resize-none"
              />
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Product Details */}
        <Card className="border bg-card shadow-xs rounded-2xl">
          <CardContent className="p-6 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-foreground border-b-2 border-amber-500/80 w-fit pb-1">
                Product Details
              </h2>
            </div>

            <div className="grid gap-6 lg:grid-cols-12 items-start">
              {/* Left Form Column (4 cols) */}
              <div className="lg:col-span-4 space-y-4 bg-muted/20 p-5 rounded-2xl border">
                {/* Product Code */}
                <div className="space-y-2">
                  <Label htmlFor="product-code" className="text-sm font-medium">
                    Product Code
                  </Label>
                  <div className="relative">
                    <Input
                      id="product-code"
                      placeholder="e.g 00001"
                      value={productCode}
                      onChange={(e) => {
                        setProductCode(e.target.value)
                        const matched = AVAILABLE_PRODUCTS.find(p => p.code === e.target.value)
                        if (matched) {
                          setSelectedProduct(matched)
                          setUnitPrice(matched.price.toString())
                        } else {
                          setSelectedProduct(null)
                        }
                      }}
                      className="pr-10 h-10 rounded-xl"
                    />
                    <Button
                      type="button"
                      size="icon-xs"
                      onClick={() => setIsProductPickerOpen(true)}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-black hover:bg-black/90 text-white rounded-lg cursor-pointer"
                    >
                      <IconPlus className="h-4 w-4" />
                    </Button>
                  </div>
                  {selectedProduct && (
                    <p className="text-xs text-amber-600 font-medium">
                      Selected: {selectedProduct.icon} {selectedProduct.name}
                    </p>
                  )}
                </div>

                {/* Quantity */}
                <div className="space-y-2">
                  <Label htmlFor="quantity" className="text-sm font-medium">
                    Quantity
                  </Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="h-10 rounded-xl"
                  />
                </div>

                {/* Unit Price */}
                <div className="space-y-2">
                  <Label htmlFor="unit-price" className="text-sm font-medium">
                    Unit Price
                  </Label>
                  <Input
                    id="unit-price"
                    type="number"
                    min="0"
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(e.target.value)}
                    className="h-10 rounded-xl"
                  />
                </div>

                {/* Live selector subtotal */}
                <div className="pt-2 text-sm font-bold text-foreground">
                  Total : <span className="text-red-500">{formatRiel(selectorTotal)}</span>
                </div>

                {/* Add button */}
                <Button
                  type="button"
                  onClick={handleAddItem}
                  disabled={!productCode.trim()}
                  className="w-full bg-black hover:bg-black/90 text-white h-10 rounded-xl cursor-pointer font-bold disabled:opacity-50"
                >
                  Add
                </Button>
              </div>

              {/* Right Table Column (8 cols) */}
              <div className="lg:col-span-8 border rounded-2xl overflow-hidden bg-card">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-muted/40 border-b text-xs font-semibold text-muted-foreground uppercase">
                      <tr>
                        <th className="px-4 py-3">Image</th>
                        <th className="px-4 py-3">Product</th>
                        <th className="px-4 py-3">Unit Price</th>
                        <th className="px-4 py-3">Qty</th>
                        <th className="px-4 py-3">Total</th>
                        <th className="px-4 py-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {items.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-16 text-muted-foreground font-semibold">
                            No Data!
                          </td>
                        </tr>
                      ) : (
                        items.map((item) => (
                          <tr key={item.code} className="hover:bg-muted/30 transition-colors">
                            <td className="px-4 py-3">
                              <span className="text-2xl">{item.icon}</span>
                            </td>
                            <td className="px-4 py-3 font-medium text-foreground">
                              <div>{item.name}</div>
                              <div className="text-xs text-muted-foreground font-mono">Code: {item.code}</div>
                            </td>
                            <td className="px-4 py-3 font-medium text-foreground">
                              {formatRiel(item.price)}
                            </td>
                            <td className="px-4 py-3 font-mono text-muted-foreground">
                              {item.qty}
                            </td>
                            <td className="px-4 py-3 font-bold text-foreground">
                              {formatRiel(item.price * item.qty)}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => handleRemoveItem(item.code)}
                                className="text-destructive cursor-pointer hover:bg-destructive/10 rounded-full h-8 w-8"
                              >
                                <IconTrash className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Table Footer: Total Cost */}
                {items.length > 0 && (
                  <div className="flex items-center justify-between p-4 border-t bg-muted/10 font-bold text-base">
                    <span className="text-muted-foreground">Total Purchase Cost:</span>
                    <span className="text-emerald-600 text-lg">{formatRiel(totalPurchaseSum)}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Link href="/dashboard/purchase/list">
            <Button type="button" variant="outline" className="h-10 rounded-xl cursor-pointer">
              Back
            </Button>
          </Link>
          <Button 
            type="submit" 
            className="bg-black hover:bg-black/90 text-white h-10 rounded-xl cursor-pointer px-6 font-bold"
          >
            Save
          </Button>
        </div>
      </form>

      {/* Product Selection Modal */}
      <Dialog open={isProductPickerOpen} onOpenChange={setIsProductPickerOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Select Product</DialogTitle>
            <DialogDescription>
              Choose a product from the list to add to this purchase.
            </DialogDescription>
          </DialogHeader>

          {/* Search bar inside dialog */}
          <div className="relative mt-2">
            <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search product name or code..."
              value={dialogSearchQuery}
              onChange={(e) => setDialogSearchQuery(e.target.value)}
              className="pl-9 h-10 rounded-xl"
            />
          </div>

          {/* Scrollable list */}
          <div className="max-h-[300px] overflow-y-auto divide-y border rounded-2xl mt-4 bg-muted/10">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No matching products found.
              </div>
            ) : (
              filteredProducts.map((p) => (
                <button
                  key={p.code}
                  type="button"
                  onClick={() => handleSelectProduct(p)}
                  className="flex w-full items-center justify-between p-3.5 hover:bg-muted/40 transition-colors text-left outline-none cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{p.icon}</span>
                    <div>
                      <div className="font-semibold text-sm text-foreground">{p.name}</div>
                      <div className="text-xs text-muted-foreground font-mono">Code: {p.code}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-foreground">{formatRiel(p.price)}</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
