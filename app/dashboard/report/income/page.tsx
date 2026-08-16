"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  IconArrowUpRight,
  IconCurrencyDollar,
  IconPrinter,
  IconRefresh,
  IconTrendingUp,
  IconBuildingBank,
  IconCreditCard,
  IconCash,
  IconLoader2,
  IconChartBar,
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { getSales, getSaleReport30Days, Sale } from "@/lib/api"

export default function IncomeReportPage() {
  const [sales, setSales] = useState<Sale[]>([])
  const [trend30Days, setTrend30Days] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState<"all" | "today" | "7days" | "30days">("all")

  const fetchIncomeData = async () => {
    try {
      setLoading(true)
      const [salesList, days30] = await Promise.all([
        getSales({ limit: 200 }),
        getSaleReport30Days(),
      ])
      setSales(salesList || [])
      setTrend30Days(days30 || [])
    } catch (err) {
      console.error("Failed to load income data:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchIncomeData()
  }, [])

  const filteredSales = useMemo(() => {
    return sales.filter((s) => {
      if (timeframe === "all" || !s.created_at) return true
      const saleDate = new Date(s.created_at)
      const now = new Date()
      if (timeframe === "today") {
        return saleDate.toDateString() === now.toDateString()
      }
      if (timeframe === "7days") {
        const past7 = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        return saleDate >= past7
      }
      if (timeframe === "30days") {
        const past30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        return saleDate >= past30
      }
      return true
    })
  }, [sales, timeframe])

  // Calculations
  const grossIncome = filteredSales.reduce((sum, s) => sum + Number(s.total_cost || 0), 0)
  const collectedCash = filteredSales.reduce((sum, s) => sum + Number(s.paid_amount || 0), 0)
  const receivables = filteredSales.reduce((sum, s) => sum + Number(s.due_amount || 0), 0)
  const totalInvoices = filteredSales.length
  const avgIncomePerOrder = totalInvoices > 0 ? grossIncome / totalInvoices : 0

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 bg-slate-50/60 dark:bg-background">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-white dark:bg-card p-4 rounded-2xl border border-slate-200/80 dark:border-border shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 font-bold shadow-2xs">
            <IconArrowUpRight className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
              Income & Revenue Report
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Total business revenue, customer payment inflows, and cash intake analytics
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
            onClick={fetchIncomeData}
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
              <p className="text-xs font-semibold text-muted-foreground">Gross Sales Income</p>
              <h3 className="text-2xl font-bold text-emerald-600 mt-1">
                ${grossIncome.toFixed(2)}
              </h3>
              <p className="text-[11px] font-mono text-muted-foreground mt-0.5">
                ៛{Math.round(grossIncome * 4100).toLocaleString()}
              </p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
              <IconCurrencyDollar className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200/80 dark:border-border bg-white dark:bg-card shadow-2xs rounded-2xl">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Direct Cash Inflow</p>
              <h3 className="text-2xl font-bold text-foreground mt-1">
                ${collectedCash.toFixed(2)}
              </h3>
              <p className="text-[11px] font-mono text-muted-foreground mt-0.5">
                ៛{Math.round(collectedCash * 4100).toLocaleString()}
              </p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600">
              <IconCash className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200/80 dark:border-border bg-white dark:bg-card shadow-2xs rounded-2xl">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Average Order Value</p>
              <h3 className="text-2xl font-bold text-foreground mt-1">
                ${avgIncomePerOrder.toFixed(2)}
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Across {totalInvoices} orders
              </p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600">
              <IconTrendingUp className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200/80 dark:border-border bg-white dark:bg-card shadow-2xs rounded-2xl">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Accounts Receivable (Due)</p>
              <h3
                className={cn(
                  "text-2xl font-bold mt-1",
                  receivables > 0 ? "text-amber-600" : "text-slate-700 dark:text-slate-300"
                )}
              >
                ${receivables.toFixed(2)}
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {receivables > 0 ? "Uncollected balance" : "Fully collected"}
              </p>
            </div>
            <div
              className={cn(
                "h-10 w-10 rounded-xl flex items-center justify-center",
                receivables > 0 ? "bg-amber-500/10 text-amber-600" : "bg-slate-100 text-slate-500"
              )}
            >
              <IconCreditCard className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Income Daily Trends Table */}
      <Card className="border border-slate-200/90 dark:border-border bg-card shadow-2xs rounded-2xl overflow-hidden">
        <CardHeader className="border-b bg-slate-50/40 dark:bg-muted/20 pb-4">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <IconChartBar className="h-5 w-5 text-emerald-600" />
            Daily Income Timeline & Inflow Breakdown
          </CardTitle>
          <CardDescription className="text-xs">
            Aggregated revenue collected per operating day
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
                <IconLoader2 className="h-8 w-8 animate-spin text-emerald-600" />
                <span className="text-sm font-medium">Loading revenue timeline...</span>
              </div>
            ) : trend30Days.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                No revenue recorded yet. Process sales in POS terminal to see income breakdown.
              </div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="border-b bg-muted/40 text-xs font-semibold text-muted-foreground uppercase">
                  <tr>
                    <th className="px-4 py-3">Operating Date</th>
                    <th className="px-4 py-3">Transactions Count</th>
                    <th className="px-4 py-3">Average per Ticket</th>
                    <th className="px-4 py-3">Total KHR (៛)</th>
                    <th className="px-4 py-3 text-right">Daily Gross Income (USD)</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {trend30Days.map((row, i) => {
                    const dailyRev = Number(row.totalRevenue || 0)
                    const orders = Number(row.totalOrders || 1)
                    const avgTicket = orders > 0 ? dailyRev / orders : 0
                    return (
                      <tr key={i} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3.5 font-medium text-foreground">
                          {row.saleDate}
                        </td>
                        <td className="px-4 py-3.5 text-muted-foreground">
                          {orders} order{orders !== 1 && "s"}
                        </td>
                        <td className="px-4 py-3.5 text-muted-foreground font-mono">
                          ${avgTicket.toFixed(2)}
                        </td>
                        <td className="px-4 py-3.5 font-mono text-xs text-muted-foreground">
                          ៛{Math.round(dailyRev * 4100).toLocaleString()}
                        </td>
                        <td className="px-4 py-3.5 text-right font-bold text-emerald-600 dark:text-emerald-400 font-sans">
                          +${dailyRev.toFixed(2)}
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
