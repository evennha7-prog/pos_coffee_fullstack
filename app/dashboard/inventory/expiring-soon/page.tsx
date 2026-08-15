"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { IconHourglass, IconSearch, IconAlertCircle } from "@tabler/icons-react"

interface ExpiringItem {
  id: string
  name: string
  batchNo: string
  qty: number
  expiryDate: string
  daysRemaining: number
  unit: string
}

export default function ExpiringSoonPage() {
  const [search, setSearch] = useState("")
  const [items, setItems] = useState<ExpiringItem[]>([
    { id: "1", name: "Fresh Dairy Milk 1L", batchNo: "B-MILK-902", qty: 24, expiryDate: "2026-07-26", daysRemaining: 3, unit: "packs" },
    { id: "2", name: "Whipped Cream Cans", batchNo: "B-CRM-104", qty: 8, expiryDate: "2026-07-28", daysRemaining: 5, unit: "cans" },
    { id: "3", name: "Caramel Sauce Syrup", batchNo: "B-SYR-881", qty: 5, expiryDate: "2026-08-05", daysRemaining: 13, unit: "bottles" },
  ])

  const filtered = items.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.batchNo.toLowerCase().includes(search.toLowerCase())
  )

  const handleDiscard = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to discard batch for "${name}"?`)) {
      setItems(items.filter(item => item.id !== id))
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 bg-slate-50/50 dark:bg-background">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/15 text-orange-500 font-bold shadow-2xs">
            <IconHourglass className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Expiring Soon Alerts</h1>
            <p className="text-sm text-muted-foreground">Perishable goods and ingredients near expiration dates</p>
          </div>
        </div>
      </div>

      <Card className="border bg-card shadow-2xs">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Expiring Batches</CardTitle>
            <CardDescription>Track food safety and raw material expiration days</CardDescription>
          </div>
          <div className="relative w-full sm:w-64">
            <IconSearch className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search batch or name..."
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
                  <th className="px-4 py-3">Batch No</th>
                  <th className="px-4 py-3">Item Name</th>
                  <th className="px-4 py-3 text-right">Quantity</th>
                  <th className="px-4 py-3">Expiry Date</th>
                  <th className="px-4 py-3 text-right">Days Left</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map(item => (
                  <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3.5 font-mono text-xs font-semibold">{item.batchNo}</td>
                    <td className="px-4 py-3.5 font-medium">{item.name}</td>
                    <td className="px-4 py-3.5 text-right font-bold">{item.qty} {item.unit}</td>
                    <td className="px-4 py-3.5 font-semibold text-xs">{item.expiryDate}</td>
                    <td className="px-4 py-3.5 text-right font-bold text-orange-600">{item.daysRemaining} days</td>
                    <td className="px-4 py-3.5 text-center">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          item.daysRemaining <= 3
                            ? "bg-red-500/10 text-red-700 dark:text-red-400"
                            : "bg-orange-500/10 text-orange-700 dark:text-orange-400"
                        }`}
                      >
                        <IconAlertCircle className="h-3 w-3" />
                        {item.daysRemaining <= 3 ? "Critical Expiry" : "Expiring"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleDiscard(item.id, item.name)}
                        className="cursor-pointer h-7 text-xs text-destructive hover:bg-destructive/10"
                      >
                        Discard Batch
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
