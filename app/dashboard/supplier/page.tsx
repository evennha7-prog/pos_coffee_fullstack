"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { IconPlus, IconSearch, IconEdit, IconTrash, IconTruck, IconLoader2 } from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { getSuppliers, createSupplier, updateSupplier, deleteSupplier, Supplier } from "@/lib/api"
import CreateSupplier from "./CreateSupplier"
import EditSupplier from "./EditSupplier"

export default function SupplierPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)

  const fetchSuppliers = async () => {
    try {
      setLoading(true)
      const data = await getSuppliers()
      setSuppliers(data)
    } catch (error) {
      console.error("Failed to load suppliers:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSuppliers()
  }, [])

  // Filter suppliers based on search query
  const filteredSuppliers = suppliers.filter((s) => {
    const bName = (s.business_name || s.businessName || "").toLowerCase()
    const name = (s.name || "").toLowerCase()
    const phone = (s.phone || "").toLowerCase()
    const q = searchQuery.toLowerCase()
    return bName.includes(q) || name.includes(q) || phone.includes(q)
  })

  // Handle supplier creation
  const handleCreate = async (newSupp: any) => {
    try {
      const payload: Partial<Supplier> = {
        business_name: newSupp.company || newSupp.business_name || newSupp.name,
        name: newSupp.contact || newSupp.name,
        phone: newSupp.phone || "",
        address: newSupp.address || "",
        note: newSupp.note || "",
      }
      const res = await createSupplier(payload)
      if (res.success && res.result) {
        setSuppliers((prev) => [res.result!, ...prev])
      } else {
        alert(res.error || "Failed to create supplier")
      }
    } catch (error) {
      console.error("Failed to create supplier:", error)
    }
  }

  // Handle supplier update
  const handleSave = async (updatedSupp: any) => {
    try {
      const payload: Partial<Supplier> = {
        business_name: updatedSupp.company || updatedSupp.business_name || updatedSupp.name,
        name: updatedSupp.contact || updatedSupp.name,
        phone: updatedSupp.phone || "",
        address: updatedSupp.address || "",
        note: updatedSupp.note || "",
      }
      const res = await updateSupplier(updatedSupp.id, payload)
      if (res.success && res.result) {
        setSuppliers((prev) =>
          prev.map((s) => (s.id === updatedSupp.id ? res.result! : s))
        )
      } else {
        alert(res.error || "Failed to update supplier")
      }
    } catch (error) {
      console.error("Failed to update supplier:", error)
    }
  }

  // Handle supplier deletion
  const handleDelete = async (id: number, company: string) => {
    if (window.confirm(`Are you sure you want to delete the supplier "${company}"?`)) {
      try {
        const success = await deleteSupplier(id)
        if (success) {
          setSuppliers((prev) => prev.filter((s) => s.id !== id))
        } else {
          alert("Failed to delete supplier")
        }
      } catch (error) {
        console.error("Failed to delete supplier:", error)
      }
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 bg-slate-50/50 dark:bg-background">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-500 font-bold shadow-2xs">
            <IconTruck className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Supplier Management</h1>
            <p className="text-sm text-muted-foreground">Manage coffee bean & raw material suppliers from MySQL</p>
          </div>
        </div>
        <Button 
          onClick={() => setIsCreateOpen(true)}
          className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
        >
          <IconPlus className="h-4 w-4" /> Add Supplier
        </Button>
      </div>

      <Card className="border bg-card shadow-2xs">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Active Suppliers</CardTitle>
            <CardDescription>
              Total {filteredSuppliers.length} supplier{filteredSuppliers.length !== 1 && "s"} found
            </CardDescription>
          </div>
          <div className="relative w-full sm:w-64">
            <IconSearch className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search supplier..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 text-sm h-9" 
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12 text-muted-foreground gap-2">
                <IconLoader2 className="h-5 w-5 animate-spin text-primary" />
                <span>Loading suppliers from MySQL...</span>
              </div>
            ) : filteredSuppliers.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No suppliers found matching "{searchQuery}"
              </div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="border-y bg-muted/40 text-xs font-medium text-muted-foreground uppercase">
                  <tr>
                    <th className="px-4 py-3">Business Name</th>
                    <th className="px-4 py-3">Contact Person</th>
                    <th className="px-4 py-3">Phone</th>
                    <th className="px-4 py-3">Address</th>
                    <th className="px-4 py-3">Note</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredSuppliers.map((s) => (
                    <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3.5 font-medium flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                          <IconTruck className="h-4 w-4" />
                        </div>
                        <span>{s.business_name || s.businessName}</span>
                      </td>
                      <td className="px-4 py-3.5 text-foreground font-medium">{s.name}</td>
                      <td className="px-4 py-3.5 text-muted-foreground font-mono text-xs">{s.phone || "-"}</td>
                      <td className="px-4 py-3.5 text-muted-foreground text-xs">{s.address || "-"}</td>
                      <td className="px-4 py-3.5 text-muted-foreground text-xs">{s.note || "-"}</td>
                      <td className="px-4 py-3.5 text-right space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 cursor-pointer"
                          onClick={() => {
                            setEditingSupplier({
                              ...s,
                              company: s.business_name || s.businessName,
                              contact: s.name,
                            } as any)
                            setIsEditOpen(true)
                          }}
                        >
                          <IconEdit className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-destructive cursor-pointer"
                          onClick={() => handleDelete(s.id, s.business_name || s.businessName || s.name)}
                        >
                          <IconTrash className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Create Supplier Modal */}
      <CreateSupplier 
        isOpen={isCreateOpen} 
        onOpenChange={setIsCreateOpen} 
        onCreate={handleCreate} 
      />

      {/* Edit Supplier Modal */}
      <EditSupplier 
        isOpen={isEditOpen} 
        onOpenChange={setIsEditOpen} 
        supplier={editingSupplier}
        onSave={handleSave} 
      />
    </div>
  )
}
