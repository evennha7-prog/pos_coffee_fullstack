"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  IconHistory,
  IconSearch,
  IconEye,
  IconPrinter,
  IconDownload,
  IconCurrencyDollar,
  IconShoppingBag,
  IconLoader2,
  IconReceipt,
  IconCheck,
  IconClock,
  IconAlertCircle,
  IconX,
  IconFilter,
  IconRefresh,
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { getSales, Sale } from "@/lib/api"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"

export default function HistorySaleReportPage() {
  const [sales, setSales] = useState<Sale[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "7days" | "30days">("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const fetchSalesData = async () => {
    try {
      setLoading(true)
      const data = await getSales({ limit: 100 })
      setSales(data || [])
    } catch (err) {
      console.error("Failed to load sale history:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSalesData()
  }, [])

  // Filter sales based on search query, date filter, and status filter
  const filteredSales = useMemo(() => {
    return sales.filter((sale) => {
      // Search
      const inv = (sale.invoice_number || sale.invoice || "").toLowerCase()
      const cust = (sale.customerName || sale.customer || "").toLowerCase()
      const cashier = (sale.cashierName || sale.saleBy || "").toLowerCase()
      const q = searchQuery.toLowerCase()
      const matchesSearch = inv.includes(q) || cust.includes(q) || cashier.includes(q)

      // Status
      const status = (sale.payment_status || "paid").toLowerCase()
      const matchesStatus = statusFilter === "all" || status === statusFilter.toLowerCase()

      // Date
      let matchesDate = true
      if (dateFilter !== "all" && sale.created_at) {
        const saleDate = new Date(sale.created_at)
        const now = new Date()
        if (dateFilter === "today") {
          matchesDate = saleDate.toDateString() === now.toDateString()
        } else if (dateFilter === "7days") {
          const past7 = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          matchesDate = saleDate >= past7
        } else if (dateFilter === "30days") {
          const past30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          matchesDate = saleDate >= past30
        }
      }

      return matchesSearch && matchesStatus && matchesDate
    })
  }, [sales, searchQuery, statusFilter, dateFilter])

  // Summary Metrics
  const totalRevenue = filteredSales.reduce((sum, s) => sum + Number(s.total_cost || 0), 0)
  const totalPaid = filteredSales.reduce((sum, s) => sum + Number(s.paid_amount || 0), 0)
  const totalDue = filteredSales.reduce((sum, s) => sum + Number(s.due_amount || 0), 0)
  const totalOrders = filteredSales.length
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

  const handleOpenReceipt = (sale: Sale) => {
    setSelectedSale(sale)
    setIsDetailOpen(true)
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 bg-slate-50/60 dark:bg-background">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-white dark:bg-card p-4 rounded-2xl border border-slate-200/80 dark:border-border shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 font-bold shadow-2xs">
            <IconHistory className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
              Sale History & Invoices
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Complete chronological audit trail of all customer sales & receipts from MySQL
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchSalesData}
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
            <IconPrinter className="h-4 w-4" /> Print
          </Button>
        </div>
      </div>

      {/* Top Analytics Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Sales */}
        <Card className="border border-slate-200/80 dark:border-border bg-white dark:bg-card shadow-2xs rounded-2xl">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Total Sales Revenue</p>
              <h3 className="text-2xl font-bold text-emerald-600 mt-1">
                ${totalRevenue.toFixed(2)}
              </h3>
              <p className="text-[11px] font-mono text-muted-foreground mt-0.5">
                ៛{Math.round(totalRevenue * 4100).toLocaleString()}
              </p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
              <IconCurrencyDollar className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Total Orders */}
        <Card className="border border-slate-200/80 dark:border-border bg-white dark:bg-card shadow-2xs rounded-2xl">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Completed Invoices</p>
              <h3 className="text-2xl font-bold text-foreground mt-1">
                {totalOrders}
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Avg: ${avgOrderValue.toFixed(2)} / order
              </p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600">
              <IconShoppingBag className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Paid Amount */}
        <Card className="border border-slate-200/80 dark:border-border bg-white dark:bg-card shadow-2xs rounded-2xl">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Total Cash Collected</p>
              <h3 className="text-2xl font-bold text-foreground mt-1">
                ${totalPaid.toFixed(2)}
              </h3>
              <p className="text-[11px] font-mono text-muted-foreground mt-0.5">
                ៛{Math.round(totalPaid * 4100).toLocaleString()}
              </p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-600">
              <IconCheck className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Due Amount */}
        <Card className="border border-slate-200/80 dark:border-border bg-white dark:bg-card shadow-2xs rounded-2xl">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Outstanding / Due</p>
              <h3
                className={cn(
                  "text-2xl font-bold mt-1",
                  totalDue > 0 ? "text-rose-600" : "text-slate-700 dark:text-slate-300"
                )}
              >
                ${totalDue.toFixed(2)}
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {totalDue > 0 ? "Pending collection" : "All payments settled"}
              </p>
            </div>
            <div
              className={cn(
                "h-10 w-10 rounded-xl flex items-center justify-center",
                totalDue > 0 ? "bg-rose-500/10 text-rose-600" : "bg-slate-100 text-slate-500"
              )}
            >
              <IconAlertCircle className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card className="border border-slate-200/90 dark:border-border bg-card shadow-2xs rounded-2xl overflow-hidden">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b bg-slate-50/40 dark:bg-muted/20 pb-4">
          <div>
            <CardTitle className="text-base font-bold">Sales History Log</CardTitle>
            <CardDescription className="text-xs">
              Showing {filteredSales.length} of {sales.length} transactions
            </CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Date Filter Pills */}
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

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 rounded-xl border border-input bg-background px-3 text-xs outline-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="partial">Partial</option>
              <option value="due">Due</option>
            </select>

            {/* Search */}
            <div className="relative w-full sm:w-56">
              <IconSearch className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Invoice, customer..."
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
                <IconLoader2 className="h-8 w-8 animate-spin text-sky-600" />
                <span className="text-sm font-medium">Loading sales history from database...</span>
              </div>
            ) : filteredSales.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground space-y-2">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
                  <IconReceipt className="h-6 w-6 opacity-40" />
                </div>
                <p className="text-sm font-semibold text-foreground">No sale records found</p>
                <p className="text-xs text-muted-foreground">
                  Try adjusting your filters or complete a checkout in the POS terminal.
                </p>
              </div>
            ) : (
              <table className="w-full text-left text-sm whitespace-nowrap lg:whitespace-normal">
                <thead className="border-b bg-muted/40 text-xs font-semibold text-muted-foreground uppercase">
                  <tr>
                    <th className="px-4 py-3">Invoice #</th>
                    <th className="px-4 py-3">Date & Time</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Cashier</th>
                    <th className="px-4 py-3">Items Summary</th>
                    <th className="px-4 py-3">Total Cost</th>
                    <th className="px-4 py-3">Paid Amount</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredSales.map((sale) => {
                    const totalCost = Number(sale.total_cost || 0)
                    const paidAmount = Number(sale.paid_amount || 0)
                    const status = (sale.payment_status || "paid").toUpperCase()
                    const dateStr = sale.created_at
                      ? new Date(sale.created_at).toLocaleString()
                      : "-"
                    const items = sale.items || []
                    const itemsCount = items.reduce((sum, it) => sum + Number(it.quantity || 1), 0)

                    return (
                      <tr key={sale.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3.5 font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                          {sale.invoice_number || sale.invoice}
                        </td>
                        <td className="px-4 py-3.5 text-xs text-muted-foreground">
                          {dateStr}
                        </td>
                        <td className="px-4 py-3.5 font-medium text-foreground">
                          {sale.customerName || sale.customer || "Walk-in Customer"}
                        </td>
                        <td className="px-4 py-3.5 text-xs text-muted-foreground">
                          {sale.cashierName || sale.saleBy || "Cashier"}
                        </td>
                        <td className="px-4 py-3.5 text-xs text-muted-foreground max-w-[200px] truncate">
                          {items.length > 0 ? (
                            <span title={items.map((it) => `${it.productName || "Item"} x${it.quantity}`).join(", ")}>
                              <span className="font-semibold text-foreground">{itemsCount} item{itemsCount !== 1 && "s"}</span>:{" "}
                              {items.map((it) => it.productName || "Item").join(", ")}
                            </span>
                          ) : (
                            "General Order"
                          )}
                        </td>
                        <td className="px-4 py-3.5 font-bold text-emerald-600 dark:text-emerald-400 font-sans">
                          ${totalCost.toFixed(2)}
                        </td>
                        <td className="px-4 py-3.5 font-medium text-foreground">
                          ${paidAmount.toFixed(2)}
                        </td>
                        <td className="px-4 py-3.5">
                          <span
                            className={cn(
                              "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase",
                              status === "PAID" &&
                                "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20",
                              status === "PARTIAL" &&
                                "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20",
                              status === "DUE" &&
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
                            onClick={() => handleOpenReceipt(sale)}
                            className="gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 cursor-pointer h-8 rounded-lg px-2.5"
                          >
                            <IconEye className="h-3.5 w-3.5" /> View Receipt
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

      {/* Itemized Sale Receipt Modal */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden">
          <DialogHeader className="p-4 pb-2 border-b bg-slate-50 dark:bg-muted/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-emerald-500/15 text-emerald-600 flex items-center justify-center font-bold">
                  <IconReceipt className="h-4 w-4" />
                </div>
                <div>
                  <DialogTitle className="text-base font-bold">
                    Receipt #{selectedSale?.invoice_number || selectedSale?.invoice}
                  </DialogTitle>
                  <DialogDescription className="text-xs">
                    {selectedSale?.created_at
                      ? new Date(selectedSale.created_at).toLocaleString()
                      : "Completed Transaction"}
                  </DialogDescription>
                </div>
              </div>
            </div>
          </DialogHeader>

          {selectedSale && (
            <div className="p-4 space-y-4 text-xs">
              {/* Meta Info */}
              <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-50 dark:bg-muted/40 border border-border/60">
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                    Customer
                  </span>
                  <span className="font-semibold text-foreground">
                    {selectedSale.customerName || selectedSale.customer || "Walk-in Customer"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                    Cashier
                  </span>
                  <span className="font-semibold text-foreground">
                    {selectedSale.cashierName || selectedSale.saleBy || "Cashier"}
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2">
                <p className="font-bold text-foreground text-xs uppercase tracking-wider text-muted-foreground">
                  Purchased Items
                </p>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {(selectedSale.items || []).length === 0 ? (
                    <p className="text-muted-foreground italic">No detailed items recorded</p>
                  ) : (
                    selectedSale.items?.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-muted/30 border border-slate-100 dark:border-border/50 text-xs"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {item.imageUrl && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={item.imageUrl}
                              alt={item.productName || "Item"}
                              className="h-8 w-8 rounded-md object-cover border border-slate-200 dark:border-border shrink-0"
                            />
                          )}
                          <div className="truncate">
                            <p className="font-medium text-foreground truncate">
                              {item.productName || `Product #${item.product_id}`}
                            </p>
                            <p className="text-[10px] text-muted-foreground">
                              ${Number(item.unit_price || 0).toFixed(2)} × {item.quantity}
                            </p>
                          </div>
                        </div>
                        <span className="font-bold text-foreground shrink-0 font-sans">
                          ${Number(item.total_price || 0).toFixed(2)}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Calculation Summary */}
              <div className="border-t pt-3 space-y-1.5 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Total Amount</span>
                  <span className="font-bold text-base text-emerald-600">
                    ${Number(selectedSale.total_cost || 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Total in KHR (៛)</span>
                  <span className="font-mono">
                    ៛{Math.round(Number(selectedSale.total_cost || 0) * 4100).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Amount Paid</span>
                  <span className="font-medium text-foreground">
                    ${Number(selectedSale.paid_amount || 0).toFixed(2)}
                  </span>
                </div>
                {Number(selectedSale.change_amount || 0) > 0 && (
                  <div className="flex justify-between text-muted-foreground">
                    <span>Change Returned</span>
                    <span className="font-medium text-foreground">
                      ${Number(selectedSale.change_amount || 0).toFixed(2)}
                    </span>
                  </div>
                )}
                {Number(selectedSale.due_amount || 0) > 0 && (
                  <div className="flex justify-between text-rose-600 font-bold">
                    <span>Due Remaining</span>
                    <span>${Number(selectedSale.due_amount || 0).toFixed(2)}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter className="p-3 border-t bg-slate-50 dark:bg-muted/20 gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsDetailOpen(false)}
              className="cursor-pointer"
            >
              Close
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handlePrint}
              className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer font-semibold"
            >
              <IconPrinter className="h-4 w-4 mr-1" /> Print Invoice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
