"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { IconPackages, IconDownload, IconPrinter, IconAlertTriangle, IconLoader2 } from "@tabler/icons-react"
import { getProducts, Product } from "@/lib/api"

export default function StockReportPage() {
  const [filterStatus, setFilterStatus] = useState("All")
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStock = async () => {
      try {
        setLoading(true)
        const prods = await getProducts()
        setProducts(prods)
      } catch (err) {
        console.error("Failed to load products for stock report:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchStock()
  }, [])

  const filteredInventory = products.filter((item) => {
    const stock = item.current_stock ?? item.stock ?? 0
    const status = stock === 0 ? "Out of Stock" : stock < 15 ? "Low Stock" : "In Stock"
    if (filterStatus === "All") return true
    return status === filterStatus
  })

  const totalInventoryVal = products.reduce((sum, item) => {
    const stock = item.current_stock ?? item.stock ?? 0
    const cost = Number(item.cost_price || item.sale_price || 0)
    return sum + stock * cost
  }, 0)

  const lowStockCount = products.filter((item) => {
    const stock = item.current_stock ?? item.stock ?? 0
    return stock > 0 && stock < 15
  }).length

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 bg-slate-50/50 dark:bg-background">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-500 font-bold shadow-2xs">
            <IconPackages className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Stock & Inventory Report</h1>
            <p className="text-sm text-muted-foreground">Monitor live inventory levels, low stock alerts, and valuation from MySQL</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 cursor-pointer">
            <IconPrinter className="h-4 w-4" /> Print
          </Button>
          <Button size="sm" className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold cursor-pointer">
            <IconDownload className="h-4 w-4" /> Export Stock
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground gap-2">
          <IconLoader2 className="h-6 w-6 animate-spin text-primary" />
          <span>Calculating live stock valuation from MySQL...</span>
        </div>
      ) : (
        <>
          {/* Quick Metrics */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="border bg-card shadow-2xs">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-muted-foreground">Total Stock Inventory Valuation</div>
                  <div className="text-2xl font-bold text-emerald-600 mt-1">${totalInventoryVal.toFixed(2)}</div>
                </div>
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                  <IconPackages className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="border bg-card shadow-2xs">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-muted-foreground">Low Stock Alert Items</div>
                  <div className="text-2xl font-bold text-amber-600 mt-1">{lowStockCount} items need reorder</div>
                </div>
                <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                  <IconAlertTriangle className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Inventory Table */}
          <Card className="border bg-card shadow-2xs">
            <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Stock Inventory Details</CardTitle>
                <CardDescription>Current stock quantities and valuation per item</CardDescription>
              </div>
              <div className="flex gap-2">
                {["All", "In Stock", "Low Stock", "Out of Stock"].map((status) => (
                  <Button
                    key={status}
                    variant={filterStatus === status ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus(status)}
                    className={filterStatus === status ? "bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer" : "cursor-pointer"}
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                {filteredInventory.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground font-semibold">
                    No items found matching selected filter.
                  </div>
                ) : (
                  <table className="w-full text-left text-sm">
                    <thead className="border-y bg-muted/40 text-xs font-medium text-muted-foreground uppercase">
                      <tr>
                        <th className="px-4 py-3">Code</th>
                        <th className="px-4 py-3">Inventory Item</th>
                        <th className="px-4 py-3">Category</th>
                        <th className="px-4 py-3 text-right">Current Stock</th>
                        <th className="px-4 py-3 text-right">Cost Price</th>
                        <th className="px-4 py-3 text-right">Sale Price</th>
                        <th className="px-4 py-3 text-right">Valuation</th>
                        <th className="px-4 py-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filteredInventory.map((row) => {
                        const stock = row.current_stock ?? row.stock ?? 0
                        const cost = Number(row.cost_price || 0)
                        const sale = Number(row.sale_price || row.price || 0)
                        const status = stock === 0 ? "Out of Stock" : stock < 15 ? "Low Stock" : "In Stock"
                        const valuation = stock * (cost || sale)

                        return (
                          <tr key={row.id} className="hover:bg-muted/30">
                            <td className="px-4 py-3.5 font-mono text-xs text-muted-foreground">{row.code}</td>
                            <td className="px-4 py-3.5 font-medium flex items-center gap-2">
                              <span>{row.image_url || row.icon || "☕"}</span>
                              <span>{row.name}</span>
                            </td>
                            <td className="px-4 py-3.5 text-muted-foreground">{row.categoryName || row.category || "General"}</td>
                            <td className="px-4 py-3.5 font-bold font-mono text-right">{stock} pcs</td>
                            <td className="px-4 py-3.5 font-mono text-right">${cost.toFixed(2)}</td>
                            <td className="px-4 py-3.5 font-mono text-right">${sale.toFixed(2)}</td>
                            <td className="px-4 py-3.5 font-semibold text-emerald-600 text-right">${valuation.toFixed(2)}</td>
                            <td className="px-4 py-3.5 text-center">
                              <span
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                  status === "In Stock"
                                    ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                                    : status === "Low Stock"
                                    ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 font-bold animate-pulse"
                                    : "bg-rose-500/10 text-rose-700 dark:text-rose-400"
                                }`}
                              >
                                {status}
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
