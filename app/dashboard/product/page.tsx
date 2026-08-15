"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { IconPlus, IconSearch, IconEdit, IconTrash, IconCoffee, IconLoader2 } from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import CreateProduct from "./CreateProduct"
import EditProduct from "./EditProduct"

interface Product {
  id: number
  name: string
  category: string
  price: number
  stock: number
  status: string
  icon?: string
}

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  // Fetch products from Next.js Backend API
  const fetchProducts = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/products")
      const result = await res.json()
      if (result.success) {
        setProducts(result.data)
      }
    } catch (error) {
      console.error("Failed to load products:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  // Filter products based on search query
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Handle product creation via API
  const handleCreate = async (newProduct: Omit<Product, "id">) => {
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      })
      const result = await res.json()
      if (result.success) {
        setProducts((prev) => [...prev, result.data])
      }
    } catch (error) {
      console.error("Failed to create product:", error)
    }
  }

  // Handle product update via API
  const handleSave = async (updatedProduct: Product) => {
    try {
      const res = await fetch(`/api/products/${updatedProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProduct),
      })
      const result = await res.json()
      if (result.success) {
        setProducts((prev) =>
          prev.map((p) => (p.id === updatedProduct.id ? result.data : p))
        )
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
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      })
      const result = await res.json()
      if (result.success) {
        setProducts((prev) => prev.filter((p) => p.id !== id))
      }
    } catch (error) {
      console.error("Failed to delete product:", error)
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 bg-slate-50/50 dark:bg-background">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/15 text-orange-500 font-bold shadow-2xs">
            <IconCoffee className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Product Management</h1>
            <p className="text-sm text-muted-foreground">Manage your coffee menu items and live backend inventory</p>
          </div>
        </div>
        <Button 
          onClick={() => setIsCreateOpen(true)}
          className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
        >
          <IconPlus className="h-4 w-4" /> Add Product
        </Button>
      </div>

      <Card className="border bg-card shadow-2xs">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Products Inventory</CardTitle>
            <CardDescription>
              Total {filteredProducts.length} product{filteredProducts.length !== 1 && "s"} found
            </CardDescription>
          </div>
          <div className="relative w-full sm:w-64">
            <IconSearch className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search product..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 text-sm h-9" 
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12 text-muted-foreground gap-2">
                <IconLoader2 className="h-5 w-5 animate-spin text-primary" />
                <span>Loading products from API...</span>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No products found matching "{searchQuery}"
              </div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="border-y bg-muted/40 text-xs font-medium text-muted-foreground uppercase">
                  <tr>
                    <th className="px-4 py-3">Product Name</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Stock Qty</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3.5 font-medium flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
                          <IconCoffee className="h-4 w-4" />
                        </div>
                        <span>{p.name}</span>
                      </td>
                      <td className="px-4 py-3.5 text-muted-foreground">{p.category}</td>
                      <td className="px-4 py-3.5 font-semibold text-foreground">
                        ${p.price.toFixed(2)}
                      </td>
                      <td className="px-4 py-3.5 text-muted-foreground font-mono">{p.stock}</td>
                      <td className="px-4 py-3.5">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                            p.status === "In Stock" && "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
                            p.status === "Low Stock" && "bg-amber-500/10 text-amber-700 dark:text-amber-400",
                            p.status === "Out of Stock" && "bg-rose-500/10 text-rose-700 dark:text-rose-400"
                          )}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 cursor-pointer"
                          onClick={() => {
                            setEditingProduct(p)
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
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Create Product Modal */}
      <CreateProduct 
        isOpen={isCreateOpen} 
        onOpenChange={setIsCreateOpen} 
        onCreate={handleCreate} 
      />

      {/* Edit Product Modal */}
      <EditProduct 
        isOpen={isEditOpen} 
        onOpenChange={setIsEditOpen} 
        product={editingProduct}
        onSave={handleSave} 
      />
    </div>
  )
}
