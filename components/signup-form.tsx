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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { IconHourglass, IconArrowLeft } from "@tabler/icons-react"

export function SignupForm({ className, ...props }: React.ComponentProps<"div">) {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showComingSoon, setShowComingSoon] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowComingSoon(true)
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
                <Field>
                  <FieldLabel htmlFor="name">Username</FieldLabel>
                  <Input
                    id="name"
                    type="text"
                    placeholder="e.g. barista_sokha"
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
                  >
                    Create Account
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

      {/* Coming Soon for Register in System Dialog */}
      <Dialog open={showComingSoon} onOpenChange={setShowComingSoon}>
        <DialogContent className="sm:max-w-[450px] p-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/15 text-amber-600 mb-2 shadow-inner">
            <IconHourglass className="h-8 w-8 animate-pulse" />
          </div>

          <DialogHeader className="text-center sm:text-center">
            <DialogTitle className="text-2xl font-bold text-foreground text-center">
              Coming Soon for Register in System 🚀
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm text-center mt-2 leading-relaxed">
              Public self-registration is currently under preparation. Please contact the administrator or login with your assigned staff credentials.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-xl bg-muted/60 p-3.5 my-3 text-xs text-muted-foreground text-center border">
            💡 <strong className="text-foreground">Default Superadmin:</strong> <code className="text-emerald-600 font-mono">super@coffee.com</code> / <code className="text-emerald-600 font-mono">123456</code>
          </div>

          <div className="flex flex-col gap-2 mt-3">
            <Button
              onClick={() => router.push("/login")}
              className="w-full h-11 font-bold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer gap-2"
            >
              <IconArrowLeft className="h-4 w-4" /> Return to Login Screen
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
