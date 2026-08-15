"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { IconPlus, IconSearch, IconEdit, IconTrash, IconTruck } from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import CreateSupplier from "./CreateSupplier"
import EditSupplier from "./EditSupplier"

interface Supplier {
  id: number
  company: string
  contact: string
  phone: string
  address: string
  note: string
}

export default function SupplierPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([
    { id: 1, company: "Highland Coffee Beans Co.", contact: "Bora Kim", phone: "+855 12 888 999", address: "123 St. Phnom Penh", note: "Delivers daily raw beans" },
    { id: 2, company: "Fresh Dairy Milk Supplies", contact: "Srey Leak", phone: "+855 92 333 444", address: "456 St. Kandal", note: "Requires cash on delivery" },
    { id: 3, company: "Artisan Bakery Wholesales", contact: "Jean Dupont", phone: "+855 10 555 777", address: "789 St. Siem Reap", note: "Pastry supplier" },
    { id: 4, company: "Eco Packaging Cambodia", contact: "Chea Meng", phone: "+855 78 222 111", address: "101 St. Phnom Penh", note: "Eco takeaway packaging" },
  ])

  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)

  // Filter suppliers based on search query
  const filteredSuppliers = suppliers.filter((s) =>
    s.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.note.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Handle supplier creation
  const handleCreate = (newSupp: Omit<Supplier, "id">) => {
    const nextId = suppliers.length > 0 ? Math.max(...suppliers.map((s) => s.id)) + 1 : 1
    setSuppliers([...suppliers, { id: nextId, ...newSupp }])
  }

  // Handle supplier update
  const handleSave = (updatedSupp: Supplier) => {
    setSuppliers(
      suppliers.map((s) => (s.id === updatedSupp.id ? updatedSupp : s))
    )
  }

  // Handle supplier deletion
  const handleDelete = (id: number, company: string) => {
    if (window.confirm(`Are you sure you want to delete the supplier "${company}"?`)) {
      setSuppliers(suppliers.filter((s) => s.id !== id))
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
            <p className="text-sm text-muted-foreground">Manage coffee bean and inventory raw material suppliers</p>
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
            {filteredSuppliers.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No suppliers found matching "{searchQuery}"
              </div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="border-y bg-muted/40 text-xs font-medium text-muted-foreground uppercase">
                  <tr>
                    <th className="px-4 py-3">Business Name</th>
                    <th className="px-4 py-3">Name</th>
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
                        <span>{s.company}</span>
                      </td>
                      <td className="px-4 py-3.5 text-foreground font-medium">{s.contact}</td>
                      <td className="px-4 py-3.5 text-muted-foreground font-mono text-xs">{s.phone}</td>
                      <td className="px-4 py-3.5 text-muted-foreground text-xs">{s.address}</td>
                      <td className="px-4 py-3.5 text-muted-foreground text-xs">{s.note}</td>
                      <td className="px-4 py-3.5 text-right space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 cursor-pointer"
                          onClick={() => {
                            setEditingSupplier(s)
                            setIsEditOpen(true)
                          }}
                        >
                          <IconEdit className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-destructive cursor-pointer"
                          onClick={() => handleDelete(s.id, s.company)}
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

