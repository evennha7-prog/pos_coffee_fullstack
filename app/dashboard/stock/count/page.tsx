"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { IconBarcode, IconSearch, IconCheck } from "@tabler/icons-react"

interface StockCountItem {
  id: string
  name: string
  sku: string
  category: string
  systemQty: number
  physicalQty: number
  unit: string
}

export default function StockCountPage() {
  const [search, setSearch] = useState("")
  const [items, setItems] = useState<StockCountItem[]>([
    { id: "1", name: "Arabica Coffee Beans", sku: "CB-ARA-01", category: "Coffee Beans", systemQty: 28, physicalQty: 28, unit: "kg" },
    { id: "2", name: "Robusta Coffee Beans", sku: "CB-ROB-01", category: "Coffee Beans", systemQty: 32, physicalQty: 30, unit: "kg" },
    { id: "3", name: "Whole Milk 1L", sku: "MK-WHL-01", category: "Dairy", systemQty: 48, physicalQty: 48, unit: "packs" },
    { id: "4", name: "Caramel Syrup", sku: "SY-CAR-02", category: "Syrups", systemQty: 14, physicalQty: 15, unit: "bottles" },
  ])

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState<number>(0)

  const handleEdit = (id: string, currentVal: number) => {
    setEditingId(id)
    setEditValue(currentVal)
  }

  const handleSave = (id: string) => {
    setItems(items.map(item => item.id === id ? { ...item, physicalQty: editValue } : item))
    setEditingId(null)
  }

  const filtered = items.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.sku.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 bg-slate-50/50 dark:bg-background">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/15 text-sky-500 font-bold shadow-2xs">
            <IconBarcode className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Stock Count (Physical Inventory)</h1>
            <p className="text-sm text-muted-foreground">Log physical stock counts and compare them with the system quantities to find discrepancies</p>
          </div>
        </div>
      </div>

      <Card className="border bg-card shadow-2xs">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Physical Count Reconciliation</CardTitle>
            <CardDescription>Enter actual quantities counted by staff in the kitchen and warehouse</CardDescription>
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
                  <th className="px-4 py-3 text-right">System Qty</th>
                  <th className="px-4 py-3 text-right">Physical Count</th>
                  <th className="px-4 py-3 text-right">Variance</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map(item => {
                  const variance = item.physicalQty - item.systemQty
                  return (
                    <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3.5 font-mono text-xs font-semibold">{item.sku}</td>
                      <td className="px-4 py-3.5 font-medium">{item.name}</td>
                      <td className="px-4 py-3.5 text-right font-semibold text-muted-foreground">{item.systemQty} {item.unit}</td>
                      <td className="px-4 py-3.5 text-right font-bold">
                        {editingId === item.id ? (
                          <div className="flex items-center justify-end gap-1">
                            <Input
                              type="number"
                              value={editValue}
                              onChange={(e) => setEditValue(parseInt(e.target.value) || 0)}
                              className="h-8 w-20 text-right"
                            />
                            <span className="text-xs text-muted-foreground">{item.unit}</span>
                          </div>
                        ) : (
                          <span>{item.physicalQty} {item.unit}</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-right font-bold">
                        {variance === 0 && <span className="text-muted-foreground">0</span>}
                        {variance > 0 && <span className="text-emerald-600">+{variance}</span>}
                        {variance < 0 && <span className="text-rose-500">{variance}</span>}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            variance === 0
                              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                              : "bg-amber-500/10 text-amber-700 dark:text-amber-400"
                          }`}
                        >
                          {variance === 0 ? "Matched" : "Discrepancy"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        {editingId === item.id ? (
                          <Button 
                            size="sm" 
                            onClick={() => handleSave(item.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer h-7 text-xs"
                          >
                            Save
                          </Button>
                        ) : (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleEdit(item.id, item.physicalQty)}
                            className="cursor-pointer h-7 text-xs"
                          >
                            Enter Count
                          </Button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
