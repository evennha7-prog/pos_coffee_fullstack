"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { IconPlus, IconSearch, IconEye, IconTrash, IconReceipt, IconCreditCard, IconLoader2 } from "@tabler/icons-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { getSales, Sale } from "@/lib/api"

export default function SaleListPage() {
  const [sales, setSales] = useState<Sale[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  const fetchSales = async () => {
    try {
      setLoading(true)
      const data = await getSales()
      setSales(data)
    } catch (error) {
      console.error("Failed to load sales:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSales()
  }, [])

  // Filter sales based on search query
  const filteredSales = sales.filter((sale) => {
    const inv = (sale.invoice_number || sale.invoice || "").toLowerCase()
    const cust = (sale.customerName || sale.customer || "").toLowerCase()
    const user = (sale.cashierName || sale.saleBy || "").toLowerCase()
    const q = searchQuery.toLowerCase()
    return inv.includes(q) || cust.includes(q) || user.includes(q)
  })

  // Format money KHR helper
  const formatKHR = (value: number) => {
    return new Intl.NumberFormat("en-US").format(Math.round(value)) + "៛"
  }

  // Format money USD helper
  const formatUSD = (value: number) => {
    return `($${value.toFixed(2)})`
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
            <p className="text-sm text-muted-foreground">View and track customer sales & receipt transactions from MySQL</p>
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
              Total {filteredSales.length} transaction{filteredSales.length !== 1 && "s"} recorded
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
            {loading ? (
              <div className="flex items-center justify-center py-12 text-muted-foreground gap-2">
                <IconLoader2 className="h-5 w-5 animate-spin text-primary" />
                <span>Loading sales transactions...</span>
              </div>
            ) : filteredSales.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground font-semibold">
                No sales found. Open POS terminal to complete your first order!
              </div>
            ) : (
              <table className="w-full text-left text-sm whitespace-nowrap lg:whitespace-normal">
                <thead className="border-y bg-muted/40 text-xs font-semibold text-muted-foreground uppercase">
                  <tr>
                    <th className="px-4 py-3 w-12 text-center">N.o</th>
                    <th className="px-4 py-3">Invoice</th>
                    <th className="px-4 py-3">Cashier</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Total Cost</th>
                    <th className="px-4 py-3">Paid Amount</th>
                    <th className="px-4 py-3">Due Amount</th>
                    <th className="px-4 py-3">Change</th>
                    <th className="px-4 py-3">Payment Status</th>
                    <th className="px-4 py-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredSales.map((sale, idx) => {
                    const totalCost = Number(sale.total_cost || 0)
                    const paidAmount = Number(sale.paid_amount || 0)
                    const dueAmount = Number(sale.due_amount || 0)
                    const changeAmount = Number(sale.change_amount || 0)
                    const status = (sale.payment_status || "paid").toUpperCase()
                    const dateStr = sale.created_at ? new Date(sale.created_at).toLocaleDateString() : "-"

                    return (
                      <tr key={sale.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3.5 text-center font-bold text-foreground">
                          {idx + 1}
                        </td>
                        <td className="px-4 py-3.5 font-mono text-foreground font-semibold">
                          {sale.invoice_number || sale.invoice}
                        </td>
                        <td className="px-4 py-3.5 text-muted-foreground font-semibold">
                          {sale.cashierName || sale.saleBy || "Cashier"}
                        </td>
                        <td className="px-4 py-3.5 text-muted-foreground font-semibold">
                          {sale.customerName || sale.customer || "Walk-in Customer"}
                        </td>
                        
                        {/* Cost Column */}
                        <td className="px-4 py-3.5 font-semibold">
                          <div className="text-emerald-600 dark:text-emerald-400 font-bold">${totalCost.toFixed(2)}</div>
                          <div className="text-xs text-muted-foreground">{formatKHR(totalCost * 4100)}</div>
                        </td>

                        {/* Paid Column */}
                        <td className="px-4 py-3.5 font-semibold">
                          <div className="text-foreground font-bold">${paidAmount.toFixed(2)}</div>
                          <div className="text-xs text-muted-foreground">{formatKHR(paidAmount * 4100)}</div>
                        </td>

                        {/* Due Column */}
                        <td className="px-4 py-3.5 font-semibold">
                          <div className="text-rose-500 font-bold">${dueAmount.toFixed(2)}</div>
                        </td>

                        {/* Change Column */}
                        <td className="px-4 py-3.5 font-semibold">
                          <div className="text-muted-foreground font-bold">${changeAmount.toFixed(2)}</div>
                          <div className="text-xs text-muted-foreground">{formatKHR(changeAmount * 4100)}</div>
                        </td>

                        {/* Status Column */}
                        <td className="px-4 py-3.5">
                          <span
                            className={cn(
                              "inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase",
                              status === "PAID" && "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20",
                              status === "PARTIAL" && "bg-amber-500/10 text-amber-600 border border-amber-500/20",
                              status === "DUE" && "bg-rose-500/10 text-rose-600 border border-rose-500/20"
                            )}
                          >
                            {status}
                          </span>
                        </td>

                        <td className="px-4 py-3.5 text-muted-foreground text-xs font-semibold">{dateStr}</td>
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
