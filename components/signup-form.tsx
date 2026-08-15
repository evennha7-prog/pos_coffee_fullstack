"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
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

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }
    setError("")
    setIsLoading(true)
    setTimeout(() => {
      localStorage.setItem("user", JSON.stringify({ name: name || "User", email }))
      router.push("/dashboard")
    }, 1200)
  }

  const handleGoogleSignup = () => {
    setIsGoogleLoading(true)
    setTimeout(() => {
      localStorage.setItem("user", JSON.stringify({ name: "Google User", email: "google.user@example.com" }))
      router.push("/dashboard")
    }, 1200)
  }

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            {error && (
              <div className="text-sm font-medium text-destructive text-center">
                {error}
              </div>
            )}
            <Field>
              <FieldLabel htmlFor="name">Full Name</FieldLabel>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Field>
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
              <FieldDescription>
                We&apos;ll use this to contact you. We will not share your email
                with anyone else.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <FieldDescription>
                Must be at least 8 characters long.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password">
                Confirm Password
              </FieldLabel>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <FieldDescription>Please confirm your password.</FieldDescription>
            </Field>
            <FieldGroup>
              <Field>
                <Button type="submit" className="w-full font-bold cursor-pointer h-10" disabled={isLoading}>
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <FadeArc className="h-4 w-4 animate-spin text-white" />
                      Creating Account...
                    </span>
                  ) : (
                    "Create Account"
                  )}
                </Button>
                <Button variant="outline" type="button" className="w-full font-bold cursor-pointer h-10" onClick={handleGoogleSignup} disabled={isGoogleLoading}>
                  {isGoogleLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <FadeArc className="h-4 w-4 animate-spin text-muted-foreground" />
                      Connecting...
                    </span>
                  ) : (
                    "Sign up with Google"
                  )}
                </Button>
                <FieldDescription className="px-6 text-center">
                  Already have an account?{" "}
                  <Link href="/login" className="underline underline-offset-4 font-medium hover:underline">
                    Sign in
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}

