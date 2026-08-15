"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { IconPackages, IconDownload, IconPrinter, IconAlertTriangle } from "@tabler/icons-react"

export default function StockReportPage() {
  const [filterStatus, setFilterStatus] = useState("All")

  const inventory = [
    { id: 1, item: "Arabica Whole Beans (kg)", category: "Raw Beans", current: 45, min: 10, unitCost: "$14.00", totalValue: "$630.00", status: "In Stock" },
    { id: 2, item: "Fresh Milk Cartons (1L)", category: "Dairy", current: 8, min: 15, unitCost: "$2.00", totalValue: "$16.00", status: "Low Stock" },
    { id: 3, item: "Butter Croissants (pcs)", category: "Bakery", current: 12, min: 10, unitCost: "$1.80", totalValue: "$21.60", status: "In Stock" },
    { id: 4, item: "Paper Coffee Cups 12oz", category: "Packaging", current: 350, min: 100, unitCost: "$0.10", totalValue: "$35.00", status: "In Stock" },
    { id: 5, item: "Matcha Tea Powder (500g)", category: "Tea", current: 2, min: 5, unitCost: "$18.00", totalValue: "$36.00", status: "Low Stock" },
  ]

  const filteredInventory = inventory.filter((item) => {
    if (filterStatus === "All") return true
    return item.status === filterStatus
  })

  const totalInventoryVal = inventory.reduce((sum, item) => sum + parseFloat(item.totalValue.replace("$", "")), 0)
  const lowStockCount = inventory.filter((item) => item.status === "Low Stock").length

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 bg-slate-50/50 dark:bg-background">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-500 font-bold shadow-2xs">
            <IconPackages className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Stock & Inventory Report</h1>
            <p className="text-sm text-muted-foreground">Monitor inventory levels, low stock alerts, and valuation</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5">
            <IconPrinter className="h-4 w-4" /> Print
          </Button>
          <Button size="sm" className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
            <IconDownload className="h-4 w-4" /> Export Stock
          </Button>
        </div>
      </div>

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
            <CardDescription>Current stock quantities and thresholds</CardDescription>
          </div>
          <div className="flex gap-2">
            {["All", "In Stock", "Low Stock"].map((status) => (
              <Button
                key={status}
                variant={filterStatus === status ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus(status)}
                className={filterStatus === status ? "bg-emerald-600 text-white hover:bg-emerald-700" : ""}
              >
                {status}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-y bg-muted/40 text-xs font-medium text-muted-foreground uppercase">
                <tr>
                  <th className="px-4 py-3">Inventory Item</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Current Stock</th>
                  <th className="px-4 py-3">Min Threshold</th>
                  <th className="px-4 py-3">Unit Cost</th>
                  <th className="px-4 py-3">Total Value</th>
                  <th className="px-4 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredInventory.map((row) => (
                  <tr key={row.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3.5 font-medium">{row.item}</td>
                    <td className="px-4 py-3.5 text-muted-foreground">{row.category}</td>
                    <td className="px-4 py-3.5 font-bold font-mono">{row.current}</td>
                    <td className="px-4 py-3.5 text-muted-foreground font-mono">{row.min}</td>
                    <td className="px-4 py-3.5 font-mono">{row.unitCost}</td>
                    <td className="px-4 py-3.5 font-semibold text-emerald-600">{row.totalValue}</td>
                    <td className="px-4 py-3.5 text-right">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          row.status === "In Stock"
                            ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                            : "bg-amber-500/10 text-amber-700 dark:text-amber-400 font-bold animate-pulse"
                        }`}
                      >
                        {row.status}
                      </span>
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

