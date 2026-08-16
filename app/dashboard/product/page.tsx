"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  IconPlus,
  IconSearch,
  IconEdit,
  IconTrash,
  IconBuildingStore,
  IconLoader2,
  IconLayoutGrid,
  IconList,
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  Product,
  Category,
} from "@/lib/api"
import CreateProduct from "./CreateProduct"
import EditProduct from "./EditProduct"
import { POSProductCard } from "@/components/pos-product-card"

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  // Fetch products & categories from MySQL Backend API
  const fetchData = async () => {
    try {
      setLoading(true)
      const [prods, cats] = await Promise.all([
        getProducts(),
        getCategories(),
      ])
      setProducts(prods)
      setCategories(cats)
    } catch (error) {
      console.error("Failed to load products:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Filter products based on search query
  const filteredProducts = products.filter((p) => {
    const nameMatch = p.name.toLowerCase().includes(searchQuery.toLowerCase())
    const catMatch = (p.categoryName || p.category || "").toLowerCase().includes(searchQuery.toLowerCase())
    const codeMatch = (p.code || "").toLowerCase().includes(searchQuery.toLowerCase())
    return nameMatch || catMatch || codeMatch
  })

  // Handle product creation via API
  const handleCreate = async (newProductData: any) => {
    try {
      const matchedCat = categories.find(
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
        setProducts((prev) => [res.result!, ...prev])
      } else {
        alert(res.error || "Failed to create product")
      }
    } catch (error) {
      console.error("Failed to create product:", error)
    }
  }

  // Handle product update via API
  const handleSave = async (updatedProduct: any) => {
    try {
      const matchedCat = categories.find(
        (c) => c.name.toLowerCase() === (updatedProduct.category || "").toLowerCase()
      )

      const payload: Partial<Product> = {
        name: updatedProduct.name,
        category_id: matchedCat ? matchedCat.id : updatedProduct.category_id,
        code: updatedProduct.code,
        sale_price: Number(updatedProduct.price || updatedProduct.sale_price || 0),
        cost_price: Number(updatedProduct.cost_price || 0),
        current_stock: Number(
          updatedProduct.stock !== undefined
            ? updatedProduct.stock
            : updatedProduct.current_stock || 0
        ),
        image_url: updatedProduct.image_url || "",
        note: updatedProduct.note || "",
      }

      const res = await updateProduct(updatedProduct.id, payload)
      if (res.success && res.result) {
        setProducts((prev) =>
          prev.map((p) => (p.id === updatedProduct.id ? res.result! : p))
        )
      } else {
        alert(res.error || "Failed to update product")
      }
    } catch (error) {
      console.error("Failed to update product:", error)
    }
  }

  // Handle product deletion via API
  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Are you sure you want to delete the product "${name}"?`)) {
      return
    }
    try {
      const success = await deleteProduct(id)
      if (success) {
        setProducts((prev) => prev.filter((p) => p.id !== id))
      } else {
        alert("Failed to delete product")
      }
    } catch (error) {
      console.error("Failed to delete product:", error)
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 bg-slate-50/60 dark:bg-background">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-white dark:bg-card p-4 rounded-2xl border border-slate-200/80 dark:border-border shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 font-bold shadow-2xs">
            <IconBuildingStore className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
              Product & Menu Management
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Manage product cards, images, SKU codes, prices, and live MySQL stock
            </p>
          </div>
        </div>
        <Button
          onClick={() => setIsCreateOpen(true)}
          className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer rounded-xl font-semibold h-10"
        >
          <IconPlus className="h-4 w-4" /> Add Product with Image
        </Button>
      </div>

      <Card className="border border-slate-200/90 dark:border-border bg-card shadow-2xs rounded-2xl overflow-hidden">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b bg-slate-50/40 dark:bg-muted/20 pb-4">
          <div>
            <CardTitle className="text-base font-bold">Products Inventory</CardTitle>
            <CardDescription className="text-xs">
              Total {filteredProducts.length} product{filteredProducts.length !== 1 && "s"} found in database
            </CardDescription>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full sm:w-auto">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 dark:bg-muted p-1 rounded-xl border border-border/40">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode("grid")}
                className={cn(
                  "h-7 px-2.5 rounded-lg text-xs font-medium cursor-pointer",
                  viewMode === "grid" && "bg-white dark:bg-card shadow-2xs text-foreground font-semibold"
                )}
              >
                <IconLayoutGrid className="h-3.5 w-3.5 mr-1" /> Grid Cards
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode("table")}
                className={cn(
                  "h-7 px-2.5 rounded-lg text-xs font-medium cursor-pointer",
                  viewMode === "table" && "bg-white dark:bg-card shadow-2xs text-foreground font-semibold"
                )}
              >
                <IconList className="h-3.5 w-3.5 mr-1" /> Table List
              </Button>
            </div>

            <div className="relative w-full sm:w-64">
              <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by name, SKU code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-xs sm:text-sm h-9 rounded-xl w-full"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-3 sm:p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
              <IconLoader2 className="h-8 w-8 animate-spin text-emerald-600" />
              <span className="text-sm font-medium">Loading products from MySQL...</span>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              No products found matching "{searchQuery}"
            </div>
          ) : viewMode === "grid" ? (
            /* Grid View matching POS Card Style */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4">
              {filteredProducts.map((p) => {
                const price = Number(p.sale_price || p.price || 0)
                const stock = Number(
                  p.current_stock !== undefined ? p.current_stock : p.stock || 0
                )
                return (
                  <div key={p.id} className="relative group">
                    <POSProductCard
                      product={p}
                      onSelect={() => {
                        setEditingProduct({
                          ...p,
                          price,
                          stock,
                          category: p.categoryName || p.category || "Meat",
                        })
                        setIsEditOpen(true)
                      }}
                    />
                    {/* Action buttons overlay */}
                    <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-black/60 backdrop-blur-xs p-1 rounded-xl">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-white hover:bg-white/20 cursor-pointer"
                        title="Edit product"
                        onClick={(e) => {
                          e.stopPropagation()
                          setEditingProduct({
                            ...p,
                            price,
                            stock,
                            category: p.categoryName || p.category || "Meat",
                          })
                          setIsEditOpen(true)
                        }}
                      >
                        <IconEdit className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-rose-400 hover:bg-rose-500/20 cursor-pointer"
                        title="Delete product"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(p.id, p.name)
                        }}
                      >
                        <IconTrash className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            /* Table List View */
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-left text-sm">
                <thead className="border-b bg-muted/40 text-xs font-semibold text-muted-foreground uppercase">
                  <tr>
                    <th className="px-4 py-3">Photo & Name</th>
                    <th className="px-4 py-3">SKU Code</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Cost Price</th>
                    <th className="px-4 py-3">Sale Price</th>
                    <th className="px-4 py-3">Stock Qty</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredProducts.map((p) => {
                    const price = Number(p.sale_price || p.price || 0)
                    const costPrice = Number(p.cost_price || 0)
                    const stock = Number(
                      p.current_stock !== undefined ? p.current_stock : p.stock || 0
                    )
                    const status =
                      stock === 0 ? "Out of Stock" : stock <= 15 ? "Low Stock" : "In Stock"

                    const isImageValid = Boolean(
                      p.image_url &&
                        (p.image_url.startsWith("http") ||
                          p.image_url.startsWith("/upload") ||
                          p.image_url.startsWith("/"))
                    )
                    const defaultTableImg =
                      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80"

                    return (
                      <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 font-medium flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg overflow-hidden bg-slate-100 dark:bg-muted shrink-0 border border-slate-200 dark:border-border">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={isImageValid ? p.image_url : defaultTableImg}
                              alt={p.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = defaultTableImg
                              }}
                            />
                          </div>
                          <div>
                            <span className="font-semibold text-foreground">{p.name}</span>
                            {p.note && (
                              <p className="text-xs text-muted-foreground line-clamp-1">{p.note}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                          {p.code ? (p.code.startsWith("SKU-") ? p.code : `SKU-${p.code}`) : `SKU-${p.id}`}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {p.categoryName || p.category || "General"}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                          ${costPrice.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 font-bold text-emerald-600 dark:text-emerald-400 font-sans">
                          ${price.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground font-mono">
                          ចំនួន: {stock}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                              status === "In Stock" &&
                                "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
                              status === "Low Stock" &&
                                "bg-amber-500/10 text-amber-700 dark:text-amber-400",
                              status === "Out of Stock" &&
                                "bg-rose-500/10 text-rose-700 dark:text-rose-400"
                            )}
                          >
                            {status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 cursor-pointer"
                            onClick={() => {
                              setEditingProduct({
                                ...p,
                                price,
                                stock,
                                category: p.categoryName || p.category || "Meat",
                              })
                              setIsEditOpen(true)
                            }}
                          >
                            <IconEdit className="h-4 w-4 text-muted-foreground" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive cursor-pointer"
                            onClick={() => handleDelete(p.id, p.name)}
                          >
                            <IconTrash className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Product Modal with Image Upload */}
      <CreateProduct
        isOpen={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onCreate={handleCreate}
        categories={categories}
      />

      {/* Edit Product Modal with Image Upload */}
      <EditProduct
        isOpen={isEditOpen}
        onOpenChange={setIsEditOpen}
        product={editingProduct}
        onSave={handleSave}
        categories={categories}
      />
    </div>
  )
}
