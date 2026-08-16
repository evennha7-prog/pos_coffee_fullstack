"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { IconCalendarX, IconSearch } from "@tabler/icons-react"

interface ExpiredItem {
  id: string
  name: string
  sku: string
  category: string
  qty: number
  unit: string
  expiryDate: string
  removedAt: string
}

export default function ExpiredStockPage() {
  const [search, setSearch] = useState("")
  const [items, setItems] = useState<ExpiredItem[]>([])

  const filtered = items.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.sku.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 bg-slate-50/50 dark:bg-background">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/15 text-violet-500 font-bold shadow-2xs">
            <IconCalendarX className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Expired Items</h1>
            <p className="text-sm text-muted-foreground">Log of fully expired perishables removed from inventory</p>
          </div>
        </div>
      </div>

      <Card className="border bg-card shadow-2xs">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Expired Stock Logs</CardTitle>
            <CardDescription>Review item expiration dates and exact removal logging records</CardDescription>
          </div>
          <div className="relative w-full sm:w-64">
            <IconSearch className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search expired items..."
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
                No expired items logged.
              </div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="border-y bg-muted/40 text-xs font-semibold text-muted-foreground uppercase">
                  <tr>
                    <th className="px-4 py-3">SKU</th>
                    <th className="px-4 py-3">Item Name</th>
                    <th className="px-4 py-3 text-right">Removed Qty</th>
                    <th className="px-4 py-3">Expiration Date</th>
                    <th className="px-4 py-3 text-right">Removal Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filtered.map(item => (
                    <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3.5 font-mono text-xs font-semibold text-red-500">{item.sku}</td>
                      <td className="px-4 py-3.5 font-medium">{item.name}</td>
                      <td className="px-4 py-3.5 text-right font-bold text-red-600">{item.qty} {item.unit}</td>
                      <td className="px-4 py-3.5 font-semibold text-xs text-muted-foreground">{item.expiryDate}</td>
                      <td className="px-4 py-3.5 text-right font-mono text-xs text-muted-foreground">{item.removedAt}</td>
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
