"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { IconPlus, IconSearch, IconEdit, IconTrash, IconUser, IconLoader2 } from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { getCustomers, createCustomer, updateCustomer, deleteCustomer, Customer } from "@/lib/api"
import CreateCustomer from "./CreateCustomer"
import EditCustomer from "./EditCustomer"

export default function CustomerPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const data = await getCustomers()
      setCustomers(data)
    } catch (error) {
      console.error("Failed to load customers:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  // Filter customers based on search query
  const filteredCustomers = customers.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.phone || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.address || "").toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Handle customer creation
  const handleCreate = async (newCust: Partial<Customer>) => {
    try {
      const res = await createCustomer(newCust)
      if (res.success && res.result) {
        setCustomers((prev) => [res.result!, ...prev])
      } else {
        alert(res.error || "Failed to create customer")
      }
    } catch (error) {
      console.error("Failed to create customer:", error)
    }
  }

  // Handle customer update
  const handleSave = async (updatedCust: Customer) => {
    try {
      const res = await updateCustomer(updatedCust.id, updatedCust)
      if (res.success && res.result) {
        setCustomers((prev) =>
          prev.map((c) => (c.id === updatedCust.id ? res.result! : c))
        )
      } else {
        alert(res.error || "Failed to update customer")
      }
    } catch (error) {
      console.error("Failed to update customer:", error)
    }
  }

  // Handle customer deletion
  const handleDelete = async (id: number, name: string) => {
    if (window.confirm(`Are you sure you want to delete the customer "${name}"?`)) {
      try {
        const success = await deleteCustomer(id)
        if (success) {
          setCustomers((prev) => prev.filter((c) => c.id !== id))
        } else {
          alert("Failed to delete customer")
        }
      } catch (error) {
        console.error("Failed to delete customer:", error)
      }
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 bg-slate-50/50 dark:bg-background">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/15 text-blue-500 font-bold shadow-2xs">
            <IconUser className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Customer Directory</h1>
            <p className="text-sm text-muted-foreground">Manage your coffee shop customers in MySQL database</p>
          </div>
        </div>
        <Button 
          onClick={() => setIsCreateOpen(true)}
          className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
        >
          <IconPlus className="h-4 w-4" /> Add Customer
        </Button>
      </div>

      <Card className="border bg-card shadow-2xs">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Registered Customers</CardTitle>
            <CardDescription>
              Total {filteredCustomers.length} customer{filteredCustomers.length !== 1 && "s"} found
            </CardDescription>
          </div>
          <div className="relative w-full sm:w-64">
            <IconSearch className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search customer by name, phone..." 
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
                <span>Loading customers from MySQL...</span>
              </div>
            ) : filteredCustomers.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No customers found matching "{searchQuery}"
              </div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="border-y bg-muted/40 text-xs font-medium text-muted-foreground uppercase">
                  <tr>
                    <th className="px-4 py-3">Customer Name</th>
                    <th className="px-4 py-3">Phone</th>
                    <th className="px-4 py-3">Address</th>
                    <th className="px-4 py-3">Note</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredCustomers.map((c) => (
                    <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3.5 font-medium flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10 text-blue-600 font-semibold text-xs">
                          <IconUser className="h-4 w-4" />
                        </div>
                        <span>{c.name}</span>
                      </td>
                      <td className="px-4 py-3.5 text-muted-foreground font-mono text-xs">{c.phone || "-"}</td>
                      <td className="px-4 py-3.5 text-muted-foreground text-xs">{c.address || "-"}</td>
                      <td className="px-4 py-3.5 text-muted-foreground text-xs">{c.note || "-"}</td>
                      <td className="px-4 py-3.5 text-right space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 cursor-pointer"
                          onClick={() => {
                            setEditingCustomer(c)
                            setIsEditOpen(true)
                          }}
                        >
                          <IconEdit className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-destructive cursor-pointer"
                          onClick={() => handleDelete(c.id, c.name)}
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

      {/* Create Customer Modal */}
      <CreateCustomer 
        isOpen={isCreateOpen} 
        onOpenChange={setIsCreateOpen} 
        onCreate={handleCreate} 
      />

      {/* Edit Customer Modal */}
      <EditCustomer 
        isOpen={isEditOpen} 
        onOpenChange={setIsEditOpen} 
        customer={editingCustomer}
        onSave={handleSave} 
      />
    </div>
  )
}
