"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { IconClipboardText, IconSearch, IconAdjustments, IconPlus, IconEdit, IconTrash } from "@tabler/icons-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { getStockItems } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import CreateStock from "../CreateStock"
import EditStock from "../EditStock"

interface CurrentStockItem {
  id: string
  name: string
  sku: string
  category: string
  currentQty: number
  unit: string
  reorderLevel?: number
  quality?: string
  caseQty?: number
  unitsPerCase?: number
  lastUpdated: string
}

export default function CurrentStockPage() {
  const [search, setSearch] = useState("")
  const [items, setItems] = useState<CurrentStockItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getStockItems()
      .then((data) => {
        setItems(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error loading stock:", err)
        setLoading(false)
      })
  }, [])

  // Dialog States
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingStock, setEditingStock] = useState<CurrentStockItem | null>(null)

  const filtered = items.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.sku.toLowerCase().includes(search.toLowerCase())
  )

  // Handlers
  const handleCreate = (newItem: any) => {
    setItems([...items, newItem])
  }

  const handleEditClick = (item: CurrentStockItem) => {
    setEditingStock(item)
    setIsEditOpen(true)
  }

  const handleSave = (updatedItem: any) => {
    setItems(items.map(item => item.id === updatedItem.id ? updatedItem : item))
  }

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete stock item "${name}"?`)) {
      setItems(items.filter(item => item.id !== id))
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 bg-slate-50/50 dark:bg-background">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-500 font-bold shadow-2xs">
            <IconClipboardText className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Current Stock Levels</h1>
            <p className="text-sm text-muted-foreground">Total actual physical raw stock currently stored in our warehouse</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => setIsCreateOpen(true)}
            className="gap-2 bg-black hover:bg-black/90 text-white rounded-xl cursor-pointer"
          >
            <IconPlus className="h-4 w-4" /> Add Stock
          </Button>
          <Link href="/dashboard/stock/adjustment">
            <Button variant="outline" className="gap-2 cursor-pointer border rounded-xl">
              <IconAdjustments className="h-4 w-4" /> Stock Adjustment
            </Button>
          </Link>
        </div>
      </div>

      <Card className="border bg-card shadow-2xs">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Active Inventory Levels</CardTitle>
            <CardDescription>Real-time physical stock counts across all raw items</CardDescription>
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
                  <th className="px-4 py-3 text-right">Physical Count</th>
                  <th className="px-4 py-3 text-right">Unit</th>
                  <th className="px-4 py-3 text-center">Quality</th>
                  <th className="px-4 py-3 text-right">Last System Sync</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {loading ? (
                  [...Array(4)].map((_, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-3.5"><Skeleton className="h-4 w-16" /></td>
                      <td className="px-4 py-3.5"><Skeleton className="h-4 w-36" /></td>
                      <td className="px-4 py-3.5"><Skeleton className="h-4 w-20" /></td>
                      <td className="px-4 py-3.5 text-right"><Skeleton className="h-4 w-10 ml-auto" /></td>
                      <td className="px-4 py-3.5 text-right"><Skeleton className="h-4 w-8 ml-auto" /></td>
                      <td className="px-4 py-3.5 text-center"><Skeleton className="h-5 w-16 mx-auto rounded-full" /></td>
                      <td className="px-4 py-3.5 text-right"><Skeleton className="h-4 w-24 ml-auto" /></td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex gap-2 justify-end">
                          <Skeleton className="h-8 w-8 rounded-lg" />
                          <Skeleton className="h-8 w-8 rounded-lg" />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  filtered.map(item => (
                    <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3.5 font-mono text-xs font-semibold">{item.sku}</td>
                    <td className="px-4 py-3.5 font-medium">{item.name}</td>
                    <td className="px-4 py-3.5 text-muted-foreground">{item.category}</td>
                    <td className="px-4 py-3.5 text-right font-bold text-foreground">
                      <div>{item.currentQty}</div>
                      {item.caseQty !== undefined && item.unitsPerCase !== undefined && item.caseQty > 0 && (
                        <div className="text-[10px] text-muted-foreground font-medium">
                          ({item.caseQty} cs × {item.unitsPerCase})
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-right text-muted-foreground text-xs">{item.unit}</td>
                    <td className="px-4 py-3.5 text-center">
                      <span className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                        (item.quality === "Good" || item.quality === "Premium" || !item.quality) && "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
                        item.quality === "Standard" && "bg-blue-500/10 text-blue-700 dark:text-blue-400",
                        item.quality === "Damaged" && "bg-rose-500/10 text-rose-700 dark:text-rose-400"
                      )}>
                        {item.quality || "Good"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono text-xs text-muted-foreground">{item.lastUpdated}</td>
                    <td className="px-4 py-3.5 text-right space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleEditClick(item)}
                        className="h-8 w-8 text-cyan-500 hover:text-cyan-600 hover:bg-cyan-500/10 cursor-pointer rounded-lg"
                      >
                        <IconEdit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDelete(item.id, item.name)}
                        className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 cursor-pointer rounded-lg"
                      >
                        <IconTrash className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
      </Card>

      {/* Create Stock Dialog */}
      <CreateStock
        isOpen={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onCreate={handleCreate}
      />

      {/* Edit Stock Dialog */}
      <EditStock
        isOpen={isEditOpen}
        onOpenChange={setIsEditOpen}
        stockItem={editingStock}
        onSave={handleSave}
      />
    </div>
  )
}
