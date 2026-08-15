"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  IconShoppingCart,
  IconCurrencyDollar,
  IconFileInvoice,
  IconShoppingBag,
  IconWallet,
  IconUser,
  IconBuildingStore,
  IconFileText,
  IconReceipt,
} from "@tabler/icons-react"

export function DashboardContent() {
  const [hoveredPoint, setHoveredPoint] = useState<{ date: string; cost: number; x: number; y: number } | null>({
    date: "15/Jul",
    cost: 3000,
    x: 420,
    y: 190,
  })

  const statCards = [
    {
      title: "Today Revenue",
      value: "0 ៛",
      valueColor: "text-amber-500",
      icon: <IconCurrencyDollar className="h-5 w-5 text-amber-600" />,
      iconBg: "bg-amber-100 dark:bg-amber-900/30",
    },
    {
      title: "Due Invoice",
      value: "0 ៛",
      valueColor: "text-pink-500",
      icon: <IconFileInvoice className="h-5 w-5 text-pink-600" />,
      iconBg: "bg-pink-100 dark:bg-pink-900/30",
    },
    {
      title: "Due Purchase",
      value: "0 ៛",
      valueColor: "text-purple-500",
      icon: <IconShoppingBag className="h-5 w-5 text-purple-600" />,
      iconBg: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      title: "Monthly Revenue",
      value: "41000 ៛",
      valueColor: "text-emerald-500 font-bold",
      icon: <IconWallet className="h-5 w-5 text-emerald-600" />,
      iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
    },
    {
      title: "Customers",
      value: "1",
      valueColor: "text-foreground font-bold",
      icon: <IconUser className="h-5 w-5 text-orange-600" />,
      iconBg: "bg-orange-100 dark:bg-orange-900/30",
    },
    {
      title: "Suppliers",
      value: "1",
      valueColor: "text-foreground font-bold",
      icon: <IconBuildingStore className="h-5 w-5 text-blue-600" />,
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      title: "Purchase Due Invoice",
      value: "0",
      valueColor: "text-foreground font-bold",
      icon: <IconFileText className="h-5 w-5 text-slate-600" />,
      iconBg: "bg-slate-100 dark:bg-slate-800",
    },
    {
      title: "Sales Due Invoice",
      value: "0",
      valueColor: "text-foreground font-bold",
      icon: <IconReceipt className="h-5 w-5 text-teal-600" />,
      iconBg: "bg-teal-100 dark:bg-teal-900/30",
    },
  ]

  // Chart data points
  const chartPoints = [
    { date: "01/Jul", cost: 4500, x: 80, y: 170 },
    { date: "05/Jul", cost: 5500, x: 220, y: 155 },
    { date: "10/Jul", cost: 20500, x: 340, y: 30 },
    { date: "15/Jul", cost: 3000, x: 460, y: 190 },
    { date: "20/Jul", cost: 2000, x: 580, y: 205 },
    { date: "25/Jul", cost: 3000, x: 700, y: 190 },
    { date: "30/Jul", cost: 3000, x: 820, y: 190 },
  ]

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 bg-slate-50/50 dark:bg-background">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
      </div>

      {/* 8 Stat Cards Grid (4 columns x 2 rows) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, index) => (
          <Card key={index} className="border bg-card shadow-2xs hover:shadow-xs transition-shadow">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-sm font-semibold text-muted-foreground">
                  {card.title}
                </div>
                <div className={`text-2xl font-bold ${card.valueColor}`}>
                  {card.value}
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
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-base font-medium text-foreground">
            Sale in 30 days
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="relative w-full overflow-x-auto">
            <svg
              viewBox="0 0 900 260"
              className="w-full h-auto min-w-[650px] overflow-visible"
            >
              <defs>
                <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Y-Axis Grid Lines & Labels */}
              {[
                { label: "20000", y: 30 },
                { label: "15000", y: 85 },
                { label: "10000", y: 140 },
                { label: "5000", y: 195 },
              ].map((grid, i) => (
                <g key={i}>
                  <text
                    x="60"
                    y={grid.y + 4}
                    textAnchor="end"
                    className="text-xs fill-muted-foreground font-mono"
                  >
                    {grid.label}
                  </text>
                  <line
                    x1="70"
                    y1={grid.y}
                    x2="850"
                    y2={grid.y}
                    stroke="currentColor"
                    strokeDasharray="3 3"
                    className="text-muted/40"
                    strokeWidth="1"
                  />
                </g>
              ))}

              {/* Vertical Grid Lines */}
              {[80, 220, 340, 460, 580, 700, 820].map((x, i) => (
                <line
                  key={i}
                  x1={x}
                  y1="20"
                  x2={x}
                  y2="210"
                  stroke="currentColor"
                  strokeDasharray="3 3"
                  className="text-muted/30"
                  strokeWidth="1"
                />
              ))}

              {/* Area Fill Under Line */}
              <path
                d="M 80,170 C 180,165 260,30 340,30 C 400,30 420,190 460,190 C 520,190 540,205 580,205 C 640,205 660,190 700,190 C 760,190 780,190 820,190 L 820,210 L 80,210 Z"
                fill="url(#emeraldGradient)"
              />

              {/* Smooth Curved Line */}
              <path
                d="M 80,170 C 180,165 260,30 340,30 C 400,30 420,190 460,190 C 520,190 540,205 580,205 C 640,205 660,190 700,190 C 760,190 780,190 820,190"
                fill="none"
                stroke="#34d399"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Interactive Data Points */}
              {chartPoints.map((pt, i) => (
                <g key={i} className="cursor-pointer" onClick={() => setHoveredPoint(pt)}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="5"
                    className="fill-background stroke-emerald-500 stroke-[2] transition-transform hover:scale-125"
                  />
                </g>
              ))}

              {/* Tooltip Overlay matching the screenshot */}
              {hoveredPoint && (
                <g transform={`translate(${hoveredPoint.x + 10}, ${hoveredPoint.y - 50})`}>
                  <rect
                    width="120"
                    height="54"
                    rx="4"
                    className="fill-background stroke-muted shadow-md"
                    strokeWidth="1"
                  />
                  <text x="12" y="22" className="text-xs font-semibold fill-foreground">
                    {hoveredPoint.date}
                  </text>
                  <text x="12" y="42" className="text-xs font-medium fill-emerald-500">
                    totalCost : {hoveredPoint.cost}
                  </text>
                </g>
              )}
            </svg>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
