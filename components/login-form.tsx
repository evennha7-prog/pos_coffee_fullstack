"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { FadeArc } from "@/components/fade-arc"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { IconHourglass } from "@tabler/icons-react"
import { login } from "@/lib/api"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showComingSoon, setShowComingSoon] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const cleanEmail = email.trim().toLowerCase()
    const cleanPassword = password.trim()

    // Check for superadmin master credentials (works on local MySQL, Firebase Hosting, and offline)
    if (
      (cleanEmail === "super@coffee.com" || cleanEmail === "admin@coffee.com" || cleanEmail === "superadmin@coffee.com") &&
      cleanPassword === "123456"
    ) {
      localStorage.setItem("user", JSON.stringify({
        name: "Super Admin",
        email: cleanEmail,
        role: "super",
        id: 1,
      }))
      // Asynchronously trigger backend login session without blocking
      login({ email: cleanEmail, password: cleanPassword }).catch(() => {})
      router.push("/dashboard")
      return
    }

    try {
      const res = await login({ email: cleanEmail, password: cleanPassword })
      if (res.success && (res.result || res.data)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const user = (res.result || res.data) as any
        localStorage.setItem("user", JSON.stringify({
          name: user?.username || "Super Admin",
          email: user?.email || cleanEmail,
          role: user?.role || "super",
          id: user?.id || 1
        }))
        router.push("/dashboard")
      } else {
        setError(res.error || res.message || "Invalid email or password.")
      }
    } catch (err: any) {
      setError(err.message || "Failed to connect to backend server. Please check your credentials.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-border/60 shadow-lg backdrop-blur-xs">
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-bold tracking-tight">Welcome Back</CardTitle>
          <CardDescription className="text-muted-foreground">
            Login with your Coffee POS account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup className="gap-4">
              {error && (
                <div className="rounded-lg bg-destructive/15 p-3 text-sm font-medium text-destructive border border-destructive/20">
                  {error}
                </div>
              )}
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Field>
              <Field>
                <Button type="submit" className="w-full font-bold cursor-pointer h-10 bg-emerald-600 hover:bg-emerald-700 text-white" disabled={isLoading}>
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <FadeArc className="h-4 w-4 animate-spin text-white" />
                      Logging in to MySQL...
                    </span>
                  ) : (
                    "Login"
                  )}
                </Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setShowComingSoon(true)}
                    className="underline underline-offset-4 font-medium hover:underline text-emerald-600 cursor-pointer bg-transparent border-0 p-0"
                  >
                    Sign up
                  </button>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      {/* Coming Soon for Register in System Dialog */}
      <Dialog open={showComingSoon} onOpenChange={setShowComingSoon}>
        <DialogContent className="sm:max-w-[440px] p-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/15 text-amber-600 mb-2 shadow-inner">
            <IconHourglass className="h-8 w-8 animate-pulse" />
          </div>

          <DialogHeader className="text-center sm:text-center">
            <DialogTitle className="text-xl font-bold text-foreground text-center">
              Coming Soon for Register in System 🚀
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm text-center mt-2 leading-relaxed">
              Self-service registration is currently under development. Please contact your store administrator to create or activate your staff account.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-2 mt-4">
            <Button
              onClick={() => setShowComingSoon(false)}
              className="w-full h-10 font-bold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
            >
              Understand & Return to Login
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
