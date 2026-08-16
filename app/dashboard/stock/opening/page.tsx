"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { IconPlayerPlay, IconSearch } from "@tabler/icons-react"

interface OpeningStockItem {
  id: string
  name: string
  sku: string
  category: string
  openingQty: number
  unit: string
  recordedDate: string
}

export default function OpeningStockPage() {
  const [search, setSearch] = useState("")
  const [items, setItems] = useState<OpeningStockItem[]>([])

  const filtered = items.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.sku.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 bg-slate-50/50 dark:bg-background">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-500/15 text-slate-500 font-bold shadow-2xs">
            <IconPlayerPlay className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Opening Stock</h1>
            <p className="text-sm text-muted-foreground">Initial raw material stock recorded at the beginning of the period</p>
          </div>
        </div>
      </div>

      <Card className="border bg-card shadow-2xs">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Opening Quantities</CardTitle>
            <CardDescription>Baseline quantities used for periodic balance sheet calculations</CardDescription>
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
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground font-semibold">
                No opening stock records found.
              </div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="border-y bg-muted/40 text-xs font-semibold text-muted-foreground uppercase">
                  <tr>
                    <th className="px-4 py-3">SKU</th>
                    <th className="px-4 py-3">Item Name</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3 text-right">Opening Qty</th>
                    <th className="px-4 py-3 text-right">Unit</th>
                    <th className="px-4 py-3 text-right">Recorded Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filtered.map(item => (
                    <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3.5 font-mono text-xs font-semibold">{item.sku}</td>
                      <td className="px-4 py-3.5 font-medium">{item.name}</td>
                      <td className="px-4 py-3.5 text-muted-foreground">{item.category}</td>
                      <td className="px-4 py-3.5 text-right font-bold text-foreground">{item.openingQty}</td>
                      <td className="px-4 py-3.5 text-right text-muted-foreground text-xs">{item.unit}</td>
                      <td className="px-4 py-3.5 text-right font-mono text-xs text-muted-foreground">{item.recordedDate}</td>
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
