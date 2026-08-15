"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { IconChevronDown } from "@tabler/icons-react"

export default function EditUser({ isOpen, onOpenChange, user, onSave }) {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("cashier")
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (user) {
      setUsername(user.username || "")
      setEmail(user.email || "")
      setRole(user.role || "cashier")
      setErrors({})
    }
  }, [user, isOpen])

  const validate = () => {
    const tempErrors = {}
    if (!username.trim()) tempErrors.username = "Username is required"
    if (!email.trim()) {
      tempErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = "Invalid email format"
    }
    setErrors(tempErrors)
    return Object.keys(tempErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    onSave({
      ...user,
      username: username.trim(),
      email: email.trim(),
      role,
    })

    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Edit User</DialogTitle>
          <DialogDescription>
            Modify the user credentials, email, and staff access roles.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Username Field */}
          <div className="space-y-1">
            <Label htmlFor="edit-username" className="text-sm font-medium">
              Username <span className="text-destructive">*</span>
            </Label>
            <Input
              id="edit-username"
              placeholder="Enter username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value)
                if (errors.username) setErrors({ ...errors, username: "" })
              }}
              className={cn(errors.username && "border-destructive focus-visible:ring-destructive/20")}
            />
            {errors.username && <p className="text-xs text-destructive">{errors.username}</p>}
          </div>

          {/* Email Field */}
          <div className="space-y-1">
            <Label htmlFor="edit-email" className="text-sm font-medium">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="edit-email"
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (errors.email) setErrors({ ...errors, email: "" })
              }}
              className={cn(errors.email && "border-destructive focus-visible:ring-destructive/20")}
            />
            {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
          </div>

          {/* Role Field */}
          <div className="space-y-1">
            <Label htmlFor="edit-role" className="text-sm font-medium">
              Role
            </Label>
            <div className="relative">
              <select
                id="edit-role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="h-9 w-full min-w-0 rounded-4xl border border-input bg-input/30 pl-3 pr-8 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 appearance-none cursor-pointer text-foreground"
              >
                <option value="admin">admin</option>
                <option value="manager">manager</option>
                <option value="cashier">cashier</option>
                <option value="barista">barista</option>
              </select>
              <IconChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 pointer-events-none text-muted-foreground" />
            </div>
          </div>

          {/* Footer Actions */}
          <DialogFooter className="pt-4 border-t gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer">
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
