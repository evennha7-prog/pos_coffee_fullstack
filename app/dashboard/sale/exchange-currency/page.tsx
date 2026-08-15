"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { IconCurrencyDollar, IconArrowsExchange, IconCheck, IconRefresh } from "@tabler/icons-react"

export default function ExchangeCurrencyPage() {
  const [exchangeRate, setExchangeRate] = useState(4100)
  const [usdInput, setUsdInput] = useState<number | "">(10)
  const [khrInput, setKhrInput] = useState<number | "">(41000)

  const handleRateUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`Exchange rate updated: $1 USD = ${exchangeRate.toLocaleString()} KHR`)
  }

  const handleUsdChange = (val: string) => {
    const num = parseFloat(val)
    setUsdInput(val === "" ? "" : num)
    if (!isNaN(num)) {
      setKhrInput(Math.round(num * exchangeRate))
    } else {
      setKhrInput("")
    }
  }

  const handleKhrChange = (val: string) => {
    const num = parseFloat(val)
    setKhrInput(val === "" ? "" : num)
    if (!isNaN(num)) {
      setUsdInput(parseFloat((num / exchangeRate).toFixed(2)))
    } else {
      setUsdInput("")
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 bg-slate-50/50 dark:bg-background">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/15 text-amber-500 font-bold shadow-2xs">
          <IconCurrencyDollar className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Exchange Currency Settings</h1>
          <p className="text-sm text-muted-foreground">Configure USD ($) to KHR (៛) exchange rates for POS register</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Exchange Rate Config Form */}
        <Card className="border bg-card shadow-2xs">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Store Exchange Rate</CardTitle>
            <CardDescription>Set current conversion rate for cashier calculations</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRateUpdate} className="space-y-4">
              <div className="rounded-xl border bg-muted/30 p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 font-bold text-base">
                    $
                  </div>
                  <span className="font-bold">1 USD ($)</span>
                </div>
                <IconArrowsExchange className="h-5 w-5 text-muted-foreground" />
                <div className="flex items-center gap-2 text-right">
                  <span className="font-bold text-emerald-600 text-lg">{exchangeRate.toLocaleString()} KHR (៛)</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">New KHR Exchange Rate per $1 USD</label>
                <Input
                  type="number"
                  step="10"
                  value={exchangeRate}
                  onChange={(e) => setExchangeRate(parseInt(e.target.value) || 4000)}
                  className="h-10 text-base font-semibold"
                />
              </div>

              <Button type="submit" className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
                <IconCheck className="h-4 w-4" /> Save Exchange Rate
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Live Converter Calculator */}
        <Card className="border bg-card shadow-2xs">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <IconRefresh className="h-4 w-4 text-emerald-600" />
              Live Currency Calculator
            </CardTitle>
            <CardDescription>Quick conversion calculator for cashiers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase">Amount in USD ($)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">$</span>
                <Input
                  type="number"
                  value={usdInput}
                  onChange={(e) => handleUsdChange(e.target.value)}
                  className="pl-7 h-11 text-lg font-bold"
                />
              </div>
            </div>

            <div className="flex justify-center my-1">
              <div className="rounded-full border p-2 bg-muted/40">
                <IconArrowsExchange className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase">Equivalent in KHR (៛)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-emerald-600">៛</span>
                <Input
                  type="number"
                  value={khrInput}
                  onChange={(e) => handleKhrChange(e.target.value)}
                  className="pl-7 h-11 text-lg font-bold text-emerald-600"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

