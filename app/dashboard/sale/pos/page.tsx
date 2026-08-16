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
  IconSearch,
  IconLoader2,
  IconAlertCircle,
  IconReceipt,
  IconBuildingStore,
  IconRefresh,
} from "@tabler/icons-react"
import { getProducts, getCategories, createSale, createProduct, Product, Category } from "@/lib/api"
import PaymentModal from "./Payment"
import InvoiceReceipt from "./Invoice"
import { POSProductCard } from "@/components/pos-product-card"
import CreateProduct from "@/app/dashboard/product/CreateProduct"

interface CartItem {
  id: number
  name: string
  categoryName?: string
  price: number
  qty: number
  stock: number
  imageUrl?: string
  icon?: string
  code?: string
}

export default function POSTerminalPage() {
  const [categories, setCategories] = useState<string[]>(["All"])
  const [allCategories, setAllCategories] = useState<Category[]>([])
  const [activeCategory, setActiveCategory] = useState("All")
  const [menuItems, setMenuItems] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState<CartItem[]>([])
  const [search, setSearch] = useState("")
  const [orderError, setOrderError] = useState<string | null>(null)

  // Modal States
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false)
  const [isCreateProductOpen, setIsCreateProductOpen] = useState(false)
  const [paymentData, setPaymentData] = useState<any>(null)
  const [invoiceNumber, setInvoiceNumber] = useState("INV-000001")

  // Load menu items & categories from MySQL Backend API
  const loadData = async () => {
    try {
      setLoading(true)
      setOrderError(null)
      const [prods, cats] = await Promise.all([
        getProducts(),
        getCategories()
      ])

      setMenuItems(prods)
      setAllCategories(cats)
      const catNames = ["All", ...cats.map((c) => c.name)]
      setCategories(catNames)
    } catch (error: any) {
      console.error("Failed to fetch POS data:", error)
      setOrderError("Failed to load products from database.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const filteredItems = menuItems.filter((item) => {
    const itemCat = item.categoryName || item.category || ""
    const matchesCat = activeCategory === "All" || itemCat.toLowerCase() === activeCategory.toLowerCase()
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      (item.code || "").toLowerCase().includes(search.toLowerCase())
    return matchesCat && matchesSearch
  })

  const addToCart = (item: Product) => {
    const currentStock = item.current_stock ?? item.stock ?? 0
    if (currentStock <= 0) {
      alert(`"${item.name}" is currently Out of Stock!`)
      return
    }

    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id)
      if (existing) {
        if (existing.qty + 1 > currentStock) {
          alert(`Cannot add more than available stock (${currentStock})!`)
          return prev
        }
        return prev.map((c) => (c.id === item.id ? { ...c, qty: c.qty + 1 } : c))
      }
      return [
        ...prev,
        {
          id: item.id,
          name: item.name,
          categoryName: item.categoryName || item.category || "General",
          price: Number(item.sale_price || item.price || 0),
          qty: 1,
          stock: currentStock,
          imageUrl: item.image_url || "",
          icon: item.icon || "☕",
          code: item.code,
        },
      ]
    })
  }

  const updateQty = (id: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((c) => {
          if (c.id === id) {
            const newQty = c.qty + delta
            if (newQty > c.stock) {
              alert(`Maximum available stock reached (${c.stock})!`)
              return c
            }
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
      setOrderError(null)
      const salePayload = {
        customer_id: data.customerId || null,
        totalCost: Number(totalUSD.toFixed(2)),
        paidAmount: Number(data.paidUSD || totalUSD),
        items: cart.map((c) => ({
          product_id: c.id,
          quantity: c.qty,
          unit_price: c.price,
          total_price: Number((c.price * c.qty).toFixed(2)),
        })),
      }

      const res = await createSale(salePayload)

      if (res.success && res.result) {
        setInvoiceNumber(res.result.invoice_number || "INV-000001")
        setPaymentData(data)
        setIsPaymentOpen(false)
        setIsInvoiceOpen(true)
        // Refresh live database stock
        loadData()
      } else {
        alert(res.error || "Failed to process sale.")
      }
    } catch (err: any) {
      console.error("Failed to process sale:", err)
      alert(err.message || "Failed to complete transaction.")
    }
  }

  // Handle creating new product with image right inside POS screen
  const handleCreateProduct = async (newProductData: any) => {
    try {
      const matchedCat = allCategories.find(
        (c) => c.name.toLowerCase() === (newProductData.category || "").toLowerCase()
      )

      const payload: Partial<Product> = {
        name: newProductData.name,
        category_id: matchedCat ? matchedCat.id : null,
        code: newProductData.code,
        sale_price: Number(newProductData.price || newProductData.sale_price || 0),
        cost_price: Number(newProductData.cost_price || 0),
        current_stock: Number(newProductData.stock || newProductData.current_stock || 0),
        image_url: newProductData.image_url || "",
        note: newProductData.note || "",
      }

      const res = await createProduct(payload)
      if (res.success && res.result) {
        setMenuItems((prev) => [res.result!, ...prev])
      } else {
        alert(res.error || "Failed to create product")
      }
    } catch (error) {
      console.error("Failed to create product:", error)
    }
  }

  const handleInvoiceClose = () => {
    setIsInvoiceOpen(false)
    setCart([])
  }

  return (
    <div className="flex flex-1 flex-col lg:flex-row gap-6 p-4 md:p-6 bg-slate-50/60 dark:bg-background min-h-[calc(100vh-4rem)]">
      {/* Left Side: Category Tabs, Search Bar & Product Cards Grid */}
      <div className="flex-1 space-y-4">
        {/* Header Bar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-white dark:bg-card p-4 rounded-2xl border border-slate-200/80 dark:border-border shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 font-bold shadow-2xs">
              <IconBuildingStore className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
                POS Order Terminal
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Select items with live image cards to bill customer orders
              </p>
            </div>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-60">
              <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search item, SKU code..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 text-xs sm:text-sm h-9 rounded-xl w-full"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                onClick={() => setIsCreateProductOpen(true)}
                size="sm"
                className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium cursor-pointer rounded-xl h-9 text-xs flex-1 sm:flex-initial shrink-0"
              >
                <IconPlus className="h-4 w-4" /> Add Item
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={loadData}
                title="Refresh menu"
                className="h-9 w-9 rounded-xl shrink-0 cursor-pointer"
              >
                <IconRefresh className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          </div>
        </div>

        {orderError && (
          <div className="flex items-center gap-2 p-3 text-sm text-rose-600 bg-rose-500/10 border border-rose-500/20 rounded-xl">
            <IconAlertCircle className="h-4 w-4 shrink-0" />
            <span>{orderError}</span>
          </div>
        )}

        {/* Category Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const count =
              cat === "All"
                ? menuItems.length
                : menuItems.filter(
                    (i) => (i.categoryName || i.category || "").toLowerCase() === cat.toLowerCase()
                  ).length

            return (
              <Button
                key={cat}
                variant={activeCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full text-xs font-semibold cursor-pointer shrink-0 transition-all ${
                  activeCategory === cat
                    ? "bg-slate-900 text-white dark:bg-emerald-600 shadow-xs"
                    : "bg-white dark:bg-card border-slate-200 dark:border-border hover:bg-slate-100"
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`ml-1.5 text-[10px] px-1.5 py-0.2 rounded-full ${
                    activeCategory === cat
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 dark:bg-muted text-muted-foreground"
                  }`}
                >
                  {count}
                </span>
              </Button>
            )
          })}
        </div>

        {/* Products Grid with New Card Style */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-3">
            <IconLoader2 className="h-8 w-8 animate-spin text-emerald-600" />
            <span className="text-sm font-medium">Loading POS menu from database...</span>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground bg-white dark:bg-card border border-dashed rounded-2xl p-8 space-y-3">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
              <IconSearch className="h-6 w-6" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">No products found</p>
              <p className="text-xs text-muted-foreground">
                Try searching for something else or add a new product with photo
              </p>
            </div>
            <Button
              onClick={() => setIsCreateProductOpen(true)}
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 rounded-xl cursor-pointer"
            >
              <IconPlus className="h-4 w-4" /> Add Product with Image
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4">
            {filteredItems.map((item) => {
              const inCartItem = cart.find((c) => c.id === item.id)
              return (
                <POSProductCard
                  key={item.id}
                  product={item}
                  cartQty={inCartItem?.qty || 0}
                  onSelect={addToCart}
                />
              )
            })}
          </div>
        )}
      </div>

      {/* Right Side: Current Cart & Order Summary */}
      <div className="w-full lg:w-96 flex flex-col shrink-0">
        <Card className="flex flex-col h-full border border-slate-200/90 dark:border-border bg-white dark:bg-card shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="pb-3 border-b bg-slate-50/50 dark:bg-muted/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IconReceipt className="h-5 w-5 text-emerald-600" />
                <CardTitle className="text-base font-bold">Current Order</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCart([])}
                disabled={cart.length === 0}
                className="text-xs text-destructive hover:bg-destructive/10 h-8 px-2 cursor-pointer font-semibold"
              >
                Clear All
              </Button>
            </div>
            <CardDescription className="text-xs">
              {cart.reduce((sum, item) => sum + item.qty, 0)} item(s) in receipt
            </CardDescription>
          </CardHeader>

          {/* Cart items list */}
          <CardContent className="flex-1 overflow-y-auto p-3 space-y-2.5 min-h-[220px] max-h-[380px]">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground space-y-2 py-12">
                <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-muted flex items-center justify-center text-muted-foreground">
                  <IconCoffee className="h-6 w-6 opacity-40" />
                </div>
                <p className="text-sm font-semibold text-foreground">Cart is empty</p>
                <p className="text-xs text-muted-foreground max-w-[200px]">
                  Click on product cards on the left to add items to this order
                </p>
              </div>
            ) : (
              cart.map((item) => {
                const isImageValid = Boolean(
                  item.imageUrl &&
                    (item.imageUrl.startsWith("http") ||
                      item.imageUrl.startsWith("/upload") ||
                      item.imageUrl.startsWith("/"))
                )
                const defaultCartPlaceholder =
                  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80"

                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-muted/40 border border-slate-100 dark:border-border/60 text-sm gap-2 hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      {/* Product Thumbnail */}
                      <div className="h-11 w-11 rounded-lg overflow-hidden bg-slate-200 dark:bg-muted shrink-0 border border-slate-200 dark:border-border">
                        {isImageValid ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = defaultCartPlaceholder
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-lg">
                            {item.icon || "☕"}
                          </div>
                        )}
                      </div>

                      <div className="truncate min-w-0">
                        <p className="font-semibold text-xs text-foreground truncate">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold font-mono">
                          ${item.price.toFixed(2)} × {item.qty} = $
                          {(item.price * item.qty).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 rounded-lg cursor-pointer bg-white dark:bg-card"
                        onClick={(e) => {
                          e.stopPropagation()
                          updateQty(item.id, -1)
                        }}
                      >
                        {item.qty === 1 ? (
                          <IconTrash className="h-3.5 w-3.5 text-destructive" />
                        ) : (
                          <IconMinus className="h-3 w-3" />
                        )}
                      </Button>
                      <span className="w-5 text-center text-xs font-bold font-mono">
                        {item.qty}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 rounded-lg cursor-pointer bg-white dark:bg-card"
                        onClick={(e) => {
                          e.stopPropagation()
                          updateQty(item.id, 1)
                        }}
                      >
                        <IconPlus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )
              })
            )}
          </CardContent>

          {/* Pricing Calculation Summary */}
          <div className="p-4 border-t bg-slate-50/70 dark:bg-muted/20 space-y-2 text-xs">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span className="font-mono font-medium text-foreground">
                ${subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Tax (5%)</span>
              <span className="font-mono font-medium text-foreground">
                ${tax.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm font-bold text-foreground pt-2 border-t">
              <span>Total USD</span>
              <span className="text-lg text-emerald-600 dark:text-emerald-400 font-sans">
                ${totalUSD.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground font-mono">
              <span>Total KHR (៛)</span>
              <span className="font-semibold text-foreground">
                ៛{totalKHR.toLocaleString()}
              </span>
            </div>

            <Button
              className="w-full mt-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-5 text-sm cursor-pointer shadow-md rounded-xl transition-all active:scale-[0.99]"
              disabled={cart.length === 0}
              onClick={handleCheckout}
            >
              Charge ${totalUSD.toFixed(2)} ({totalKHR.toLocaleString()}៛)
            </Button>
          </div>
        </Card>
      </div>

      {/* Quick Add Product with Image Modal */}
      <CreateProduct
        isOpen={isCreateProductOpen}
        onOpenChange={setIsCreateProductOpen}
        onCreate={handleCreateProduct}
        categories={allCategories}
      />

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
