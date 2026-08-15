"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function CreateCategory({ isOpen, onOpenChange, onCreate }) {
  const [name, setName] = useState("")
  const [selectedIcon, setSelectedIcon] = useState("☕")
  const [status, setStatus] = useState("Active")
  const [error, setError] = useState("")

  const icons = ["☕", "🍵", "🥤", "🥐", "🍰", "🥗", "🍳", "📦", "🍦", "🍔"]

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) {
      setError("Category name is required")
      return
    }

    onCreate({
      name: name.trim(),
      icon: selectedIcon,
      status,
      count: "0 items"
    })

    // Reset form
    setName("")
    setSelectedIcon("☕")
    setStatus("Active")
    setError("")
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Create Category</DialogTitle>
          <DialogDescription>
            Add a new category to group products in your coffee shop.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-2">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="category-name" className="text-sm font-medium">
              Category Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="category-name"
              placeholder="e.g. Cold Brews"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (error) setError("")
              }}
              className={cn(error && "border-destructive focus-visible:ring-destructive/20")}
            />
            {error && <p className="text-xs text-destructive mt-1">{error}</p>}
          </div>

          {/* Icon Selector Grid */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Select Icon</Label>
            <div className="grid grid-cols-5 gap-2 p-3 bg-muted/40 rounded-2xl border">
              {icons.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setSelectedIcon(icon)}
                  className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-xl text-2xl transition-all duration-200 hover:scale-110",
                    selectedIcon === icon
                      ? "bg-amber-500/20 ring-2 ring-amber-500"
                      : "hover:bg-muted/60"
                  )}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Status Field */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Status</Label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStatus("Active")}
                className={cn(
                  "flex-1 py-2 px-3 rounded-xl border text-sm font-medium transition-all cursor-pointer",
                  status === "Active"
                    ? "bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-400 font-semibold"
                    : "border-border bg-input/30 text-muted-foreground hover:bg-input/50"
                )}
              >
                Active
              </button>
              <button
                type="button"
                onClick={() => setStatus("Inactive")}
                className={cn(
                  "flex-1 py-2 px-3 rounded-xl border text-sm font-medium transition-all cursor-pointer",
                  status === "Inactive"
                    ? "bg-rose-500/10 border-rose-500 text-rose-700 dark:text-rose-400 font-semibold"
                    : "border-border bg-input/30 text-muted-foreground hover:bg-input/50"
                )}
              >
                Inactive
              </button>
            </div>
          </div>

          {/* Footer Actions */}
          <DialogFooter className="pt-4 border-t gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setName("")
                setSelectedIcon("☕")
                setStatus("Active")
                setError("")
                onOpenChange(false)
              }}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer">
              Create Category
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
