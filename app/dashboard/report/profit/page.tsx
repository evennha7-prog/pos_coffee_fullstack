"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  IconScale,
  IconCurrencyDollar,
  IconPrinter,
  IconRefresh,
  IconTrendingUp,
  IconTrendingDown,
  IconArrowUpRight,
  IconArrowDownRight,
  IconPigMoney,
  IconLoader2,
  IconPercentage,
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { getSales, getPurchases, Sale, Purchase } from "@/lib/api"

export default function ProfitReportPage() {
  const [sales, setSales] = useState<Sale[]>([])
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState<"all" | "today" | "7days" | "30days">("all")

  const fetchData = async () => {
    try {
      setLoading(true)
      const [salesList, purchasesList] = await Promise.all([
        getSales({ limit: 200 }),
        getPurchases({ limit: 200 }),
      ])
      setSales(salesList || [])
      setPurchases(purchasesList || [])
    } catch (err) {
      console.error("Failed to load profit data:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Filter Sales
  const filteredSales = useMemo(() => {
    return sales.filter((s) => {
      if (timeframe === "all" || !s.created_at) return true
      const saleDate = new Date(s.created_at)
      const now = new Date()
      if (timeframe === "today") return saleDate.toDateString() === now.toDateString()
      if (timeframe === "7days") return saleDate >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      if (timeframe === "30days") return saleDate >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      return true
    })
  }, [sales, timeframe])

  // Filter Purchases
  const filteredPurchases = useMemo(() => {
    return purchases.filter((p) => {
      const dateStr = p.purchase_date || p.purchaseDate || p.created_at
      if (timeframe === "all" || !dateStr) return true
      const pDate = new Date(dateStr)
      const now = new Date()
      if (timeframe === "today") return pDate.toDateString() === now.toDateString()
      if (timeframe === "7days") return pDate >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      if (timeframe === "30days") return pDate >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      return true
    })
  }, [purchases, timeframe])

  // Calculations
  const totalRevenue = filteredSales.reduce((sum, s) => sum + Number(s.total_cost || 0), 0)
  const totalExpenses = filteredPurchases.reduce((sum, p) => sum + Number(p.total_cost || p.totalCost || 0), 0)
  const netProfit = totalRevenue - totalExpenses
  const isProfitable = netProfit >= 0
  const profitMargin = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100) : 0

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 bg-slate-50/60 dark:bg-background">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-white dark:bg-card p-4 rounded-2xl border border-slate-200/80 dark:border-border shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 font-bold shadow-2xs">
            <IconPigMoney className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
              Profit & Loss (P&L) Report
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Comprehensive net profitability analysis comparing sales income against goods procurement costs
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
            onClick={fetchData}
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
        {/* Net Profit */}
        <Card className="border border-slate-200/80 dark:border-border bg-white dark:bg-card shadow-2xs rounded-2xl">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Net Profit (Loss)</p>
              <h3
                className={cn(
                  "text-2xl font-bold mt-1",
                  isProfitable ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600"
                )}
              >
                {isProfitable ? `+$${netProfit.toFixed(2)}` : `-$${Math.abs(netProfit).toFixed(2)}`}
              </h3>
              <p className="text-[11px] font-mono text-muted-foreground mt-0.5">
                ៛{Math.round(netProfit * 4100).toLocaleString()}
              </p>
            </div>
            <div
              className={cn(
                "h-10 w-10 rounded-xl flex items-center justify-center",
                isProfitable ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"
              )}
            >
              <IconScale className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Profit Margin */}
        <Card className="border border-slate-200/80 dark:border-border bg-white dark:bg-card shadow-2xs rounded-2xl">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Profit Margin</p>
              <h3 className="text-2xl font-bold text-foreground mt-1">
                {profitMargin.toFixed(1)}%
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {profitMargin >= 30 ? "Healthy return" : profitMargin >= 0 ? "Modest margin" : "Deficit"}
              </p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600">
              <IconPercentage className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Gross Revenue */}
        <Card className="border border-slate-200/80 dark:border-border bg-white dark:bg-card shadow-2xs rounded-2xl">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Gross Sales Revenue</p>
              <h3 className="text-2xl font-bold text-emerald-600 mt-1">
                ${totalRevenue.toFixed(2)}
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {filteredSales.length} sale transactions
              </p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
              <IconArrowUpRight className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Total Cost */}
        <Card className="border border-slate-200/80 dark:border-border bg-white dark:bg-card shadow-2xs rounded-2xl">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Total Goods Cost</p>
              <h3 className="text-2xl font-bold text-rose-600 mt-1">
                ${totalExpenses.toFixed(2)}
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {filteredPurchases.length} purchase orders
              </p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-600">
              <IconArrowDownRight className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* P&L Breakdown Summary Table */}
      <Card className="border border-slate-200/90 dark:border-border bg-card shadow-2xs rounded-2xl overflow-hidden">
        <CardHeader className="border-b bg-slate-50/40 dark:bg-muted/20 pb-4">
          <CardTitle className="text-base font-bold">Profit & Loss Financial Statement</CardTitle>
          <CardDescription className="text-xs">
            Summary reconciliation of business earnings vs expenditures
          </CardDescription>
        </CardHeader>

        <CardContent className="p-4 sm:p-6 space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
              <IconLoader2 className="h-8 w-8 animate-spin text-purple-600" />
              <span className="text-sm font-medium">Computing profit statement...</span>
            </div>
          ) : (
            <div className="space-y-4 text-sm">
              {/* Financial Lines */}
              <div className="divide-y rounded-xl border border-border overflow-hidden bg-slate-50/50 dark:bg-muted/20">
                <div className="p-3.5 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-foreground">1. Total Inflow / Sales Income</p>
                    <p className="text-xs text-muted-foreground">Revenue from customer purchases across all categories</p>
                  </div>
                  <span className="font-bold text-emerald-600 text-base font-sans">
                    +${totalRevenue.toFixed(2)}
                  </span>
                </div>

                <div className="p-3.5 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-foreground">2. Cost of Goods Sold (COGS) & Procurement</p>
                    <p className="text-xs text-muted-foreground">Inventory supplier orders, ingredients, and store supplies</p>
                  </div>
                  <span className="font-bold text-rose-600 text-base font-sans">
                    -${totalExpenses.toFixed(2)}
                  </span>
                </div>

                <div className="p-4 flex items-center justify-between bg-slate-100 dark:bg-muted/60">
                  <div>
                    <p className="font-bold text-foreground text-base">Net Operating Profit</p>
                    <p className="text-xs text-muted-foreground">Total Income minus Total Procurement Expenses</p>
                  </div>
                  <div className="text-right">
                    <span
                      className={cn(
                        "font-extrabold text-xl font-sans",
                        isProfitable ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600"
                      )}
                    >
                      {isProfitable ? `+$${netProfit.toFixed(2)}` : `-$${Math.abs(netProfit).toFixed(2)}`}
                    </span>
                    <p className="text-xs font-mono text-muted-foreground">
                      ៛{Math.round(netProfit * 4100).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress Visual Bar */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs font-medium">
                  <span>Revenue Recovery vs Cost Ratio</span>
                  <span className="font-bold text-purple-600 font-mono">{profitMargin.toFixed(1)}% Net Margin</span>
                </div>
                <div className="h-3 w-full bg-slate-200 dark:bg-muted rounded-full overflow-hidden flex">
                  <div
                    style={{ width: `${Math.min(100, Math.max(0, profitMargin))}%` }}
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
