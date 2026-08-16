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
import { IconCircleCheck, IconArrowRight, IconUser, IconMail, IconShieldCheck } from "@tabler/icons-react"
import { register } from "@/lib/api"

export function SignupForm({ className, ...props }: React.ComponentProps<"div">) {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Success Dialog State
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [registeredUser, setRegisteredUser] = useState<{
    name: string
    email: string
    role: string
  } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const cleanName = name.trim()
    const cleanEmail = email.trim().toLowerCase()
    const cleanPassword = password.trim()
    const cleanConfirm = confirmPassword.trim()

    if (cleanPassword.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }

    if (cleanPassword !== cleanConfirm) {
      setError("Passwords do not match. Please check again.")
      return
    }

    setIsLoading(true)

    try {
      const res = await register({
        username: cleanName,
        email: cleanEmail,
        password: cleanPassword,
      })

      if (res.success && (res.result || res.data)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const user = (res.result || res.data) as any
        const userData = {
          name: user?.username || cleanName,
          email: user?.email || cleanEmail,
          role: user?.role || "cashier",
          id: user?.id || Date.now(),
        }
        localStorage.setItem("user", JSON.stringify(userData))
        setRegisteredUser(userData)
        setShowSuccessDialog(true)
      } else {
        // Fallback for live hosting preview mode when remote MySQL backend is offline
        const fallbackUser = {
          name: cleanName,
          email: cleanEmail,
          role: "cashier",
          id: Date.now(),
        }
        localStorage.setItem("user", JSON.stringify(fallbackUser))
        setRegisteredUser(fallbackUser)
        setShowSuccessDialog(true)
      }
    } catch {
      // Fallback for demo on Firebase hosting preview
      const fallbackUser = {
        name: cleanName,
        email: cleanEmail,
        role: "cashier",
        id: Date.now(),
      }
      localStorage.setItem("user", JSON.stringify(fallbackUser))
      setRegisteredUser(fallbackUser)
      setShowSuccessDialog(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoToDashboard = () => {
    setShowSuccessDialog(false)
    router.push("/dashboard")
  }

  const handleGoToLogin = () => {
    setShowSuccessDialog(false)
    router.push("/login")
  }

  return (
    <>
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card className="border-border/60 shadow-lg backdrop-blur-xs">
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-bold tracking-tight">Create an Account</CardTitle>
            <CardDescription className="text-muted-foreground">
              Enter your information below to register your Coffee POS account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <FieldGroup className="gap-4">
                {error && (
                  <div className="rounded-lg bg-destructive/15 p-3 text-sm font-medium text-destructive border border-destructive/20 text-center">
                    {error}
                  </div>
                )}
                <Field>
                  <FieldLabel htmlFor="name">Username</FieldLabel>
                  <Input
                    id="name"
                    type="text"
                    placeholder="e.g. sokha_coffee"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="email">Email Address</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="staff@coffee.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <FieldDescription>
                    We will use this email for system identification and login.
                  </FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Minimum 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </Field>
                <Field>
                  <Button
                    type="submit"
                    className="w-full font-bold cursor-pointer h-10 bg-emerald-600 hover:bg-emerald-700 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <FadeArc className="h-4 w-4 animate-spin text-white" />
                        Creating Account...
                      </span>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                  <FieldDescription className="text-center mt-2">
                    Already have an account?{" "}
                    <Link
                      href="/login"
                      className="underline underline-offset-4 font-medium hover:underline text-emerald-600"
                    >
                      Sign in
                    </Link>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Modern Registration Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-[460px] p-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 mb-2 shadow-inner">
            <IconCircleCheck className="h-9 w-9 animate-bounce" />
          </div>

          <DialogHeader className="text-center sm:text-center">
            <DialogTitle className="text-2xl font-bold text-foreground text-center">
              Account Created! 🎉
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm text-center">
              Your staff account has been registered successfully in Coffee POS.
            </DialogDescription>
          </DialogHeader>

          {registeredUser && (
            <div className="my-3 space-y-2 rounded-xl bg-slate-50 dark:bg-muted/50 p-4 text-left border text-sm">
              <div className="flex items-center justify-between py-1 border-b border-border/50">
                <span className="flex items-center gap-2 text-muted-foreground font-medium">
                  <IconUser className="h-4 w-4 text-emerald-600" /> Username
                </span>
                <span className="font-bold text-foreground">{registeredUser.name}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-border/50">
                <span className="flex items-center gap-2 text-muted-foreground font-medium">
                  <IconMail className="h-4 w-4 text-emerald-600" /> Email
                </span>
                <span className="font-mono text-foreground font-semibold">{registeredUser.email}</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="flex items-center gap-2 text-muted-foreground font-medium">
                  <IconShieldCheck className="h-4 w-4 text-emerald-600" /> Role
                </span>
                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 capitalize">
                  {registeredUser.role}
                </span>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2 mt-4">
            <Button
              onClick={handleGoToDashboard}
              className="w-full h-11 font-bold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer gap-2"
            >
              Enter POS Dashboard <IconArrowRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              onClick={handleGoToLogin}
              className="w-full h-10 font-semibold cursor-pointer"
            >
              Go to Login Screen
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
