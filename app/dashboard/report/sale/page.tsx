"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { IconChartLine, IconDownload, IconPrinter, IconCurrencyDollar, IconShoppingBag, IconLoader2 } from "@tabler/icons-react"
import { getGeneralReport, getSaleReport30Days, GeneralReport } from "@/lib/api"

export default function SaleReportPage() {
  const [report, setReport] = useState<GeneralReport | null>(null)
  const [salesData, setSalesData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true)
        const [genReport, days30] = await Promise.all([
          getGeneralReport(),
          getSaleReport30Days(),
        ])
        setReport(genReport)
        setSalesData(days30 || [])
      } catch (err) {
        console.error("Failed to load sales report:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchReport()
  }, [])

  const totalMonthlySales = Number(report?.monthlyRevenue || 0)
  const totalTodaySales = Number(report?.todayRevenue || 0)

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 bg-slate-50/50 dark:bg-background">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/15 text-sky-500 font-bold shadow-2xs">
            <IconChartLine className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Sales Report & Analytics</h1>
            <p className="text-sm text-muted-foreground">Live sales revenue breakdown from MySQL database</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 cursor-pointer">
            <IconPrinter className="h-4 w-4" /> Print
          </Button>
          <Button size="sm" className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold cursor-pointer">
            <IconDownload className="h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground gap-2">
          <IconLoader2 className="h-6 w-6 animate-spin text-primary" />
          <span>Loading live sales report from MySQL...</span>
        </div>
      ) : (
        <>
          {/* Top Metrics Cards */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="border bg-card shadow-2xs">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-muted-foreground">Today Sales Revenue</div>
                  <div className="text-2xl font-bold text-emerald-600 mt-1">${totalTodaySales.toFixed(2)}</div>
                  <div className="text-xs font-mono text-muted-foreground mt-0.5">
                    {Math.round(totalTodaySales * 4100).toLocaleString()} ៛
                  </div>
                </div>
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <IconCurrencyDollar className="h-5 w-5 text-emerald-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border bg-card shadow-2xs">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-muted-foreground">Monthly Sales Revenue</div>
                  <div className="text-2xl font-bold text-foreground mt-1">${totalMonthlySales.toFixed(2)}</div>
                  <div className="text-xs font-mono text-muted-foreground mt-0.5">
                    {Math.round(totalMonthlySales * 4100).toLocaleString()} ៛
                  </div>
                </div>
                <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <IconShoppingBag className="h-5 w-5 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Daily Sales Breakdown Table */}
          <Card className="border bg-card shadow-2xs">
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <IconChartLine className="h-5 w-5 text-emerald-600" />
                Daily Sales Revenue Breakdown
              </CardTitle>
              <CardDescription>Live sales activity logged in MySQL</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                {salesData.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground font-semibold">
                    No sales recorded yet. Process checkouts on the POS terminal to populate this report.
                  </div>
                ) : (
                  <table className="w-full text-left text-sm">
                    <thead className="border-y bg-muted/40 text-xs font-medium text-muted-foreground uppercase">
                      <tr>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Total Orders</th>
                        <th className="px-4 py-3 text-right">Daily Sales Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {salesData.map((row, idx) => (
                        <tr key={idx} className="hover:bg-muted/30">
                          <td className="px-4 py-3.5 font-medium">{row.saleDate}</td>
                          <td className="px-4 py-3.5 text-muted-foreground">{row.totalOrders} orders</td>
                          <td className="px-4 py-3.5 text-right font-bold text-emerald-600">
                            ${Number(row.totalRevenue || 0).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
