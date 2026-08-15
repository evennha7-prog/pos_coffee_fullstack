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

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      const nameFromEmail = email.split("@")[0] || "User"
      const formattedName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1)
      localStorage.setItem("user", JSON.stringify({ name: formattedName, email }))
      router.push("/dashboard")
    }, 1200)
  }

  const handleGoogleLogin = () => {
    setIsGoogleLoading(true)
    setTimeout(() => {
      localStorage.setItem("user", JSON.stringify({ name: "Google User", email: "google.user@example.com" }))
      router.push("/dashboard")
    }, 1200)
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Field>
              <Field>
                <Button type="submit" className="w-full font-bold cursor-pointer h-10" disabled={isLoading}>
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <FadeArc className="h-4 w-4 animate-spin text-white" />
                      Logging in...
                    </span>
                  ) : (
                    "Login"
                  )}
                </Button>
                <Button variant="outline" type="button" className="w-full font-bold cursor-pointer h-10" onClick={handleGoogleLogin} disabled={isGoogleLoading}>
                  {isGoogleLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <FadeArc className="h-4 w-4 animate-spin text-muted-foreground" />
                      Connecting...
                    </span>
                  ) : (
                    "Login with Google"
                  )}
                </Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account?{" "}
                  <Link href="/signup" className="underline underline-offset-4 font-medium hover:underline">
                    Sign up
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

