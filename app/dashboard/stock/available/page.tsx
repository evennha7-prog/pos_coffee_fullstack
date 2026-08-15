"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { IconCircleCheck, IconSearch, IconShoppingCart } from "@tabler/icons-react"
import Link from "next/link"
import { getStockItems } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"

export default function AvailableStockPage() {
  const [search, setSearch] = useState("")
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getStockItems()
      .then((data) => {
        // Map StockItem to AvailableStockItem fields
        const mapped = data.map((item) => ({
          id: item.id,
          name: item.name,
          sku: item.sku,
          category: item.category,
          physicalQty: item.currentQty,
          reservedQty: item.reservedQty || 0,
          availableQty: item.currentQty - (item.reservedQty || 0),
          unit: item.unit,
        }))
        setItems(mapped)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error loading available stock:", err)
        setLoading(false)
      })
  }, [])

  const filtered = items.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.sku.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 bg-slate-50/50 dark:bg-background">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-500 font-bold shadow-2xs">
            <IconCircleCheck className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Available Stock</h1>
            <p className="text-sm text-muted-foreground">Net quantity available for customer sales (Physical Count minus Reserved/Catering stock)</p>
          </div>
        </div>
        <Link href="/dashboard/sale/pos">
          <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer">
            <IconShoppingCart className="h-4 w-4" /> Open POS Terminal
          </Button>
        </Link>
      </div>

      <Card className="border bg-card shadow-2xs">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Sellable Stock Balances</CardTitle>
            <CardDescription>Available items ready to fulfill cash register checkouts</CardDescription>
          </div>
          <div className="relative w-full sm:w-64">
            <IconSearch className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search available stock..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 text-sm h-9"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-y bg-muted/40 text-xs font-semibold text-muted-foreground uppercase">
                <tr>
                  <th className="px-4 py-3">SKU</th>
                  <th className="px-4 py-3">Item Name</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3 text-right">Physical Count</th>
                  <th className="px-4 py-3 text-right">Reserved/Allocated</th>
                  <th className="px-4 py-3 text-right">Net Available</th>
                  <th className="px-4 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {loading ? (
                  [...Array(4)].map((_, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-3.5"><Skeleton className="h-4 w-16" /></td>
                      <td className="px-4 py-3.5"><Skeleton className="h-4 w-36" /></td>
                      <td className="px-4 py-3.5"><Skeleton className="h-4 w-20" /></td>
                      <td className="px-4 py-3.5 text-right"><Skeleton className="h-4 w-16 ml-auto" /></td>
                      <td className="px-4 py-3.5 text-right"><Skeleton className="h-4 w-16 ml-auto" /></td>
                      <td className="px-4 py-3.5 text-right"><Skeleton className="h-4 w-16 ml-auto" /></td>
                      <td className="px-4 py-3.5 text-center"><Skeleton className="h-5 w-20 mx-auto rounded-full" /></td>
                    </tr>
                  ))
                ) : (
                  filtered.map(item => (
                    <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3.5 font-mono text-xs font-semibold">{item.sku}</td>
                      <td className="px-4 py-3.5 font-medium">{item.name}</td>
                      <td className="px-4 py-3.5 text-muted-foreground">{item.category}</td>
                      <td className="px-4 py-3.5 text-right font-semibold">{item.physicalQty} {item.unit}</td>
                      <td className="px-4 py-3.5 text-right text-rose-500 font-semibold">{item.reservedQty} {item.unit}</td>
                      <td className="px-4 py-3.5 text-right text-emerald-600 dark:text-emerald-400 font-bold">{item.availableQty} {item.unit}</td>
                      <td className="px-4 py-3.5 text-center">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            item.availableQty > 10
                              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                              : "bg-amber-500/10 text-amber-700 dark:text-amber-400"
                          }`}
                        >
                          {item.availableQty > 10 ? "Available" : "Limited Available"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
