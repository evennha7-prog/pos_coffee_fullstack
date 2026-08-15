"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { IconChartLine, IconDownload, IconPrinter, IconTrendingUp, IconCurrencyDollar, IconShoppingBag } from "@tabler/icons-react"

export default function SaleReportPage() {
  const [dateRange, setDateRange] = useState("This Month")

  const reportMetrics = [
    { title: "Total Sales Revenue", value: "$4,128.50", change: "+16.8%", icon: <IconCurrencyDollar className="h-5 w-5 text-emerald-600" /> },
    { title: "Total Orders Completed", value: "342", change: "+12.4%", icon: <IconShoppingBag className="h-5 w-5 text-blue-600" /> },
    { title: "Average Order Value", value: "$12.07", change: "+4.2%", icon: <IconTrendingUp className="h-5 w-5 text-amber-600" /> },
  ]

  const salesData = [
    { date: "2026-07-21", orders: 48, cash: "$180.00", khqr: "$320.00", card: "$90.00", total: "$590.00" },
    { date: "2026-07-20", orders: 52, cash: "$210.00", khqr: "$380.00", card: "$110.00", total: "$700.00" },
    { date: "2026-07-19", orders: 45, cash: "$160.00", khqr: "$290.00", card: "$80.00", total: "$530.00" },
    { date: "2026-07-18", orders: 60, cash: "$240.00", khqr: "$450.00", card: "$150.00", total: "$840.00" },
  ]

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 bg-slate-50/50 dark:bg-background">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/15 text-sky-500 font-bold shadow-2xs">
            <IconChartLine className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Sales Report & Analytics</h1>
            <p className="text-sm text-muted-foreground">Comprehensive sales revenue breakdown and payment summaries</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5">
            <IconPrinter className="h-4 w-4" /> Print
          </Button>
          <Button size="sm" className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
            <IconDownload className="h-4 w-4" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Date Range Filter Pills */}
      <div className="flex gap-2">
        {["Today", "This Week", "This Month", "This Year"].map((range) => (
          <Button
            key={range}
            variant={dateRange === range ? "default" : "outline"}
            size="sm"
            onClick={() => setDateRange(range)}
            className={dateRange === range ? "bg-emerald-600 text-white hover:bg-emerald-700" : ""}
          >
            {range}
          </Button>
        ))}
      </div>

      {/* Top Metrics Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {reportMetrics.map((m, i) => (
          <Card key={i} className="border bg-card shadow-2xs">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-muted-foreground">{m.title}</div>
                <div className="text-2xl font-bold text-foreground mt-1">{m.value}</div>
                <div className="text-xs font-semibold text-emerald-600 mt-1">{m.change} vs prev period</div>
              </div>
              <div className="h-10 w-10 rounded-xl bg-muted/40 flex items-center justify-center">
                {m.icon}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Daily Sales Breakdown Table */}
      <Card className="border bg-card shadow-2xs">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <IconChartLine className="h-5 w-5 text-emerald-600" />
            Daily Sales Revenue Breakdown
          </CardTitle>
          <CardDescription>Sales figures categorized by date and payment method</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-y bg-muted/40 text-xs font-medium text-muted-foreground uppercase">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Total Orders</th>
                  <th className="px-4 py-3">Cash Sales</th>
                  <th className="px-4 py-3">KHQR Sales</th>
                  <th className="px-4 py-3">Card Sales</th>
                  <th className="px-4 py-3 text-right">Total Daily Sales</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {salesData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-muted/30">
                    <td className="px-4 py-3.5 font-medium">{row.date}</td>
                    <td className="px-4 py-3.5 text-muted-foreground">{row.orders} orders</td>
                    <td className="px-4 py-3.5 font-mono">{row.cash}</td>
                    <td className="px-4 py-3.5 font-mono">{row.khqr}</td>
                    <td className="px-4 py-3.5 font-mono">{row.card}</td>
                    <td className="px-4 py-3.5 text-right font-bold text-emerald-600">{row.total}</td>
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

