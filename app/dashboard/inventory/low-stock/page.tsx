"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { IconAlertTriangle, IconSearch, IconShoppingCart, IconLoader2 } from "@tabler/icons-react"
import Link from "next/link"
import { getProducts, Product } from "@/lib/api"

export default function LowStockPage() {
  const [search, setSearch] = useState("")
  const [items, setItems] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLowStock = async () => {
      try {
        setLoading(true)
        const products = await getProducts()
        const lowStock = products.filter(p => {
          const s = p.current_stock ?? p.stock ?? 0
          return s > 0 && s < 15
        })
        setItems(lowStock)
      } catch (error) {
        console.error("Failed to load low stock products:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchLowStock()
  }, [])

  const filtered = items.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.code.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 bg-slate-50/50 dark:bg-background">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-500 font-bold shadow-2xs">
            <IconAlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Low Stock Alerts</h1>
            <p className="text-sm text-muted-foreground">Live items in MySQL with stock levels below 15 units</p>
          </div>
        </div>
        <Link href="/dashboard/purchase/create">
          <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer">
            <IconShoppingCart className="h-4 w-4" /> Create Purchase Order
          </Button>
        </Link>
      </div>

      <Card className="border bg-card shadow-2xs">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Low Stock Items</CardTitle>
            <CardDescription>{filtered.length} item(s) currently need replenishment</CardDescription>
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
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12 text-muted-foreground gap-2">
                <IconLoader2 className="h-5 w-5 animate-spin text-primary" />
                <span>Checking stock levels in MySQL...</span>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground font-semibold">
                No low stock alerts! All items have healthy inventory levels.
              </div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="border-y bg-muted/40 text-xs font-semibold text-muted-foreground uppercase">
                  <tr>
                    <th className="px-4 py-3">Code</th>
                    <th className="px-4 py-3">Item Name</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3 text-right">Current Stock</th>
                    <th className="px-4 py-3 text-right">Reorder Threshold</th>
                    <th className="px-4 py-3 text-center">Status</th>
                    <th className="px-4 py-3 text-right">Replenish</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filtered.map(item => (
                    <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3.5 font-mono text-xs font-semibold">{item.code}</td>
                      <td className="px-4 py-3.5 font-medium flex items-center gap-2">
                        <span>{item.image_url || item.icon || "☕"}</span>
                        <span>{item.name}</span>
                      </td>
                      <td className="px-4 py-3.5 text-muted-foreground">{item.categoryName || item.category || "General"}</td>
                      <td className="px-4 py-3.5 text-right font-bold text-amber-600">{item.current_stock ?? item.stock ?? 0} pcs</td>
                      <td className="px-4 py-3.5 text-right font-semibold">15 pcs</td>
                      <td className="px-4 py-3.5 text-center">
                        <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-600">
                          Low Stock
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <Link href={`/dashboard/purchase/create?code=${item.code}`}>
                          <Button size="sm" variant="outline" className="cursor-pointer h-7 text-xs">
                            Reorder
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
