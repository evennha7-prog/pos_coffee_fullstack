"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { IconLock, IconSearch, IconEye } from "@tabler/icons-react"

interface ReservedStockItem {
  id: string
  name: string
  sku: string
  category: string
  reservedQty: number
  unit: string
  referenceOrder: string
  reservedUntil: string
}

export default function ReservedStockPage() {
  const [search, setSearch] = useState("")
  const [items, setItems] = useState<ReservedStockItem[]>([
    { id: "1", name: "Arabica Coffee Beans", sku: "CB-ARA-01", category: "Coffee Beans", reservedQty: 4, unit: "kg", referenceOrder: "CATERING-9902", reservedUntil: "2026-07-25" },
    { id: "2", name: "Whole Milk 1L", sku: "MK-WHL-01", category: "Dairy", reservedQty: 10, unit: "packs", referenceOrder: "TRANSFER-BR2-04", reservedUntil: "2026-07-24" },
    { id: "3", name: "Caramel Syrup", sku: "SY-CAR-02", category: "Syrups", reservedQty: 2, unit: "bottles", referenceOrder: "CATERING-9902", reservedUntil: "2026-07-25" },
  ])

  const filtered = items.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.sku.toLowerCase().includes(search.toLowerCase()) ||
    item.referenceOrder.toLowerCase().includes(search.toLowerCase())
  )

  const handleRelease = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to release reserved stock for "${name}"?`)) {
      setItems(items.filter(item => item.id !== id))
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 bg-slate-50/50 dark:bg-background">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/15 text-teal-500 font-bold shadow-2xs">
            <IconLock className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Reserved Stock</h1>
            <p className="text-sm text-muted-foreground">Allocated quantities locked for pending events, catering orders, or branch stock transfers</p>
          </div>
        </div>
      </div>

      <Card className="border bg-card shadow-2xs">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Allocated Items</CardTitle>
            <CardDescription>Review locked materials and their corresponding reservation orders</CardDescription>
          </div>
          <div className="relative w-full sm:w-64">
            <IconSearch className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search reference/item..."
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
                  <th className="px-4 py-3 text-right">Locked Quantity</th>
                  <th className="px-4 py-3">Reference Doc</th>
                  <th className="px-4 py-3 text-right">Reserved Until</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map(item => (
                  <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3.5 font-mono text-xs font-semibold">{item.sku}</td>
                    <td className="px-4 py-3.5 font-medium">{item.name}</td>
                    <td className="px-4 py-3.5 text-right font-bold text-teal-600">{item.reservedQty} {item.unit}</td>
                    <td className="px-4 py-3.5 font-semibold text-xs flex items-center gap-1.5 py-4">
                      <span className="bg-indigo-500/10 text-indigo-700 px-2 py-0.5 rounded-sm">{item.referenceOrder}</span>
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono text-xs text-muted-foreground">{item.reservedUntil}</td>
                    <td className="px-4 py-3.5 text-right">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleRelease(item.id, item.name)}
                        className="cursor-pointer h-7 text-xs text-rose-600 hover:bg-rose-500/10"
                      >
                        Release Lock
                      </Button>
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
