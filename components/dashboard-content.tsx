"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  IconCurrencyDollar,
  IconFileInvoice,
  IconShoppingBag,
  IconWallet,
  IconUser,
  IconBuildingStore,
  IconFileText,
  IconReceipt,
  IconLoader2,
} from "@tabler/icons-react"
import { getGeneralReport, getSaleReport30Days, GeneralReport } from "@/lib/api"

export function DashboardContent() {
  const [report, setReport] = useState<GeneralReport | null>(null)
  const [thirtyDaysData, setThirtyDaysData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true)
        const [genReport, days30] = await Promise.all([
          getGeneralReport(),
          getSaleReport30Days(),
        ])
        setReport(genReport)
        setThirtyDaysData(days30 || [])
      } catch (err) {
        console.error("Failed to load dashboard statistics:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [])

  const statCards = [
    {
      title: "Today Revenue",
      value: `$${Number(report?.todayRevenue || 0).toFixed(2)}`,
      subValue: `${Math.round(Number(report?.todayRevenue || 0) * 4100).toLocaleString()} ៛`,
      valueColor: "text-amber-500",
      icon: <IconCurrencyDollar className="h-5 w-5 text-amber-600" />,
      iconBg: "bg-amber-100 dark:bg-amber-900/30",
    },
    {
      title: "Due Invoice",
      value: `$${Number(report?.dueInvoice || 0).toFixed(2)}`,
      subValue: `${Math.round(Number(report?.dueInvoice || 0) * 4100).toLocaleString()} ៛`,
      valueColor: "text-pink-500",
      icon: <IconFileInvoice className="h-5 w-5 text-pink-600" />,
      iconBg: "bg-pink-100 dark:bg-pink-900/30",
    },
    {
      title: "Due Purchase",
      value: `$${Number(report?.duePurchase || 0).toFixed(2)}`,
      subValue: `${Math.round(Number(report?.duePurchase || 0) * 4100).toLocaleString()} ៛`,
      valueColor: "text-purple-500",
      icon: <IconShoppingBag className="h-5 w-5 text-purple-600" />,
      iconBg: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      title: "Monthly Revenue",
      value: `$${Number(report?.monthlyRevenue || 0).toFixed(2)}`,
      subValue: `${Math.round(Number(report?.monthlyRevenue || 0) * 4100).toLocaleString()} ៛`,
      valueColor: "text-emerald-500 font-bold",
      icon: <IconWallet className="h-5 w-5 text-emerald-600" />,
      iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
    },
    {
      title: "Customers",
      value: `${report?.customers || 0}`,
      subValue: "Registered",
      valueColor: "text-foreground font-bold",
      icon: <IconUser className="h-5 w-5 text-orange-600" />,
      iconBg: "bg-orange-100 dark:bg-orange-900/30",
    },
    {
      title: "Suppliers",
      value: `${report?.suppliers || 0}`,
      subValue: "Active Partners",
      valueColor: "text-foreground font-bold",
      icon: <IconBuildingStore className="h-5 w-5 text-blue-600" />,
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      title: "Purchase Due Invoices",
      value: `${report?.purchaseDueInvoice || 0}`,
      subValue: "Orders pending",
      valueColor: "text-foreground font-bold",
      icon: <IconFileText className="h-5 w-5 text-slate-600" />,
      iconBg: "bg-slate-100 dark:bg-slate-800",
    },
    {
      title: "Sales Due Invoices",
      value: `${report?.saleDueInvoice || 0}`,
      subValue: "Pending collection",
      valueColor: "text-foreground font-bold",
      icon: <IconReceipt className="h-5 w-5 text-teal-600" />,
      iconBg: "bg-teal-100 dark:bg-teal-900/30",
    },
  ]

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 bg-slate-50/50 dark:bg-background">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Coffee POS Dashboard</h1>
          <p className="text-sm text-muted-foreground">Real-time metrics connected to MySQL Database</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground gap-2">
          <IconLoader2 className="h-6 w-6 animate-spin text-primary" />
          <span>Fetching live reports from MySQL...</span>
        </div>
      ) : (
        <>
          {/* 8 Stat Cards Grid (4 columns x 2 rows) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((card, index) => (
              <Card key={index} className="border bg-card shadow-2xs hover:shadow-xs transition-shadow">
                <CardContent className="p-5 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {card.title}
                    </div>
                    <div className={`text-2xl font-bold ${card.valueColor}`}>
                      {card.value}
                    </div>
                    <div className="text-[11px] text-muted-foreground font-mono">
                      {card.subValue}
                    </div>
                  </div>
                  <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${card.iconBg}`}>
                    {card.icon}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Sale in 30 days Chart Section */}
          <Card className="border bg-card shadow-2xs">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-base font-semibold text-foreground">
                  Sales Trend (Past 30 Days)
                </CardTitle>
                <p className="text-xs text-muted-foreground">Aggregated order totals and volume from MySQL</p>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              {thirtyDaysData.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground text-sm">
                  No sales recorded in the past 30 days. Complete orders on POS to generate activity.
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {thirtyDaysData.slice(0, 8).map((day, idx) => (
                      <div key={idx} className="p-3 border rounded-xl bg-muted/20">
                        <div className="text-xs font-semibold text-muted-foreground">{day.saleDate}</div>
                        <div className="text-lg font-bold text-emerald-600">${Number(day.totalRevenue || 0).toFixed(2)}</div>
                        <div className="text-[11px] text-muted-foreground">{day.totalOrders || 0} order(s)</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
