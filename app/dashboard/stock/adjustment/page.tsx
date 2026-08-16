"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { IconAdjustments, IconChevronDown } from "@tabler/icons-react"

interface AdjustmentLog {
  id: string
  sku: string
  name: string
  type: "addition" | "subtraction"
  qty: number
  reason: string
  date: string
}

export default function StockAdjustmentPage() {
  const [sku, setSku] = useState("")
  const [itemName, setItemName] = useState("")
  const [type, setType] = useState<"addition" | "subtraction">("addition")
  const [qty, setQty] = useState<number>(0)
  const [reason, setReason] = useState("Damaged")
  const [logs, setLogs] = useState<AdjustmentLog[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!sku.trim() || !itemName.trim() || qty <= 0) return

    const newLog: AdjustmentLog = {
      id: Date.now().toString(),
      sku: sku.trim(),
      name: itemName.trim(),
      type,
      qty,
      reason,
      date: new Date().toISOString().replace("T", " ").substring(0, 16),
    }

    setLogs([newLog, ...logs])
    
    // Clear inputs
    setSku("")
    setItemName("")
    setQty(0)
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 bg-slate-50/50 dark:bg-background">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-500 font-bold shadow-2xs">
            <IconAdjustments className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Stock Adjustment</h1>
            <p className="text-sm text-muted-foreground">Adjust product and raw material quantities for discrepancies or damaged items</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column: Form */}
        <Card className="border bg-card shadow-2xs md:col-span-1 h-fit">
          <CardHeader>
            <CardTitle className="text-base font-semibold">New Adjustment</CardTitle>
            <CardDescription>Record manual additions or subtractions to physical levels</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="adj-sku">Item SKU</Label>
                <Input
                  id="adj-sku"
                  placeholder="e.g. 000001"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="adj-name">Item Name</Label>
                <Input
                  id="adj-name"
                  placeholder="e.g. Espresso Single Shot"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <Label>Adjustment Type</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant={type === "addition" ? "default" : "outline"}
                    onClick={() => setType("addition")}
                    className="cursor-pointer"
                  >
                    Add (+)
                  </Button>
                  <Button
                    type="button"
                    variant={type === "subtraction" ? "default" : "outline"}
                    onClick={() => setType("subtraction")}
                    className="cursor-pointer"
                  >
                    Subtract (-)
                  </Button>
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="adj-qty">Quantity</Label>
                <Input
                  id="adj-qty"
                  type="number"
                  placeholder="0"
                  value={qty || ""}
                  onChange={(e) => setQty(parseInt(e.target.value) || 0)}
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="adj-reason">Reason</Label>
                <div className="relative">
                  <select
                    id="adj-reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="h-9 w-full rounded-xl border border-input bg-input/30 pl-3 pr-8 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 appearance-none cursor-pointer text-foreground"
                  >
                    <option value="Damaged">Damaged/Spilled</option>
                    <option value="Expired">Expired</option>
                    <option value="Stock Check Correction">Stock Check Correction</option>
                    <option value="Theft/Lost">Theft or Lost</option>
                    <option value="Promo/Gifting">Promo or Gifting</option>
                  </select>
                  <IconChevronDown className="absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 pointer-events-none text-muted-foreground" />
                </div>
              </div>

              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer mt-4">
                Apply Adjustment
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Right Column: Adjustment Logs History */}
        <Card className="border bg-card shadow-2xs md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Adjustment History Log</CardTitle>
            <CardDescription>Recent adjustments made by system administrators</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              {logs.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground font-semibold">
                  No adjustments recorded yet.
                </div>
              ) : (
                <table className="w-full text-left text-sm">
                  <thead className="border-y bg-muted/40 text-xs font-semibold text-muted-foreground uppercase">
                    <tr>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">SKU</th>
                      <th className="px-4 py-3">Item Name</th>
                      <th className="px-4 py-3 text-right">Adjustment</th>
                      <th className="px-4 py-3">Reason</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {logs.map(log => (
                      <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 text-xs text-muted-foreground font-mono">{log.date}</td>
                        <td className="px-4 py-3 font-mono text-xs font-semibold">{log.sku}</td>
                        <td className="px-4 py-3 font-medium">{log.name}</td>
                        <td className="px-4 py-3 text-right font-bold">
                          <span className={log.type === "addition" ? "text-emerald-600" : "text-rose-500"}>
                            {log.type === "addition" ? "+" : "-"}
                            {log.qty}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center rounded-full bg-slate-500/10 px-2.5 py-0.5 text-xs font-medium text-slate-700 dark:text-slate-400">
                            {log.reason}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
