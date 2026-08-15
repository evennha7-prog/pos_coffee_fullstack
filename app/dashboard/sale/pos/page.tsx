"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  IconCoffee,
  IconPlus,
  IconMinus,
  IconTrash,
  IconQrcode,
  IconCreditCard,
  IconCash,
  IconCheck,
  IconSearch,
  IconLoader2,
} from "@tabler/icons-react"
import PaymentModal from "./Payment"
import InvoiceReceipt from "./Invoice"

interface POSItem {
  id: number
  name: string
  category: string
  price: number
  icon?: string
  stock?: number
}

interface CartItem extends POSItem {
  qty: number
}

export default function POSTerminalPage() {
  const [categories, setCategories] = useState<string[]>(["All", "Coffee", "Tea", "Pastries", "Beans"])
  const [activeCategory, setActiveCategory] = useState("All")
  const [menuItems, setMenuItems] = useState<POSItem[]>([])
  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState<CartItem[]>([])
  const [search, setSearch] = useState("")

  // Modal States
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false)
  const [paymentData, setPaymentData] = useState<any>(null)
  const [invoiceNumber, setInvoiceNumber] = useState("INV-000001")

  // Load menu items & categories from API
  const loadData = async () => {
    try {
      setLoading(true)
      const [prodRes, catRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/categories")
      ])
      const prodData = await prodRes.json()
      const catData = await catRes.json()

      if (prodData.success) {
        setMenuItems(prodData.data)
      }
      if (catData.success) {
        const catNames = ["All", ...catData.data.map((c: any) => c.name)]
        setCategories(catNames)
      }
    } catch (error) {
      console.error("Failed to fetch POS data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const filteredItems = menuItems.filter((item) => {
    const matchesCat = activeCategory === "All" || item.category.toLowerCase() === activeCategory.toLowerCase()
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase())
    return matchesCat && matchesSearch
  })

  const addToCart = (item: POSItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id)
      if (existing) {
        return prev.map((c) => (c.id === item.id ? { ...c, qty: c.qty + 1 } : c))
      }
      return [...prev, { ...item, qty: 1 }]
    })
  }

  const updateQty = (id: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((c) => {
          if (c.id === id) {
            const newQty = c.qty + delta
            return newQty > 0 ? { ...c, qty: newQty } : null
          }
          return c
        })
        .filter(Boolean) as CartItem[]
    )
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0)
  const tax = subtotal * 0.05
  const totalUSD = subtotal + tax
  const totalKHR = Math.round(totalUSD * 4100)

  const handleCheckout = () => {
    if (cart.length === 0) return
    setIsPaymentOpen(true)
  }

  const handlePaymentSave = async (data: any) => {
    try {
      const salePayload = {
        items: cart.map(c => ({ id: c.id, name: c.name, category: c.category, price: c.price, qty: c.qty })),
        subtotal,
        tax,
        totalUSD,
        totalKHR,
        paymentMethod: data.method || "Cash",
        customerName: data.customerName || "Walk-in Customer",
      }

      const res = await fetch("/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(salePayload),
      })
      const result = await res.json()

      if (result.success) {
        setInvoiceNumber(result.data.invoiceNumber)
        setPaymentData(data)
        setIsPaymentOpen(false)
        setIsInvoiceOpen(true)
        // Refresh product stock
        loadData()
      }
    } catch (err) {
      console.error("Failed to process sale:", err)
    }
  }

  const handleInvoiceClose = () => {
    setIsInvoiceOpen(false)
    setCart([])
  }

  return (
    <div className="flex flex-1 flex-col lg:flex-row gap-6 p-4 md:p-6 bg-slate-50/50 dark:bg-background min-h-[calc(100vh-4rem)]">
      {/* Left Side: Category Tabs & Product Items Grid */}
      <div className="flex-1 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/15 text-purple-500 font-bold shadow-2xs">
              <IconCoffee className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">POS Order Terminal</h1>
              <p className="text-sm text-muted-foreground">Select products to add to current order</p>
            </div>
          </div>
          <div className="relative w-full sm:w-64">
            <IconSearch className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search item..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 text-sm h-9"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={activeCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(cat)}
              className="rounded-full text-xs font-semibold cursor-pointer"
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground gap-2">
            <IconLoader2 className="h-6 w-6 animate-spin text-primary" />
            <span>Loading menu from backend...</span>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            No items available in this category.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredItems.map((item) => (
              <Card
                key={item.id}
                onClick={() => addToCart(item)}
                className="group cursor-pointer border hover:border-primary/50 hover:shadow-md transition-all active:scale-[0.98] overflow-hidden"
              >
                <CardContent className="p-4 flex flex-col items-center text-center space-y-3">
                  <div className="h-16 w-16 rounded-2xl bg-amber-500/10 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                    {item.icon || "☕"}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm line-clamp-1">{item.name}</h3>
                    <p className="text-xs text-muted-foreground">{item.category}</p>
                  </div>
                  <div className="w-full flex items-center justify-between pt-2 border-t text-sm">
                    <span className="font-bold text-primary">${item.price.toFixed(2)}</span>
                    <span className="text-[11px] text-muted-foreground">Stock: {item.stock ?? 0}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Right Side: Current Cart & Order Summary */}
      <div className="w-full lg:w-96 flex flex-col">
        <Card className="flex flex-col h-full border bg-card shadow-sm">
          <CardHeader className="pb-3 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Current Order</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCart([])}
                disabled={cart.length === 0}
                className="text-xs text-destructive hover:bg-destructive/10 h-8 px-2"
              >
                Clear All
              </Button>
            </div>
            <CardDescription>
              {cart.reduce((sum, item) => sum + item.qty, 0)} item(s) selected
            </CardDescription>
          </CardHeader>

          {/* Cart items list */}
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[220px] max-h-[360px]">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground space-y-2 py-10">
                <IconCoffee className="h-10 w-10 opacity-30" />
                <p className="text-sm">No items in the order</p>
                <p className="text-xs">Click items on the left to start billing</p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-muted/40 border border-border/50 text-sm"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="text-xl shrink-0">{item.icon || "☕"}</div>
                    <div className="truncate">
                      <p className="font-medium text-xs truncate">{item.name}</p>
                      <p className="text-[11px] text-muted-foreground">
                        ${item.price.toFixed(2)} × {item.qty}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-6 w-6 rounded-md cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation()
                        updateQty(item.id, -1)
                      }}
                    >
                      <IconMinus className="h-3 w-3" />
                    </Button>
                    <span className="w-5 text-center text-xs font-semibold">{item.qty}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-6 w-6 rounded-md cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation()
                        updateQty(item.id, 1)
                      }}
                    >
                      <IconPlus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>

          {/* Pricing Calculation Summary */}
          <div className="p-4 border-t bg-muted/20 space-y-2 text-xs">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Tax (5%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-foreground pt-2 border-t">
              <span>Total USD</span>
              <span className="text-base text-primary">${totalUSD.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground font-mono">
              <span>Total KHR (៛)</span>
              <span>៛{totalKHR.toLocaleString()}</span>
            </div>

            <Button
              className="w-full mt-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-5 cursor-pointer"
              disabled={cart.length === 0}
              onClick={handleCheckout}
            >
              Charge ${totalUSD.toFixed(2)}
            </Button>
          </div>
        </Card>
      </div>

      {/* Payment and Invoice Modals */}
      <PaymentModal
        isOpen={isPaymentOpen}
        onOpenChange={setIsPaymentOpen}
        totalUSD={totalUSD}
        totalKHR={totalKHR}
        onSave={handlePaymentSave}
      />

      <InvoiceReceipt
        isOpen={isInvoiceOpen}
        onOpenChange={setIsInvoiceOpen}
        customer={paymentData?.customer || "Walk-in Customer"}
        saleBy="Cashier"
        invoiceNumber={invoiceNumber}
        cartItems={cart}
        totalUSD={totalUSD}
        totalKHR={totalKHR}
        onClose={handleInvoiceClose}
      />
    </div>
  )
}
