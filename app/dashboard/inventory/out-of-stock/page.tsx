"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { IconCircleX, IconSearch, IconShoppingCart } from "@tabler/icons-react"
import Link from "next/link"

interface OutOfStockItem {
  id: string
  name: string
  sku: string
  category: string
  reorderLevel: number
  unit: string
}

export default function OutOfStockPage() {
  const [search, setSearch] = useState("")
  const [items, setItems] = useState<OutOfStockItem[]>([
    { id: "1", name: "Whole Milk 1L", sku: "MK-WHL-01", category: "Dairy", reorderLevel: 30, unit: "packs" },
    { id: "2", name: "Paper Straws (Brown)", sku: "CP-STR-10", category: "Packaging", reorderLevel: 1000, unit: "pcs" },
  ])

  const filtered = items.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.sku.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 bg-slate-50/50 dark:bg-background">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/15 text-red-500 font-bold shadow-2xs">
            <IconCircleX className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Out of Stock Alerts</h1>
            <p className="text-sm text-muted-foreground">Critical items currently at zero quantity</p>
          </div>
        </div>
        <Link href="/dashboard/purchase/create">
          <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer">
            <IconShoppingCart className="h-4 w-4" /> Order Instantly
          </Button>
        </Link>
      </div>

      <Card className="border bg-card shadow-2xs">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Critical Empty Stock</CardTitle>
            <CardDescription>We have {filtered.length} items out of stock today</CardDescription>
          </div>
          <div className="relative w-full sm:w-64">
            <IconSearch className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search critical items..."
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
                  <th className="px-4 py-3 text-right">Current Qty</th>
                  <th className="px-4 py-3 text-right">Reorder Level</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map(item => (
                  <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3.5 font-mono text-xs font-semibold text-red-500">{item.sku}</td>
                    <td className="px-4 py-3.5 font-semibold text-red-600 dark:text-red-400">{item.name}</td>
                    <td className="px-4 py-3.5 text-muted-foreground">{item.category}</td>
                    <td className="px-4 py-3.5 text-right font-bold text-red-600">0 {item.unit}</td>
                    <td className="px-4 py-3.5 text-right font-semibold">{item.reorderLevel} {item.unit}</td>
                    <td className="px-4 py-3.5 text-center">
                      <span className="inline-flex items-center rounded-full bg-red-500/10 px-2.5 py-0.5 text-xs font-medium text-red-600">
                        Out of Stock
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <Link href={`/dashboard/purchase/create?sku=${item.sku}`}>
                        <Button size="sm" className="cursor-pointer h-7 text-xs bg-red-600 hover:bg-red-700 text-white">
                          Order Now
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
