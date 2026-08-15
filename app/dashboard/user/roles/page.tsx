"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { IconShieldLock, IconCheck, IconX } from "@tabler/icons-react"

export default function RolePermissionsPage() {
  const [permissions, setPermissions] = useState([
    { module: "POS Order Checkout", admin: true, barista: true, cashier: true },
    { module: "View Sales History", admin: true, barista: true, cashier: false },
    { module: "Manage Products & Pricing", admin: true, barista: false, cashier: false },
    { module: "Manage Inventory & Stock", admin: true, barista: true, cashier: false },
    { module: "Currency Exchange Rate Config", admin: true, barista: false, cashier: false },
    { module: "Staff Account Management", admin: true, barista: false, cashier: false },
  ])

  const handleSave = () => {
    alert("Role permissions saved successfully!")
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 bg-slate-50/50 dark:bg-background">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/15 text-rose-500 font-bold shadow-2xs">
            <IconShieldLock className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Role & Permissions</h1>
            <p className="text-sm text-muted-foreground">Configure module permissions for system access levels</p>
          </div>
        </div>
        <Button onClick={handleSave} className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
          <IconCheck className="h-4 w-4" /> Save Permission Matrix
        </Button>
      </div>

      <Card className="border bg-card shadow-2xs">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <IconShieldLock className="h-5 w-5 text-purple-600" />
            Access Control Matrix
          </CardTitle>
          <CardDescription>Grant or restrict feature access per user role</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-y bg-muted/40 text-xs font-medium text-muted-foreground uppercase">
                <tr>
                  <th className="px-6 py-3.5">Module / Feature</th>
                  <th className="px-6 py-3.5 text-center">Admin / Manager</th>
                  <th className="px-6 py-3.5 text-center">Barista</th>
                  <th className="px-6 py-3.5 text-center">Cashier</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {permissions.map((perm, idx) => (
                  <tr key={idx} className="hover:bg-muted/30">
                    <td className="px-6 py-4 font-medium">{perm.module}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                        <IconCheck className="h-4 w-4" />
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {perm.barista ? (
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                          <IconCheck className="h-4 w-4" />
                        </span>
                      ) : (
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-500/10 text-slate-400">
                          <IconX className="h-3.5 w-3.5" />
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {perm.cashier ? (
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                          <IconCheck className="h-4 w-4" />
                        </span>
                      ) : (
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-500/10 text-slate-400">
                          <IconX className="h-3.5 w-3.5" />
                        </span>
                      )}
                    </td>
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

