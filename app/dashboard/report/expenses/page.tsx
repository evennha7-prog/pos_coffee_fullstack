"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  IconArrowDownRight,
  IconReceiptRefund,
  IconSearch,
  IconPrinter,
  IconRefresh,
  IconFileInvoice,
  IconBuildingStore,
  IconCurrencyDollar,
  IconAlertCircle,
  IconCheck,
  IconLoader2,
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { getPurchases, Purchase } from "@/lib/api"

export default function ExpensesReportPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [timeframe, setTimeframe] = useState<"all" | "today" | "7days" | "30days">("all")

  const fetchExpenseData = async () => {
    try {
      setLoading(true)
      const data = await getPurchases({ limit: 200 })
      setPurchases(data || [])
    } catch (err) {
      console.error("Failed to load expenses data:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExpenseData()
  }, [])

  const filteredExpenses = useMemo(() => {
    return purchases.filter((p) => {
      const inv = (p.invoice_number || p.invoiceNumber || "").toLowerCase()
      const sup = (p.supplierName || p.supplier || "").toLowerCase()
      const q = searchQuery.toLowerCase()
      const matchesSearch = inv.includes(q) || sup.includes(q)

      let matchesDate = true
      const dateStr = p.purchase_date || p.purchaseDate || p.created_at
      if (timeframe !== "all" && dateStr) {
        const pDate = new Date(dateStr)
        const now = new Date()
        if (timeframe === "today") {
          matchesDate = pDate.toDateString() === now.toDateString()
        } else if (timeframe === "7days") {
          const past7 = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          matchesDate = pDate >= past7
        } else if (timeframe === "30days") {
          const past30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          matchesDate = pDate >= past30
        }
      }

      return matchesSearch && matchesDate
    })
  }, [purchases, searchQuery, timeframe])

  // Expense Calculations
  const totalExpenses = filteredExpenses.reduce((sum, p) => sum + Number(p.total_cost || p.totalCost || 0), 0)
  const paidExpenses = filteredExpenses.reduce((sum, p) => sum + Number(p.paid_amount || p.paidAmount || 0), 0)
  const pendingPayables = filteredExpenses.reduce((sum, p) => sum + Number(p.due_amount || p.dueAmount || 0), 0)
  const totalTransactions = filteredExpenses.length

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 bg-slate-50/60 dark:bg-background">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-white dark:bg-card p-4 rounded-2xl border border-slate-200/80 dark:border-border shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 font-bold shadow-2xs">
            <IconArrowDownRight className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
              Expenses & Outflow Report
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Inventory procurement costs, supplier disbursements, and operational expenses
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 dark:bg-muted p-1 rounded-xl border border-border/40 text-xs">
            <button
              type="button"
              onClick={() => setTimeframe("all")}
              className={cn(
                "px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer",
                timeframe === "all" && "bg-white dark:bg-card font-semibold shadow-2xs text-foreground"
              )}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setTimeframe("today")}
              className={cn(
                "px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer",
                timeframe === "today" && "bg-white dark:bg-card font-semibold shadow-2xs text-foreground"
              )}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => setTimeframe("7days")}
              className={cn(
                "px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer",
                timeframe === "7days" && "bg-white dark:bg-card font-semibold shadow-2xs text-foreground"
              )}
            >
              7 Days
            </button>
            <button
              type="button"
              onClick={() => setTimeframe("30days")}
              className={cn(
                "px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer",
                timeframe === "30days" && "bg-white dark:bg-card font-semibold shadow-2xs text-foreground"
              )}
            >
              30 Days
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={fetchExpenseData}
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

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border border-slate-200/80 dark:border-border bg-white dark:bg-card shadow-2xs rounded-2xl">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Total Incurred Expenses</p>
              <h3 className="text-2xl font-bold text-rose-600 mt-1">
                ${totalExpenses.toFixed(2)}
              </h3>
              <p className="text-[11px] font-mono text-muted-foreground mt-0.5">
                ៛{Math.round(totalExpenses * 4100).toLocaleString()}
              </p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-600">
              <IconCurrencyDollar className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200/80 dark:border-border bg-white dark:bg-card shadow-2xs rounded-2xl">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Settled / Paid Cash</p>
              <h3 className="text-2xl font-bold text-foreground mt-1">
                ${paidExpenses.toFixed(2)}
              </h3>
              <p className="text-[11px] font-mono text-muted-foreground mt-0.5">
                ៛{Math.round(paidExpenses * 4100).toLocaleString()}
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
              <p className="text-xs font-semibold text-muted-foreground">Pending Payables (Due)</p>
              <h3
                className={cn(
                  "text-2xl font-bold mt-1",
                  pendingPayables > 0 ? "text-amber-600" : "text-slate-700 dark:text-slate-300"
                )}
              >
                ${pendingPayables.toFixed(2)}
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {pendingPayables > 0 ? "Due to suppliers" : "No pending debts"}
              </p>
            </div>
            <div
              className={cn(
                "h-10 w-10 rounded-xl flex items-center justify-center",
                pendingPayables > 0 ? "bg-amber-500/10 text-amber-600" : "bg-slate-100 text-slate-500"
              )}
            >
              <IconAlertCircle className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200/80 dark:border-border bg-white dark:bg-card shadow-2xs rounded-2xl">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Disbursement Transactions</p>
              <h3 className="text-2xl font-bold text-foreground mt-1">
                {totalTransactions}
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Vendor bills recorded
              </p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600">
              <IconFileInvoice className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Expenses Table */}
      <Card className="border border-slate-200/90 dark:border-border bg-card shadow-2xs rounded-2xl overflow-hidden">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b bg-slate-50/40 dark:bg-muted/20 pb-4">
          <div>
            <CardTitle className="text-base font-bold">Expense Disbursements Log</CardTitle>
            <CardDescription className="text-xs">
              Itemized list of inventory purchases & supplier expenses
            </CardDescription>
          </div>

          <div className="relative w-full sm:w-64">
            <IconSearch className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search vendor, invoice..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 text-xs h-9 rounded-xl"
            />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
                <IconLoader2 className="h-8 w-8 animate-spin text-rose-600" />
                <span className="text-sm font-medium">Loading expenses audit...</span>
              </div>
            ) : filteredExpenses.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground space-y-2">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
                  <IconReceiptRefund className="h-6 w-6 opacity-40" />
                </div>
                <p className="text-sm font-semibold text-foreground">No expense entries found</p>
                <p className="text-xs text-muted-foreground">
                  Supplier purchase bills will automatically be logged here.
                </p>
              </div>
            ) : (
              <table className="w-full text-left text-sm whitespace-nowrap lg:whitespace-normal">
                <thead className="border-b bg-muted/40 text-xs font-semibold text-muted-foreground uppercase">
                  <tr>
                    <th className="px-4 py-3">Expense Ref #</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Vendor / Supplier</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Authorized By</th>
                    <th className="px-4 py-3">Paid Amount</th>
                    <th className="px-4 py-3">Due Remaining</th>
                    <th className="px-4 py-3 text-right">Total Incurred</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredExpenses.map((p) => {
                    const cost = Number(p.total_cost || p.totalCost || 0)
                    const paid = Number(p.paid_amount || p.paidAmount || 0)
                    const due = Number(p.due_amount || p.dueAmount || 0)
                    const dateStr = p.purchase_date || p.purchaseDate || p.created_at
                      ? new Date(p.purchase_date || p.purchaseDate || p.created_at!).toLocaleDateString()
                      : "-"

                    return (
                      <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3.5 font-mono text-xs font-bold text-rose-600 dark:text-rose-400">
                          {p.invoice_number || p.invoiceNumber}
                        </td>
                        <td className="px-4 py-3.5 text-xs text-muted-foreground">{dateStr}</td>
                        <td className="px-4 py-3.5 font-medium text-foreground">
                          {p.supplierName || p.supplier || "Supplier Vendor"}
                        </td>
                        <td className="px-4 py-3.5 text-xs">
                          <span className="bg-slate-100 dark:bg-muted px-2 py-0.5 rounded-md font-medium text-slate-700 dark:text-slate-300">
                            Inventory Procurement
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-xs text-muted-foreground">
                          {p.purchasedByName || p.purchaseBy || "Admin"}
                        </td>
                        <td className="px-4 py-3.5 font-medium text-foreground">
                          ${paid.toFixed(2)}
                        </td>
                        <td className="px-4 py-3.5 font-medium text-amber-600">
                          ${due.toFixed(2)}
                        </td>
                        <td className="px-4 py-3.5 text-right font-bold text-rose-600 dark:text-rose-400 font-sans">
                          -${cost.toFixed(2)}
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
    </div>
  )
}
