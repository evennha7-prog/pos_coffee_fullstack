"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { IconPlus, IconSearch, IconEye, IconTrash, IconClipboardList } from "@tabler/icons-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface Purchase {
  id: string
  no: number
  supplier: string
  purchaseBy: string
  totalCost: number
  dueAmount: number
  paidAmount: number
  changeAmount: number
  paymentStatus: "Paid" | "Pending" | "Partial"
  purchaseStatus: "Received" | "Pending" | "Ordered"
  purchaseDate: string
}

export default function PurchaseListPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([
    {
      id: "PO-2026-001",
      no: 1,
      supplier: "Highland Coffee Beans Co.",
      purchaseBy: "Admin",
      totalCost: 500000.00,
      dueAmount: 0.00,
      paidAmount: 500000.00,
      changeAmount: 0.00,
      paymentStatus: "Paid",
      purchaseStatus: "Received",
      purchaseDate: "2026-07-20",
    },
    {
      id: "PO-2026-002",
      no: 2,
      supplier: "Fresh Dairy Milk Supplies",
      purchaseBy: "Manager",
      totalCost: 136000.00,
      dueAmount: 0.00,
      paidAmount: 136000.00,
      changeAmount: 0.00,
      paymentStatus: "Paid",
      purchaseStatus: "Received",
      purchaseDate: "2026-07-19",
    },
    {
      id: "PO-2026-003",
      no: 3,
      supplier: "Artisan Bakery Wholesales",
      purchaseBy: "Admin",
      totalCost: 208000.00,
      dueAmount: 208000.00,
      paidAmount: 0.00,
      changeAmount: 0.00,
      paymentStatus: "Pending",
      purchaseStatus: "Pending",
      purchaseDate: "2026-07-18",
    },
    {
      id: "PO-2026-004",
      no: 4,
      supplier: "Eco Packaging Cambodia",
      purchaseBy: "Cashier",
      totalCost: 164000.00,
      dueAmount: 0.00,
      paidAmount: 164000.00,
      changeAmount: 0.00,
      paymentStatus: "Paid",
      purchaseStatus: "Ordered",
      purchaseDate: "2026-07-15",
    },
  ])

  const [searchQuery, setSearchQuery] = useState("")

  // Filter purchases based on search query
  const filteredPurchases = purchases.filter((po) =>
    po.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    po.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
    po.purchaseBy.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Handle PO deletion
  const handleDelete = (id: string) => {
    if (window.confirm(`Are you sure you want to delete purchase order "${id}"?`)) {
      setPurchases(purchases.filter((po) => po.id !== id))
    }
  }

  // Format Riel currency helper
  const formatRiel = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value) + "៛"
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
            <p className="text-sm text-muted-foreground">View and manage raw material & stock purchase records</p>
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
            {filteredPurchases.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground font-semibold">
                No purchases found matching "{searchQuery}"
              </div>
            ) : (
              <table className="w-full text-left text-sm whitespace-nowrap md:whitespace-normal">
                <thead className="border-y bg-muted/40 text-xs font-semibold text-muted-foreground uppercase">
                  <tr>
                    <th className="px-4 py-3 w-12">N.o</th>
                    <th className="px-4 py-3">Supplier</th>
                    <th className="px-4 py-3">Purchase By</th>
                    <th className="px-4 py-3">Total Cost</th>
                    <th className="px-4 py-3">Due Amount</th>
                    <th className="px-4 py-3">Paid Amount</th>
                    <th className="px-4 py-3">Change Amount</th>
                    <th className="px-4 py-3">Payment Status</th>
                    <th className="px-4 py-3">Purchase Status</th>
                    <th className="px-4 py-3">Purchase Date</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredPurchases.map((po, index) => (
                    <tr key={po.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3.5 font-medium text-muted-foreground">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-foreground">{po.supplier}</div>
                        <div className="text-xs font-mono text-muted-foreground">{po.id}</div>
                      </td>
                      <td className="px-4 py-3.5 font-medium text-foreground">{po.purchaseBy}</td>
                      <td className="px-4 py-3.5 font-bold text-foreground">{formatRiel(po.totalCost)}</td>
                      <td className="px-4 py-3.5 font-semibold text-red-500">{formatRiel(po.dueAmount)}</td>
                      <td className="px-4 py-3.5 font-semibold text-emerald-600">{formatRiel(po.paidAmount)}</td>
                      <td className="px-4 py-3.5 font-semibold text-blue-600">{formatRiel(po.changeAmount)}</td>
                      
                      {/* Payment Status Badge */}
                      <td className="px-4 py-3.5">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                            po.paymentStatus === "Paid" && "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
                            po.paymentStatus === "Pending" && "bg-rose-500/10 text-rose-700 dark:text-rose-400",
                            po.paymentStatus === "Partial" && "bg-amber-500/10 text-amber-700 dark:text-amber-400"
                          )}
                        >
                          {po.paymentStatus}
                        </span>
                      </td>

                      {/* Purchase Status Badge */}
                      <td className="px-4 py-3.5">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                            po.purchaseStatus === "Received" && "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
                            po.purchaseStatus === "Pending" && "bg-rose-500/10 text-rose-700 dark:text-rose-400",
                            po.purchaseStatus === "Ordered" && "bg-blue-500/10 text-blue-700 dark:text-blue-400"
                          )}
                        >
                          {po.purchaseStatus}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 text-muted-foreground text-xs">{po.purchaseDate}</td>
                      <td className="px-4 py-3.5 text-right space-x-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
                          <IconEye className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDelete(po.id)}
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
