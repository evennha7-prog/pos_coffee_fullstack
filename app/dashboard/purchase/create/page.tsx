"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { 
  IconPlus, 
  IconTrash, 
  IconChevronDown, 
  IconSearch, 
  IconCoffee,
  IconLoader2 
} from "@tabler/icons-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { getSuppliers, getProducts, createPurchase, Supplier, Product } from "@/lib/api"

interface SelectedItem {
  product_id: number
  code: string
  name: string
  price: number
  qty: number
  icon: string
}

export default function CreatePurchasePage() {
  const router = useRouter()
  
  // Data from backend
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [availableProducts, setAvailableProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  // Form State
  const [supplierId, setSupplierId] = useState<string>("")
  const [invoiceNumber, setInvoiceNumber] = useState(`PO-${Date.now().toString().slice(-6)}`)
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split("T")[0])
  const [status, setStatus] = useState<"received" | "ordered" | "pending">("received")
  const [note, setNote] = useState("")

  // Product Selector State
  const [productCode, setProductCode] = useState("")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState("10")
  const [unitPrice, setUnitPrice] = useState("0")

  // Selected Purchase Items List
  const [items, setItems] = useState<SelectedItem[]>([])

  // Product Picker Dialog
  const [isProductPickerOpen, setIsProductPickerOpen] = useState(false)
  const [dialogSearchQuery, setDialogSearchQuery] = useState("")
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const initData = async () => {
      try {
        setLoading(true)
        const [sups, prods] = await Promise.all([
          getSuppliers(),
          getProducts(),
        ])
        setSuppliers(sups)
        setAvailableProducts(prods)
        if (sups.length > 0) {
          setSupplierId(String(sups[0].id))
        }
      } catch (err) {
        console.error("Failed to load purchase prerequisites:", err)
      } finally {
        setLoading(false)
      }
    }
    initData()
  }, [])

  const selectorTotal = (parseFloat(quantity) || 0) * (parseFloat(unitPrice) || 0)

  const handleSelectProduct = (prod: Product) => {
    setSelectedProduct(prod)
    setProductCode(prod.code)
    setUnitPrice(String(prod.cost_price || 0))
    setIsProductPickerOpen(false)
  }

  // Add Item to Purchase Table
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault()
    if (!productCode.trim()) return

    const qtyVal = parseInt(quantity) || 0
    const priceVal = parseFloat(unitPrice) || 0

    if (qtyVal <= 0 || priceVal < 0) return

    const prod = selectedProduct || availableProducts.find(p => p.code === productCode)
    if (!prod) {
      alert("Please select a valid product!")
      return
    }

    const existingIndex = items.findIndex(item => item.product_id === prod.id)
    if (existingIndex > -1) {
      const updated = [...items]
      updated[existingIndex].qty += qtyVal
      updated[existingIndex].price = priceVal
      setItems(updated)
    } else {
      setItems([
        ...items,
        {
          product_id: prod.id,
          code: prod.code,
          name: prod.name,
          price: priceVal,
          qty: qtyVal,
          icon: prod.image_url || prod.icon || "☕",
        },
      ])
    }

    setProductCode("")
    setSelectedProduct(null)
    setQuantity("10")
    setUnitPrice("0")
  }

  const handleRemoveItem = (id: number) => {
    setItems(items.filter(item => item.product_id !== id))
  }

  const totalPurchaseSum = items.reduce((sum, item) => sum + item.qty * item.price, 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const errors: Record<string, string> = {}
    if (!supplierId) errors.supplierId = "Supplier is required"
    if (!invoiceNumber.trim()) errors.invoiceNumber = "Invoice number is required"
    if (!purchaseDate) errors.purchaseDate = "Purchase date is required"
    if (items.length === 0) errors.items = "Please add at least one product"

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      if (errors.items) alert(errors.items)
      return
    }

    try {
      setSubmitting(true)
      const res = await createPurchase({
        supplier_id: Number(supplierId),
        invoice_number: invoiceNumber.trim(),
        purchase_date: purchaseDate,
        total_cost: totalPurchaseSum,
        paid_amount: totalPurchaseSum,
        purchase_status: status,
        items: items.map(it => ({
          product_id: it.product_id,
          quantity: it.qty,
          unit_price: it.price,
          total_price: Number((it.qty * it.price).toFixed(2)),
        })),
      })

      if (res.success) {
        alert("Purchase Order created and stock updated successfully!")
        router.push("/dashboard/purchase/list")
      } else {
        alert(res.error || "Failed to create purchase order.")
      }
    } catch (err: any) {
      console.error("Purchase submit error:", err)
      alert(err.message || "Failed to submit purchase order.")
    } finally {
      setSubmitting(false)
    }
  }

  const filteredProducts = availableProducts.filter(p => 
    p.name.toLowerCase().includes(dialogSearchQuery.toLowerCase()) ||
    p.code.includes(dialogSearchQuery)
  )

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 bg-slate-50/50 dark:bg-background">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Create Purchase Order</h1>
        <p className="text-sm text-muted-foreground">Import stock inventory from suppliers into MySQL database</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground gap-2">
          <IconLoader2 className="h-6 w-6 animate-spin text-primary" />
          <span>Loading supplier and product data...</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Card 1: Import Details */}
          <Card className="border bg-card shadow-xs rounded-2xl">
            <CardContent className="p-6 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-foreground border-b-2 border-amber-500/80 w-fit pb-1">
                  Supplier & Invoice Info
                </h2>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
                {/* Supplier Select */}
                <div className="space-y-2">
                  <Label htmlFor="supplier" className="text-sm font-medium">
                    Supplier <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <select
                      id="supplier"
                      value={supplierId}
                      onChange={(e) => {
                        setSupplierId(e.target.value)
                        if (formErrors.supplierId) setFormErrors({ ...formErrors, supplierId: "" })
                      }}
                      className={cn(
                        "h-10 w-full rounded-xl border border-input bg-input/20 pl-3 pr-8 py-2 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 appearance-none cursor-pointer",
                        formErrors.supplierId && "border-destructive focus-visible:ring-destructive/20"
                      )}
                    >
                      <option value="">Select supplier</option>
                      {suppliers.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.business_name || s.businessName} ({s.name})
                        </option>
                      ))}
                    </select>
                    <IconChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 pointer-events-none text-muted-foreground" />
                  </div>
                </div>

                {/* Invoice Number */}
                <div className="space-y-2">
                  <Label htmlFor="invoice-number" className="text-sm font-medium">
                    Invoice Number <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="invoice-number"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    className="h-10 rounded-xl"
                  />
                </div>

                {/* Import Date */}
                <div className="space-y-2">
                  <Label htmlFor="import-date" className="text-sm font-medium">
                    Purchase Date <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="import-date"
                    type="date"
                    value={purchaseDate}
                    onChange={(e) => setPurchaseDate(e.target.value)}
                    className="h-10 rounded-xl"
                  />
                </div>

                {/* Status Select */}
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-sm font-medium">
                    Stock Status
                  </Label>
                  <div className="relative">
                    <select
                      id="status"
                      value={status}
                      onChange={(e) => setStatus(e.target.value as any)}
                      className="h-10 w-full rounded-xl border border-input bg-input/20 pl-3 pr-8 py-2 text-sm transition-colors outline-none focus-visible:border-ring appearance-none cursor-pointer"
                    >
                      <option value="received">Received (Increases Stock Now)</option>
                      <option value="pending">Pending</option>
                      <option value="ordered">Ordered</option>
                    </select>
                    <IconChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 pointer-events-none text-muted-foreground" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Product Details */}
          <Card className="border bg-card shadow-xs rounded-2xl">
            <CardContent className="p-6 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-foreground border-b-2 border-amber-500/80 w-fit pb-1">
                  Product Items Ingest
                </h2>
              </div>

              <div className="grid gap-6 lg:grid-cols-12 items-start">
                {/* Left Form Column */}
                <div className="lg:col-span-4 space-y-4 bg-muted/20 p-5 rounded-2xl border">
                  <div className="space-y-2">
                    <Label htmlFor="product-code" className="text-sm font-medium">
                      Select Item
                    </Label>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsProductPickerOpen(true)}
                        className="w-full justify-start text-xs font-semibold h-10 rounded-xl"
                      >
                        {selectedProduct ? `${selectedProduct.code} - ${selectedProduct.name}` : "Click to select product..."}
                      </Button>
                    </div>
                  </div>

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
                      className="h-10 rounded-xl font-mono"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="unit-price" className="text-sm font-medium">
                      Unit Cost Price ($)
                    </Label>
                    <Input
                      id="unit-price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={unitPrice}
                      onChange={(e) => setUnitPrice(e.target.value)}
                      className="h-10 rounded-xl font-mono"
                    />
                  </div>

                  <div className="pt-2 text-sm font-bold text-foreground">
                    Subtotal : <span className="text-emerald-600">${selectorTotal.toFixed(2)}</span>
                  </div>

                  <Button
                    type="button"
                    onClick={handleAddItem}
                    disabled={!selectedProduct}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-10 rounded-xl cursor-pointer font-bold disabled:opacity-50"
                  >
                    Add Item
                  </Button>
                </div>

                {/* Right Table Column */}
                <div className="lg:col-span-8 border rounded-2xl overflow-hidden bg-card">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-muted/40 border-b text-xs font-semibold text-muted-foreground uppercase">
                        <tr>
                          <th className="px-4 py-3">Code</th>
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
                              No items added to purchase order yet.
                            </td>
                          </tr>
                        ) : (
                          items.map((item) => (
                            <tr key={item.product_id} className="hover:bg-muted/30 transition-colors">
                              <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{item.code}</td>
                              <td className="px-4 py-3 font-medium text-foreground">
                                <div className="flex items-center gap-2">
                                  <span>{item.icon}</span>
                                  <span>{item.name}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3 font-medium text-foreground font-mono">
                                ${item.price.toFixed(2)}
                              </td>
                              <td className="px-4 py-3 font-mono text-muted-foreground font-bold">
                                {item.qty}
                              </td>
                              <td className="px-4 py-3 font-bold text-emerald-600 font-mono">
                                ${(item.price * item.qty).toFixed(2)}
                              </td>
                              <td className="px-4 py-3 text-right">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleRemoveItem(item.product_id)}
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

                  {items.length > 0 && (
                    <div className="flex items-center justify-between p-4 border-t bg-muted/10 font-bold text-base">
                      <span className="text-muted-foreground">Total Purchase Cost:</span>
                      <span className="text-emerald-600 text-lg">${totalPurchaseSum.toFixed(2)}</span>
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
                Cancel
              </Button>
            </Link>
            <Button 
              type="submit" 
              disabled={submitting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white h-10 rounded-xl cursor-pointer px-6 font-bold gap-2"
            >
              {submitting && <IconLoader2 className="h-4 w-4 animate-spin" />}
              Save Purchase Order
            </Button>
          </div>
        </form>
      )}

      {/* Product Selection Modal */}
      <Dialog open={isProductPickerOpen} onOpenChange={setIsProductPickerOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Select Product from Database</DialogTitle>
            <DialogDescription>
              Choose a product from your MySQL database to add to this purchase.
            </DialogDescription>
          </DialogHeader>

          <div className="relative mt-2">
            <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search product name or code..."
              value={dialogSearchQuery}
              onChange={(e) => setDialogSearchQuery(e.target.value)}
              className="pl-9 h-10 rounded-xl"
            />
          </div>

          <div className="max-h-[300px] overflow-y-auto divide-y border rounded-2xl mt-4 bg-muted/10">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No matching products found.
              </div>
            ) : (
              filteredProducts.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelectProduct(p)}
                  className="flex w-full items-center justify-between p-3.5 hover:bg-muted/40 transition-colors text-left outline-none cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{p.image_url || p.icon || "☕"}</span>
                    <div>
                      <div className="font-semibold text-sm text-foreground">{p.name}</div>
                      <div className="text-xs text-muted-foreground font-mono">Code: {p.code} | Stock: {p.current_stock ?? p.stock ?? 0}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-foreground">${Number(p.cost_price || 0).toFixed(2)}</span>
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
