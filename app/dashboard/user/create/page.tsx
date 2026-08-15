"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { IconArrowLeft, IconCheck, IconUserPlus } from "@tabler/icons-react"
import Link from "next/link"

export default function CreateUserPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("Cashier")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`Staff account created for ${name} (${role})!`)
    router.push("/dashboard/user/list")
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 bg-slate-50/50 dark:bg-background">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/user/list">
          <Button variant="outline" size="icon" className="h-9 w-9">
            <IconArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-500/15 text-pink-500 font-bold shadow-2xs">
            <IconUserPlus className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Create Staff Account</h1>
            <p className="text-sm text-muted-foreground">Register new employee system login and assign permissions</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <Card className="border bg-card shadow-2xs">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Employee Credentials</CardTitle>
            <CardDescription>Enter staff personal information and role access</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input
                type="text"
                placeholder="e.g. Sophea Chan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Work Email Address</label>
              <Input
                type="email"
                placeholder="sophea@coffeepos.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Login Password</label>
              <Input
                type="password"
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Assigned System Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="Admin / Manager">Admin / Manager (Full Access)</option>
                <option value="Barista">Barista (Order Fulfillment & POS)</option>
                <option value="Cashier">Cashier (POS & Sales Checkout Only)</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Link href="/dashboard/user/list">
            <Button type="button" variant="outline">Cancel</Button>
          </Link>
          <Button type="submit" className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
            <IconCheck className="h-4 w-4" /> Register Staff User
          </Button>
        </div>
      </form>
    </div>
  )
}

