"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { IconTrendingUp, IconSearch, IconAdjustments } from "@tabler/icons-react"
import Link from "next/link"

interface OverstockItem {
  id: string
  name: string
  sku: string
  category: string
  currentQty: number
  maxLimit: number
  unit: string
}

export default function OverstockPage() {
  const [search, setSearch] = useState("")
  const [items, setItems] = useState<OverstockItem[]>([
    { id: "1", name: "Paper Cups 8oz", sku: "CP-PAP-08", category: "Packaging", currentQty: 3200, maxLimit: 2000, unit: "pcs" },
    { id: "2", name: "Plastic Straws", sku: "CP-STR-01", category: "Packaging", currentQty: 5000, maxLimit: 3000, unit: "pcs" },
  ])

  const filtered = items.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.sku.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 bg-slate-50/50 dark:bg-background">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-500 font-bold shadow-2xs">
            <IconTrendingUp className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Overstock Alerts</h1>
            <p className="text-sm text-muted-foreground">Items with excess quantities exceeding maximum stock capacity</p>
          </div>
        </div>
        <Link href="/dashboard/stock/adjustment">
          <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer">
            <IconAdjustments className="h-4 w-4" /> Stock Adjustment
          </Button>
        </Link>
      </div>

      <Card className="border bg-card shadow-2xs">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Overstocked Materials</CardTitle>
            <CardDescription>Track items holding excessive capital in raw storage</CardDescription>
          </div>
          <div className="relative w-full sm:w-64">
            <IconSearch className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search items..."
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
                  <th className="px-4 py-3 text-right">Max Threshold</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map(item => (
                  <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3.5 font-mono text-xs font-semibold">{item.sku}</td>
                    <td className="px-4 py-3.5 font-medium">{item.name}</td>
                    <td className="px-4 py-3.5 text-muted-foreground">{item.category}</td>
                    <td className="px-4 py-3.5 text-right font-bold text-cyan-600">{item.currentQty} {item.unit}</td>
                    <td className="px-4 py-3.5 text-right font-semibold">{item.maxLimit} {item.unit}</td>
                    <td className="px-4 py-3.5 text-center">
                      <span className="inline-flex items-center rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-xs font-medium text-cyan-600">
                        Overstock
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <Link href={`/dashboard/stock/adjustment?sku=${item.sku}`}>
                        <Button size="sm" variant="outline" className="cursor-pointer h-7 text-xs">
                          Adjust
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
