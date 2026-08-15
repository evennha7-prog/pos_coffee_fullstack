"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function CreateCustomer({ isOpen, onOpenChange, onCreate }) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [points, setPoints] = useState("")
  const [spent, setSpent] = useState("")
  const [errors, setErrors] = useState({})

  const validate = () => {
    const tempErrors = {}
    if (!name.trim()) tempErrors.name = "Customer name is required"
    if (email.trim() && !/\S+@\S+\.\S+/.test(email)) tempErrors.email = "Invalid email format"
    if (points !== "" && (isNaN(points) || parseInt(points) < 0)) tempErrors.points = "Points must be a positive number"
    if (spent !== "" && (isNaN(spent) || parseFloat(spent) < 0)) tempErrors.spent = "Spent amount must be 0 or more"
    setErrors(tempErrors)
    return Object.keys(tempErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    onCreate({
      name: name.trim(),
      email: email.trim() || "-",
      phone: phone.trim() || "-",
      points: points === "" ? 0 : parseInt(points),
      spent: spent === "" ? 0.0 : parseFloat(spent),
    })

    // Reset Form
    setName("")
    setEmail("")
    setPhone("")
    setPoints("")
    setSpent("")
    setErrors({})
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add Customer</DialogTitle>
          <DialogDescription>
            Register a new loyalty member or customer profile.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Name Field */}
          <div className="space-y-1">
            <Label htmlFor="customer-name" className="text-sm font-medium">
              Customer Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="customer-name"
              placeholder="e.g. Sophea Chan"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (errors.name) setErrors({ ...errors, name: "" })
              }}
              className={cn(errors.name && "border-destructive focus-visible:ring-destructive/20")}
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
          </div>

          {/* Email Field */}
          <div className="space-y-1">
            <Label htmlFor="customer-email" className="text-sm font-medium">
              Email Address
            </Label>
            <Input
              id="customer-email"
              type="email"
              placeholder="e.g. sophea@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (errors.email) setErrors({ ...errors, email: "" })
              }}
              className={cn(errors.email && "border-destructive focus-visible:ring-destructive/20")}
            />
            {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
          </div>

          {/* Phone Field */}
          <div className="space-y-1">
            <Label htmlFor="customer-phone" className="text-sm font-medium">
              Phone Number
            </Label>
            <Input
              id="customer-phone"
              placeholder="e.g. +855 12 345 678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Points Field */}
            <div className="space-y-1">
              <Label htmlFor="customer-points" className="text-sm font-medium">
                Loyalty Points
              </Label>
              <Input
                id="customer-points"
                type="number"
                min="0"
                placeholder="0"
                value={points}
                onChange={(e) => {
                  setPoints(e.target.value)
                  if (errors.points) setErrors({ ...errors, points: "" })
                }}
                className={cn(errors.points && "border-destructive focus-visible:ring-destructive/20")}
              />
              {errors.points && <p className="text-xs text-destructive">{errors.points}</p>}
            </div>

            {/* Spent Field */}
            <div className="space-y-1">
              <Label htmlFor="customer-spent" className="text-sm font-medium">
                Total Spent ($)
              </Label>
              <Input
                id="customer-spent"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={spent}
                onChange={(e) => {
                  setSpent(e.target.value)
                  if (errors.spent) setErrors({ ...errors, spent: "" })
                }}
                className={cn(errors.spent && "border-destructive focus-visible:ring-destructive/20")}
              />
              {errors.spent && <p className="text-xs text-destructive">{errors.spent}</p>}
            </div>
          </div>

          {/* Footer Actions */}
          <DialogFooter className="pt-4 border-t gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setName("")
                setEmail("")
                setPhone("")
                setPoints("")
                setSpent("")
                setErrors({})
                onOpenChange(false)
              }}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer">
              Register Customer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
