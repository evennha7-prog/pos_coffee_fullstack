"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { IconPlus, IconSearch, IconEye, IconTrash, IconReceipt, IconCreditCard } from "@tabler/icons-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface Sale {
  id: string
  no: number
  invoice: string
  saleBy: string
  customer: string
  totalCostKHR: number
  totalCostUSD: number
  dueAmountKHR: number
  dueAmountUSD: number
  paidAmountKHR: number
  paidAmountUSD: number
  changeAmountKHR: number
  changeAmountUSD: number
  paymentStatus: "PAID" | "PARTIAL" | "UNPAID"
  createdAt: string
}

export default function SaleListPage() {
  const [sales, setSales] = useState<Sale[]>([
    {
      id: "S-00008",
      no: 1,
      invoice: "000008",
      saleBy: "super",
      customer: "chan",
      totalCostKHR: 2500,
      totalCostUSD: 0.63,
      dueAmountKHR: 0,
      dueAmountUSD: 0.00,
      paidAmountKHR: 40000,
      paidAmountUSD: 10.00,
      changeAmountKHR: 37500,
      changeAmountUSD: 9.38,
      paymentStatus: "PAID",
      createdAt: "21/Jul/2026",
    },
    {
      id: "S-00007",
      no: 2,
      invoice: "000007",
      saleBy: "super",
      customer: "chan",
      totalCostKHR: 3000,
      totalCostUSD: 0.75,
      dueAmountKHR: 0,
      dueAmountUSD: 0.00,
      paidAmountKHR: 3000,
      paidAmountUSD: 0.75,
      changeAmountKHR: 0,
      changeAmountUSD: 0.00,
      paymentStatus: "PAID",
      createdAt: "16/Jul/2026",
    },
    {
      id: "S-00006",
      no: 3,
      invoice: "000006",
      saleBy: "super",
      customer: "chan",
      totalCostKHR: 3000,
      totalCostUSD: 0.75,
      dueAmountKHR: 0,
      dueAmountUSD: 0.00,
      paidAmountKHR: 3000,
      paidAmountUSD: 0.75,
      changeAmountKHR: 0,
      changeAmountUSD: 0.00,
      paymentStatus: "PAID",
      createdAt: "15/Jul/2026",
    },
    {
      id: "S-00005",
      no: 4,
      invoice: "000005",
      saleBy: "super",
      customer: "chan",
      totalCostKHR: 2000,
      totalCostUSD: 0.50,
      dueAmountKHR: 0,
      dueAmountUSD: 0.00,
      paidAmountKHR: 2000,
      paidAmountUSD: 0.50,
      changeAmountKHR: 0,
      changeAmountUSD: 0.00,
      paymentStatus: "PAID",
      createdAt: "15/Jul/2026",
    },
    {
      id: "S-00004",
      no: 5,
      invoice: "000004",
      saleBy: "super",
      customer: "chan",
      totalCostKHR: 3000,
      totalCostUSD: 0.75,
      dueAmountKHR: 0,
      dueAmountUSD: 0.00,
      paidAmountKHR: 3000,
      paidAmountUSD: 0.75,
      changeAmountKHR: 0,
      changeAmountUSD: 0.00,
      paymentStatus: "PAID",
      createdAt: "15/Jul/2026",
    },
    {
      id: "S-00003",
      no: 6,
      invoice: "000003",
      saleBy: "super",
      customer: "chan",
      totalCostKHR: 20000,
      totalCostUSD: 5.00,
      dueAmountKHR: 0,
      dueAmountUSD: 0.00,
      paidAmountKHR: 20000,
      paidAmountUSD: 5.00,
      changeAmountKHR: 0,
      changeAmountUSD: 0.00,
      paymentStatus: "PAID",
      createdAt: "15/Jul/2026",
    },
    {
      id: "S-00002",
      no: 7,
      invoice: "000002",
      saleBy: "super",
      customer: "chan",
      totalCostKHR: 5500,
      totalCostUSD: 1.38,
      dueAmountKHR: 0,
      dueAmountUSD: 0.00,
      paidAmountKHR: 5500,
      paidAmountUSD: 1.38,
      changeAmountKHR: 0,
      changeAmountUSD: 0.00,
      paymentStatus: "PAID",
      createdAt: "15/Jul/2026",
    },
    {
      id: "S-00001",
      no: 8,
      invoice: "000001",
      saleBy: "super",
      customer: "chan",
      totalCostKHR: 4500,
      totalCostUSD: 1.13,
      dueAmountKHR: 4499,
      dueAmountUSD: 1.12,
      paidAmountKHR: 1,
      paidAmountUSD: 0.00,
      changeAmountKHR: 0,
      changeAmountUSD: 0.00,
      paymentStatus: "PARTIAL",
      createdAt: "15/Jul/2026",
    },
  ])

  const [searchQuery, setSearchQuery] = useState("")

  // Filter sales based on search query
  const filteredSales = sales.filter((sale) =>
    sale.invoice.includes(searchQuery) ||
    sale.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sale.saleBy.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Format money KHR helper
  const formatKHR = (value: number) => {
    return new Intl.NumberFormat("en-US").format(value) + "៛"
  }

  // Format money USD helper
  const formatUSD = (value: number) => {
    return `($${value.toFixed(2)})`
  }

  // Handle transaction delete
  const handleDelete = (id: string, invoice: string) => {
    if (window.confirm(`Are you sure you want to delete invoice "${invoice}"?`)) {
      setSales(sales.filter(s => s.id !== id))
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 bg-slate-50/50 dark:bg-background">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/15 text-violet-500 font-bold shadow-2xs">
            <IconReceipt className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Sales Records</h1>
            <p className="text-sm text-muted-foreground">View and track customer sales & receipt transactions</p>
          </div>
        </div>
        <Link href="/dashboard/sale/pos">
          <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer">
            <IconPlus className="h-4 w-4" /> Open POS Terminal
          </Button>
        </Link>
      </div>

      <Card className="border bg-card shadow-2xs">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Completed Sales Transactions</CardTitle>
            <CardDescription>
              Total {filteredSales.length} transaction{filteredSales.length !== 1 && "s"} found
            </CardDescription>
          </div>
          <div className="relative w-full sm:w-64">
            <IconSearch className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search invoice, customer..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 text-sm h-9" 
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            {filteredSales.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground font-semibold">
                No sales found matching "{searchQuery}"
              </div>
            ) : (
              <table className="w-full text-left text-sm whitespace-nowrap lg:whitespace-normal">
                <thead className="border-y bg-muted/40 text-xs font-semibold text-muted-foreground uppercase">
                  <tr>
                    <th className="px-4 py-3 w-12 text-center">N.o</th>
                    <th className="px-4 py-3">Invoice</th>
                    <th className="px-4 py-3">Sale By</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Total Cost</th>
                    <th className="px-4 py-3">Due Amount</th>
                    <th className="px-4 py-3">Paid Amount</th>
                    <th className="px-4 py-3">Change Amount</th>
                    <th className="px-4 py-3">Payment Status</th>
                    <th className="px-4 py-3">Created At</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredSales.map((sale, idx) => (
                    <tr key={sale.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3.5 text-center font-bold text-foreground">
                        {idx + 1}
                      </td>
                      <td className="px-4 py-3.5 font-mono text-foreground font-semibold">
                        {sale.invoice}
                      </td>
                      <td className="px-4 py-3.5 text-muted-foreground font-semibold">
                        {sale.saleBy}
                      </td>
                      <td className="px-4 py-3.5 text-muted-foreground font-semibold">
                        {sale.customer}
                      </td>
                      
                      {/* Cost Column */}
                      <td className="px-4 py-3.5 font-semibold">
                        <div className="text-red-500 dark:text-red-400 font-bold">{formatKHR(sale.totalCostKHR)}</div>
                        <div className="text-xs text-muted-foreground">{formatUSD(sale.totalCostUSD)}</div>
                      </td>

                      {/* Due Column */}
                      <td className="px-4 py-3.5 font-semibold">
                        <div className="text-red-500 dark:text-red-400 font-bold">{formatKHR(sale.dueAmountKHR)}</div>
                        <div className="text-xs text-muted-foreground">{formatUSD(sale.dueAmountUSD)}</div>
                      </td>

                      {/* Paid Column */}
                      <td className="px-4 py-3.5 font-semibold">
                        <div className="text-red-500 dark:text-red-400 font-bold">{formatKHR(sale.paidAmountKHR)}</div>
                        <div className="text-xs text-muted-foreground">{formatUSD(sale.paidAmountUSD)}</div>
                      </td>

                      {/* Change Column */}
                      <td className="px-4 py-3.5 font-semibold">
                        <div className="text-red-500 dark:text-red-400 font-bold">{formatKHR(sale.changeAmountKHR)}</div>
                        <div className="text-xs text-muted-foreground">{formatUSD(sale.changeAmountUSD)}</div>
                      </td>

                      {/* Status Column */}
                      <td className="px-4 py-3.5">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wider",
                            sale.paymentStatus === "PAID" && "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20",
                            sale.paymentStatus === "PARTIAL" && "bg-amber-500/10 text-amber-600 border border-amber-500/20",
                            sale.paymentStatus === "UNPAID" && "bg-rose-500/10 text-rose-600 border border-rose-500/20"
                          )}
                        >
                          {sale.paymentStatus}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 text-muted-foreground text-xs font-semibold">{sale.createdAt}</td>
                      
                      <td className="px-4 py-3.5 text-right space-x-2">
                        <Button variant="ghost" size="icon-sm" className="h-8 w-8 cursor-pointer text-muted-foreground">
                          <IconCreditCard className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon-sm" className="h-8 w-8 cursor-pointer text-muted-foreground">
                          <IconEye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon-sm" 
                          onClick={() => handleDelete(sale.id, sale.invoice)}
                          className="h-8 w-8 text-destructive cursor-pointer"
                        >
                          <IconTrash className="h-4 w-4" />
                        </Button>
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
  )
}
