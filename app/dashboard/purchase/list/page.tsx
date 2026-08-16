"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { IconPlus, IconSearch, IconEye, IconTrash, IconClipboardList, IconLoader2, IconCheck } from "@tabler/icons-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { getPurchases, updatePurchaseStatus, Purchase } from "@/lib/api"

export default function PurchaseListPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  const fetchPurchases = async () => {
    try {
      setLoading(true)
      const data = await getPurchases()
      setPurchases(data)
    } catch (error) {
      console.error("Failed to load purchases:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPurchases()
  }, [])

  // Filter purchases based on search query
  const filteredPurchases = purchases.filter((po) => {
    const inv = (po.invoice_number || po.invoiceNumber || "").toLowerCase()
    const sup = (po.supplierName || po.supplier || "").toLowerCase()
    const by = (po.purchasedByName || po.purchaseBy || "").toLowerCase()
    const q = searchQuery.toLowerCase()
    return inv.includes(q) || sup.includes(q) || by.includes(q)
  })

  // Format currency helper
  const formatMoney = (value: number) => {
    return "$" + Number(value || 0).toFixed(2)
  }

  const handleMarkReceived = async (id: number) => {
    try {
      const res = await updatePurchaseStatus(id, "received")
      if (res.success && res.result) {
        setPurchases(prev => prev.map(p => p.id === id ? res.result! : p))
        alert("Purchase Order marked as Received! Product stock has been increased.")
      }
    } catch (error) {
      console.error("Failed to update status:", error)
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 bg-slate-50/50 dark:bg-background">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-500 font-bold shadow-2xs">
            <IconClipboardList className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Purchase Orders</h1>
            <p className="text-sm text-muted-foreground">View and manage raw material & stock purchase records from MySQL</p>
          </div>
        </div>
        <Link href="/dashboard/purchase/create">
          <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer">
            <IconPlus className="h-4 w-4" /> Create Purchase
          </Button>
        </Link>
      </div>

      <Card className="border bg-card shadow-2xs">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Purchase History</CardTitle>
            <CardDescription>
              Total {filteredPurchases.length} purchase order{filteredPurchases.length !== 1 && "s"} found
            </CardDescription>
          </div>
          <div className="relative w-full sm:w-64">
            <IconSearch className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search ID, supplier, purchaser..." 
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
                <span>Loading purchase orders from MySQL...</span>
              </div>
            ) : filteredPurchases.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground font-semibold">
                No purchases found matching "{searchQuery}"
              </div>
            ) : (
              <table className="w-full text-left text-sm whitespace-nowrap md:whitespace-normal">
                <thead className="border-y bg-muted/40 text-xs font-semibold text-muted-foreground uppercase">
                  <tr>
                    <th className="px-4 py-3 w-12">N.o</th>
                    <th className="px-4 py-3">Invoice</th>
                    <th className="px-4 py-3">Supplier</th>
                    <th className="px-4 py-3">Purchase By</th>
                    <th className="px-4 py-3">Total Cost</th>
                    <th className="px-4 py-3">Paid Amount</th>
                    <th className="px-4 py-3">Due Amount</th>
                    <th className="px-4 py-3">Purchase Status</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredPurchases.map((po, index) => {
                    const totalCost = Number(po.total_cost || po.totalCost || 0)
                    const paidAmount = Number(po.paid_amount || po.paidAmount || 0)
                    const dueAmount = Number(po.due_amount || po.dueAmount || 0)
                    const status = po.purchase_status || po.purchaseStatus || "pending"
                    const dateStr = po.purchase_date || po.purchaseDate || po.created_at
                    const formattedDate = dateStr ? new Date(dateStr).toLocaleDateString() : "-"

                    return (
                      <tr key={po.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3.5 font-medium text-muted-foreground">
                          {index + 1}
                        </td>
                        <td className="px-4 py-3.5 font-mono text-xs font-bold text-foreground">
                          {po.invoice_number || po.invoiceNumber}
                        </td>
                        <td className="px-4 py-3.5 font-semibold text-foreground">
                          {po.supplierName || po.supplier}
                        </td>
                        <td className="px-4 py-3.5 text-muted-foreground">{po.purchasedByName || po.purchaseBy || "Admin"}</td>
                        <td className="px-4 py-3.5 font-bold text-foreground">{formatMoney(totalCost)}</td>
                        <td className="px-4 py-3.5 font-semibold text-emerald-600">{formatMoney(paidAmount)}</td>
                        <td className="px-4 py-3.5 font-semibold text-rose-500">{formatMoney(dueAmount)}</td>
                        
                        {/* Purchase Status Badge */}
                        <td className="px-4 py-3.5">
                          <span
                            className={cn(
                              "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize",
                              status === "received" && "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
                              status === "pending" && "bg-amber-500/10 text-amber-700 dark:text-amber-400",
                              status === "ordered" && "bg-blue-500/10 text-blue-700 dark:text-blue-400",
                              status === "cancel" && "bg-rose-500/10 text-rose-700 dark:text-rose-400"
                            )}
                          >
                            {status}
                          </span>
                        </td>

                        <td className="px-4 py-3.5 text-muted-foreground text-xs">{formattedDate}</td>
                        <td className="px-4 py-3.5 text-right space-x-2">
                          {status !== "received" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleMarkReceived(po.id)}
                              className="text-xs h-7 gap-1 border-emerald-500 text-emerald-600 hover:bg-emerald-50 cursor-pointer"
                            >
                              <IconCheck className="h-3.5 w-3.5" /> Mark Received
                            </Button>
                          )}
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
