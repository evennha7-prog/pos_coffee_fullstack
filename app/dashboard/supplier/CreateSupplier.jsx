"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function CreateSupplier({ isOpen, onOpenChange, onCreate }) {
  const [company, setCompany] = useState("")
  const [contact, setContact] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [note, setNote] = useState("")
  const [errors, setErrors] = useState({})

  const validate = () => {
    const tempErrors = {}
    if (!company.trim()) tempErrors.company = "Business name is required"
    if (!contact.trim()) tempErrors.contact = "Name is required"
    if (!phone.trim()) tempErrors.phone = "Phone is required"
    if (!address.trim()) tempErrors.address = "Address is required"
    if (!note.trim()) tempErrors.note = "Note is required"
    setErrors(tempErrors)
    return Object.keys(tempErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    onCreate({
      company: company.trim(),
      contact: contact.trim(),
      phone: phone.trim(),
      address: address.trim(),
      note: note.trim(),
    })

    // Reset Form
    setCompany("")
    setContact("")
    setPhone("")
    setAddress("")
    setNote("")
    setErrors({})
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add Supplier</DialogTitle>
          <DialogDescription>
            Register a new supplier by providing the required details.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Business Name Field */}
          <div className="space-y-1">
            <Label htmlFor="supplier-company" className="text-sm font-medium">
              Business Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="supplier-company"
              placeholder="Enter business name"
              value={company}
              onChange={(e) => {
                setCompany(e.target.value)
                if (errors.company) setErrors({ ...errors, company: "" })
              }}
              className={cn(errors.company && "border-destructive focus-visible:ring-destructive/20")}
            />
            {errors.company && <p className="text-xs text-destructive">{errors.company}</p>}
          </div>

          {/* Name Field */}
          <div className="space-y-1">
            <Label htmlFor="supplier-contact" className="text-sm font-medium">
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="supplier-contact"
              placeholder="Enter name"
              value={contact}
              onChange={(e) => {
                setContact(e.target.value)
                if (errors.contact) setErrors({ ...errors, contact: "" })
              }}
              className={cn(errors.contact && "border-destructive focus-visible:ring-destructive/20")}
            />
            {errors.contact && <p className="text-xs text-destructive">{errors.contact}</p>}
          </div>

          {/* Phone Field */}
          <div className="space-y-1">
            <Label htmlFor="supplier-phone" className="text-sm font-medium">
              Phone <span className="text-destructive">*</span>
            </Label>
            <Input
              id="supplier-phone"
              placeholder="Enter phone"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value)
                if (errors.phone) setErrors({ ...errors, phone: "" })
              }}
              className={cn(errors.phone && "border-destructive focus-visible:ring-destructive/20")}
            />
            {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
          </div>

          {/* Address Field */}
          <div className="space-y-1">
            <Label htmlFor="supplier-address" className="text-sm font-medium">
              Address <span className="text-destructive">*</span>
            </Label>
            <Input
              id="supplier-address"
              placeholder="Enter address"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value)
                if (errors.address) setErrors({ ...errors, address: "" })
              }}
              className={cn(errors.address && "border-destructive focus-visible:ring-destructive/20")}
            />
            {errors.address && <p className="text-xs text-destructive">{errors.address}</p>}
          </div>

          {/* Note Field */}
          <div className="space-y-1">
            <Label htmlFor="supplier-note" className="text-sm font-medium">
              Note <span className="text-destructive">*</span>
            </Label>
            <Input
              id="supplier-note"
              placeholder="Enter note"
              value={note}
              onChange={(e) => {
                setNote(e.target.value)
                if (errors.note) setErrors({ ...errors, note: "" })
              }}
              className={cn(errors.note && "border-destructive focus-visible:ring-destructive/20")}
            />
            {errors.note && <p className="text-xs text-destructive">{errors.note}</p>}
          </div>

          {/* Footer Actions */}
          <DialogFooter className="pt-4 border-t gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setCompany("")
                setContact("")
                setPhone("")
                setAddress("")
                setNote("")
                setErrors({})
                onOpenChange(false)
              }}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer">
              Register Supplier
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
