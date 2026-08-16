"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { IconChevronDown } from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { getCustomers, Customer } from "@/lib/api"

export default function PaymentModal({ isOpen, onOpenChange, totalUSD, totalKHR, onSave }) {
  const [customer, setCustomer] = useState("Walk-in Customer")
  const [customerId, setCustomerId] = useState(null)
  const [customersList, setCustomersList] = useState([])
  const [paidKHR, setPaidKHR] = useState("")
  const [paidUSD, setPaidUSD] = useState("")
  const [activeQuickKey, setActiveQuickKey] = useState("Exact")

  useEffect(() => {
    if (isOpen) {
      setPaidKHR("")
      setPaidUSD("")
      setCustomer("Walk-in Customer")
      setCustomerId(null)
      setActiveQuickKey("Exact")

      getCustomers()
        .then((data) => setCustomersList(data || []))
        .catch((err) => console.error("Failed to load customers for payment modal:", err))
    }
  }, [isOpen])

  // Conversion rates
  const exchangeRate = 4100

  // Calculate sum of payments
  const numPaidKHR = parseFloat(paidKHR) || 0
  const numPaidUSD = parseFloat(paidUSD) || 0
  const totalPaidKHR = numPaidKHR + (numPaidUSD * exchangeRate)

  let changeKHR = 0
  let dueKHR = totalKHR

  if (totalPaidKHR >= totalKHR) {
    changeKHR = totalPaidKHR - totalKHR
    dueKHR = 0
  } else {
    dueKHR = totalKHR - totalPaidKHR
    changeKHR = 0
  }

  const changeUSD = changeKHR / exchangeRate
  const dueUSD = dueKHR / exchangeRate

  const handleQuickPay = (usdAmount, keyLabel) => {
    setActiveQuickKey(keyLabel)
    if (usdAmount === "exact") {
      setPaidUSD(totalUSD.toFixed(2))
      setPaidKHR(totalKHR.toString())
    } else {
      setPaidUSD(usdAmount.toString())
      setPaidKHR((usdAmount * exchangeRate).toString())
    }
  }

  const handleCustomerChange = (e) => {
    const val = e.target.value
    setCustomer(val)
    const found = customersList.find(c => String(c.id) === val || c.name === val)
    if (found) {
      setCustomerId(found.id)
      setCustomer(found.name)
    } else {
      setCustomerId(null)
      setCustomer("Walk-in Customer")
    }
  }

  const handleSave = (e) => {
    e.preventDefault()
    onSave({
      customer,
      customerId,
      paidKHR: totalPaidKHR >= totalKHR ? totalPaidKHR : totalPaidKHR,
      paidUSD: totalPaidKHR >= totalKHR ? totalPaidKHR / exchangeRate : totalPaidKHR / exchangeRate,
      changeKHR,
      changeUSD,
      dueKHR,
      dueUSD,
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:w-full max-w-[480px] max-h-[92vh] overflow-y-auto p-4 sm:p-6 rounded-2xl">
        <DialogHeader className="flex flex-row items-center justify-between border-b pb-3">
          <DialogTitle className="text-lg sm:text-xl font-bold text-foreground">Add Payment</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSave} className="space-y-4 pt-2">
          {/* Customer Field */}
          <div className="space-y-1">
            <Label htmlFor="pay-customer" className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
              Customer
            </Label>
            <div className="relative">
              <select
                id="pay-customer"
                value={customerId ? String(customerId) : "walkin"}
                onChange={handleCustomerChange}
                className="h-9 sm:h-10 w-full min-w-0 rounded-xl border border-input bg-input/10 pl-3 pr-8 py-1 text-xs sm:text-sm font-semibold transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 appearance-none cursor-pointer text-foreground"
              >
                <option value="walkin">Walk-in Customer</option>
                {customersList.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.phone ? `(${c.phone})` : ""}
                  </option>
                ))}
              </select>
              <IconChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 pointer-events-none text-muted-foreground" />
            </div>
          </div>

          {/* Paid Amounts Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="pay-khr" className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                Paid Amount (KHR ៛)
              </Label>
              <Input
                id="pay-khr"
                type="number"
                placeholder="KHR amount"
                value={paidKHR}
                onChange={(e) => {
                  setPaidKHR(e.target.value)
                  setActiveQuickKey("")
                }}
                className="rounded-xl h-9 sm:h-10 font-mono text-xs sm:text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="pay-usd" className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                Paid Amount (USD $)
              </Label>
              <Input
                id="pay-usd"
                type="number"
                placeholder="USD amount"
                value={paidUSD}
                onChange={(e) => {
                  setPaidUSD(e.target.value)
                  setActiveQuickKey("")
                }}
                className="rounded-xl h-9 sm:h-10 font-mono text-xs sm:text-sm"
              />
            </div>
          </div>

          {/* Quick Pay Buttons */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            <Button
              type="button"
              variant={activeQuickKey === "Exact" ? "default" : "outline"}
              onClick={() => handleQuickPay("exact", "Exact")}
              className={cn(
                "h-7 sm:h-8 text-[11px] sm:text-xs font-bold px-2.5 sm:px-3 rounded-lg cursor-pointer transition-colors",
                activeQuickKey === "Exact" ? "bg-black text-white hover:bg-black/90" : "bg-muted/30 text-foreground"
              )}
            >
              Exact ({totalKHR.toLocaleString()}៛)
            </Button>
            <Button
              type="button"
              variant={activeQuickKey === "$1" ? "default" : "outline"}
              onClick={() => handleQuickPay(1.00, "$1")}
              className={cn(
                "h-7 sm:h-8 text-[11px] sm:text-xs font-bold px-2.5 sm:px-3 rounded-lg cursor-pointer transition-colors",
                activeQuickKey === "$1" ? "bg-black text-white hover:bg-black/90" : "bg-muted/30 text-foreground"
              )}
            >
              $1.00 (4,100៛)
            </Button>
            <Button
              type="button"
              variant={activeQuickKey === "$5" ? "default" : "outline"}
              onClick={() => handleQuickPay(5.00, "$5")}
              className={cn(
                "h-7 sm:h-8 text-[11px] sm:text-xs font-bold px-2.5 sm:px-3 rounded-lg cursor-pointer transition-colors",
                activeQuickKey === "$5" ? "bg-black text-white hover:bg-black/90" : "bg-muted/30 text-foreground"
              )}
            >
              $5.00 (20,500៛)
            </Button>
            <Button
              type="button"
              variant={activeQuickKey === "$10" ? "default" : "outline"}
              onClick={() => handleQuickPay(10.00, "$10")}
              className={cn(
                "h-7 sm:h-8 text-[11px] sm:text-xs font-bold px-2.5 sm:px-3 rounded-lg cursor-pointer transition-colors",
                activeQuickKey === "$10" ? "bg-black text-white hover:bg-black/90" : "bg-muted/30 text-foreground"
              )}
            >
              $10.00 (41,000៛)
            </Button>
            <Button
              type="button"
              variant={activeQuickKey === "$20" ? "default" : "outline"}
              onClick={() => handleQuickPay(20.00, "$20")}
              className={cn(
                "h-7 sm:h-8 text-[11px] sm:text-xs font-bold px-2.5 sm:px-3 rounded-lg cursor-pointer transition-colors",
                activeQuickKey === "$20" ? "bg-black text-white hover:bg-black/90" : "bg-muted/30 text-foreground"
              )}
            >
              $20.00 (82,000៛)
            </Button>
          </div>

          <hr className="border-slate-200 dark:border-slate-800" />

          {/* Calculations Summary Container */}
          <div className="bg-slate-50 dark:bg-zinc-900/50 border rounded-2xl p-3 sm:p-4 grid grid-cols-2 gap-3 sm:gap-4">
            <div>
              <div className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider">Change Amount</div>
              <div className="text-lg sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 font-mono">
                {changeKHR.toLocaleString()}៛
              </div>
              <div className="text-xs sm:text-sm font-semibold text-slate-500 font-mono mt-0.5">
                ${changeUSD.toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider">Due Amount</div>
              <div className="text-lg sm:text-2xl font-black text-red-500 mt-1 font-mono">
                {dueKHR.toLocaleString()}៛
              </div>
              <div className="text-xs sm:text-sm font-semibold text-slate-500 font-mono mt-0.5">
                ${dueUSD.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Save Action Button */}
          <Button type="submit" className="w-full bg-black hover:bg-black/90 text-white font-bold h-10 sm:h-11 rounded-xl cursor-pointer text-xs sm:text-sm">
            Complete Payment
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
