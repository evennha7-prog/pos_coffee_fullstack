"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  IconTruckLoading,
  IconSearch,
  IconPrinter,
  IconRefresh,
  IconCurrencyDollar,
  IconPackages,
  IconCheck,
  IconAlertCircle,
  IconEye,
  IconLoader2,
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { getPurchases, Purchase } from "@/lib/api"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"

export default function PurchasingGoodsReportPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "7days" | "30days">("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const fetchPurchases = async () => {
    try {
      setLoading(true)
      const data = await getPurchases({ limit: 100 })
      setPurchases(data || [])
    } catch (err) {
      console.error("Failed to load purchasing goods:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPurchases()
  }, [])

  const filteredPurchases = useMemo(() => {
    return purchases.filter((p) => {
      const inv = (p.invoice_number || p.invoiceNumber || "").toLowerCase()
      const sup = (p.supplierName || p.supplier || "").toLowerCase()
      const buyer = (p.purchasedByName || p.purchaseBy || "").toLowerCase()
      const q = searchQuery.toLowerCase()
      const matchesSearch = inv.includes(q) || sup.includes(q) || buyer.includes(q)

      const status = (p.purchase_status || p.purchaseStatus || "received").toLowerCase()
      const matchesStatus = statusFilter === "all" || status === statusFilter.toLowerCase()

      let matchesDate = true
      const dateStr = p.purchase_date || p.purchaseDate || p.created_at
      if (dateFilter !== "all" && dateStr) {
        const pDate = new Date(dateStr)
        const now = new Date()
        if (dateFilter === "today") {
          matchesDate = pDate.toDateString() === now.toDateString()
        } else if (dateFilter === "7days") {
          const past7 = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          matchesDate = pDate >= past7
        } else if (dateFilter === "30days") {
          const past30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          matchesDate = pDate >= past30
        }
      }

      return matchesSearch && matchesStatus && matchesDate
    })
  }, [purchases, searchQuery, statusFilter, dateFilter])

  const totalCost = filteredPurchases.reduce((sum, p) => sum + Number(p.total_cost || p.totalCost || 0), 0)
  const totalPaid = filteredPurchases.reduce((sum, p) => sum + Number(p.paid_amount || p.paidAmount || 0), 0)
  const totalDue = filteredPurchases.reduce((sum, p) => sum + Number(p.due_amount || p.dueAmount || 0), 0)
  const totalOrders = filteredPurchases.length

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 bg-slate-50/60 dark:bg-background">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-white dark:bg-card p-4 rounded-2xl border border-slate-200/80 dark:border-border shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600 font-bold shadow-2xs">
            <IconTruckLoading className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
              Purchasing Goods Report
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Supplier stock purchases, raw ingredients, and inventory procurement audit
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchPurchases}
            className="gap-1.5 rounded-xl cursor-pointer h-9 text-xs"
          >
            <IconRefresh className="h-4 w-4" /> Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="gap-1.5 rounded-xl cursor-pointer h-9 text-xs"
          >
            <IconPrinter className="h-4 w-4" /> Print Report
          </Button>
        </div>
      </div>

      {/* Analytics KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border border-slate-200/80 dark:border-border bg-white dark:bg-card shadow-2xs rounded-2xl">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Total Goods Purchased</p>
              <h3 className="text-2xl font-bold text-foreground mt-1">
                ${totalCost.toFixed(2)}
              </h3>
              <p className="text-[11px] font-mono text-muted-foreground mt-0.5">
                ៛{Math.round(totalCost * 4100).toLocaleString()}
              </p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-600">
              <IconCurrencyDollar className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200/80 dark:border-border bg-white dark:bg-card shadow-2xs rounded-2xl">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Purchase Invoices</p>
              <h3 className="text-2xl font-bold text-foreground mt-1">
                {totalOrders}
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Procurement orders
              </p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600">
              <IconPackages className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200/80 dark:border-border bg-white dark:bg-card shadow-2xs rounded-2xl">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Paid to Suppliers</p>
              <h3 className="text-2xl font-bold text-emerald-600 mt-1">
                ${totalPaid.toFixed(2)}
              </h3>
              <p className="text-[11px] font-mono text-muted-foreground mt-0.5">
                ៛{Math.round(totalPaid * 4100).toLocaleString()}
              </p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
              <IconCheck className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200/80 dark:border-border bg-white dark:bg-card shadow-2xs rounded-2xl">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Supplier Payables / Due</p>
              <h3
                className={cn(
                  "text-2xl font-bold mt-1",
                  totalDue > 0 ? "text-amber-600" : "text-slate-700 dark:text-slate-300"
                )}
              >
                ${totalDue.toFixed(2)}
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {totalDue > 0 ? "Pending supplier payment" : "All payables cleared"}
              </p>
            </div>
            <div
              className={cn(
                "h-10 w-10 rounded-xl flex items-center justify-center",
                totalDue > 0 ? "bg-amber-500/10 text-amber-600" : "bg-slate-100 text-slate-500"
              )}
            >
              <IconAlertCircle className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Table */}
      <Card className="border border-slate-200/90 dark:border-border bg-card shadow-2xs rounded-2xl overflow-hidden">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b bg-slate-50/40 dark:bg-muted/20 pb-4">
          <div>
            <CardTitle className="text-base font-bold">Purchased Goods Records</CardTitle>
            <CardDescription className="text-xs">
              Showing {filteredPurchases.length} of {purchases.length} purchase orders
            </CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center bg-slate-100 dark:bg-muted p-1 rounded-xl border border-border/40 text-xs">
              <button
                type="button"
                onClick={() => setDateFilter("all")}
                className={cn(
                  "px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer",
                  dateFilter === "all" && "bg-white dark:bg-card font-semibold shadow-2xs text-foreground"
                )}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setDateFilter("today")}
                className={cn(
                  "px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer",
                  dateFilter === "today" && "bg-white dark:bg-card font-semibold shadow-2xs text-foreground"
                )}
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setDateFilter("7days")}
                className={cn(
                  "px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer",
                  dateFilter === "7days" && "bg-white dark:bg-card font-semibold shadow-2xs text-foreground"
                )}
              >
                7 Days
              </button>
              <button
                type="button"
                onClick={() => setDateFilter("30days")}
                className={cn(
                  "px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer",
                  dateFilter === "30days" && "bg-white dark:bg-card font-semibold shadow-2xs text-foreground"
                )}
              >
                30 Days
              </button>
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 rounded-xl border border-input bg-background px-3 text-xs outline-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="received">Received</option>
              <option value="ordered">Ordered</option>
              <option value="pending">Pending</option>
              <option value="cancel">Cancel</option>
            </select>

            <div className="relative w-full sm:w-56">
              <IconSearch className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Invoice, supplier..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 text-xs h-9 rounded-xl"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
                <IconLoader2 className="h-8 w-8 animate-spin text-teal-600" />
                <span className="text-sm font-medium">Loading purchasing goods report...</span>
              </div>
            ) : filteredPurchases.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground space-y-2">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
                  <IconTruckLoading className="h-6 w-6 opacity-40" />
                </div>
                <p className="text-sm font-semibold text-foreground">No purchasing records found</p>
                <p className="text-xs text-muted-foreground">
                  Purchases created under Purchase section will appear here automatically.
                </p>
              </div>
            ) : (
              <table className="w-full text-left text-sm whitespace-nowrap lg:whitespace-normal">
                <thead className="border-b bg-muted/40 text-xs font-semibold text-muted-foreground uppercase">
                  <tr>
                    <th className="px-4 py-3">Invoice #</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Supplier</th>
                    <th className="px-4 py-3">Purchased By</th>
                    <th className="px-4 py-3">Goods Total</th>
                    <th className="px-4 py-3">Paid</th>
                    <th className="px-4 py-3">Due</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredPurchases.map((p) => {
                    const cost = Number(p.total_cost || p.totalCost || 0)
                    const paid = Number(p.paid_amount || p.paidAmount || 0)
                    const due = Number(p.due_amount || p.dueAmount || 0)
                    const status = (p.purchase_status || p.purchaseStatus || "received").toUpperCase()
                    const dateStr = p.purchase_date || p.purchaseDate || p.created_at
                      ? new Date(p.purchase_date || p.purchaseDate || p.created_at!).toLocaleDateString()
                      : "-"

                    return (
                      <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3.5 font-mono text-xs font-bold text-teal-600 dark:text-teal-400">
                          {p.invoice_number || p.invoiceNumber}
                        </td>
                        <td className="px-4 py-3.5 text-xs text-muted-foreground">{dateStr}</td>
                        <td className="px-4 py-3.5 font-medium text-foreground">
                          {p.supplierName || p.supplier || "Supplier"}
                        </td>
                        <td className="px-4 py-3.5 text-xs text-muted-foreground">
                          {p.purchasedByName || p.purchaseBy || "Admin"}
                        </td>
                        <td className="px-4 py-3.5 font-bold text-foreground font-sans">
                          ${cost.toFixed(2)}
                        </td>
                        <td className="px-4 py-3.5 font-medium text-emerald-600 dark:text-emerald-400">
                          ${paid.toFixed(2)}
                        </td>
                        <td className="px-4 py-3.5 font-medium text-rose-500">
                          ${due.toFixed(2)}
                        </td>
                        <td className="px-4 py-3.5">
                          <span
                            className={cn(
                              "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase",
                              status === "RECEIVED" &&
                                "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20",
                              status === "ORDERED" &&
                                "bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20",
                              status === "PENDING" &&
                                "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20",
                              status === "CANCEL" &&
                                "bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20"
                            )}
                          >
                            {status}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedPurchase(p)
                              setIsDetailOpen(true)
                            }}
                            className="gap-1 text-xs font-semibold text-teal-600 hover:text-teal-700 hover:bg-teal-50 dark:hover:bg-teal-950/30 cursor-pointer h-8 rounded-lg px-2.5"
                          >
                            <IconEye className="h-3.5 w-3.5" /> View Details
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Purchase Detail Modal */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              Purchase Order #{selectedPurchase?.invoice_number || selectedPurchase?.invoiceNumber}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Supplier: {selectedPurchase?.supplierName || selectedPurchase?.supplier}
            </DialogDescription>
          </DialogHeader>

          {selectedPurchase && (
            <div className="space-y-3 text-xs py-2">
              <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 dark:bg-muted/40 rounded-xl border border-border/60">
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                    Purchase Date
                  </span>
                  <span className="font-semibold text-foreground">
                    {selectedPurchase.purchase_date || selectedPurchase.purchaseDate || "Recent"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                    Status
                  </span>
                  <span className="font-bold text-teal-600 uppercase">
                    {selectedPurchase.purchase_status || selectedPurchase.purchaseStatus || "Received"}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-1.5">
                <p className="font-bold text-foreground text-xs uppercase tracking-wider text-muted-foreground">
                  Purchased Items List
                </p>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {(selectedPurchase.items || []).length === 0 ? (
                    <p className="text-muted-foreground italic">Goods recorded under general PO</p>
                  ) : (
                    selectedPurchase.items?.map((it, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-muted/30 border text-xs"
                      >
                        <div>
                          <p className="font-medium text-foreground">
                            {it.productName || it.name || `Product #${it.product_id}`}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            ${Number(it.unit_price || it.price || 0).toFixed(2)} × {it.quantity || it.qty}
                          </p>
                        </div>
                        <span className="font-bold text-foreground">
                          ${Number(it.total_price || (it.unit_price || it.price || 0) * (it.quantity || it.qty || 1)).toFixed(2)}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Totals */}
              <div className="border-t pt-3 space-y-1.5">
                <div className="flex justify-between font-bold text-sm">
                  <span>Total Purchase Cost:</span>
                  <span className="text-teal-600">
                    ${Number(selectedPurchase.total_cost || selectedPurchase.totalCost || 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Paid:</span>
                  <span>${Number(selectedPurchase.paid_amount || selectedPurchase.paidAmount || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-rose-500 font-medium">
                  <span>Due:</span>
                  <span>${Number(selectedPurchase.due_amount || selectedPurchase.dueAmount || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsDetailOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
