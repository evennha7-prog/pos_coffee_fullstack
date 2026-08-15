"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { IconPlus, IconSearch, IconEdit, IconTrash, IconCategory } from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import CreateCategory from "./CreateCategory"
import EditCategory from "./EditCategory"

interface Category {
  id: number
  name: string
  count: string
  status: string
  icon: string
}

export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([
    { id: 1, name: "Coffee & Espresso", count: "18 items", status: "Active", icon: "☕" },
    { id: 2, name: "Pastries & Bakery", count: "12 items", status: "Active", icon: "🥐" },
    { id: 3, name: "Tea & Non-Coffee", count: "10 items", status: "Active", icon: "🍵" },
    { id: 4, name: "Beans & Merchandise", count: "6 items", status: "Active", icon: "📦" },
  ])

  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  // Filter categories based on search query
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Handle category creation
  const handleCreate = (newCat: Omit<Category, "id">) => {
    const nextId = categories.length > 0 ? Math.max(...categories.map((c) => c.id)) + 1 : 1
    setCategories([...categories, { id: nextId, ...newCat }])
  }

  // Handle category update
  const handleSave = (updatedCat: Category) => {
    setCategories(
      categories.map((cat) => (cat.id === updatedCat.id ? updatedCat : cat))
    )
  }

  // Handle category deletion
  const handleDelete = (id: number, name: string) => {
    if (window.confirm(`Are you sure you want to delete the category "${name}"?`)) {
      setCategories(categories.filter((cat) => cat.id !== id))
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 bg-slate-50/50 dark:bg-background">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-500 font-bold shadow-2xs">
            <IconCategory className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Category Management</h1>
            <p className="text-sm text-muted-foreground">Manage your coffee shop product categories</p>
          </div>
        </div>
        <Button 
          onClick={() => setIsCreateOpen(true)}
          className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
        >
          <IconPlus className="h-4 w-4" /> Add Category
        </Button>
      </div>

      <Card className="border bg-card shadow-2xs">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Categories List</CardTitle>
            <CardDescription>
              Total {filteredCategories.length} category{filteredCategories.length !== 1 && "ies"} found
            </CardDescription>
          </div>
          <div className="relative w-full sm:w-64">
            <IconSearch className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search category..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 text-sm h-9" 
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            {filteredCategories.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No categories found matching "{searchQuery}"
              </div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="border-y bg-muted/40 text-xs font-medium text-muted-foreground uppercase">
                  <tr>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Items Count</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredCategories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3.5 font-medium flex items-center gap-3">
                        <span className="text-xl">{cat.icon}</span>
                        <span>{cat.name}</span>
                      </td>
                      <td className="px-4 py-3.5 text-muted-foreground">{cat.count}</td>
                      <td className="px-4 py-3.5">
                        <span className={cn(
                          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                          cat.status === "Active"
                            ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                            : "bg-rose-500/10 text-rose-700 dark:text-rose-400"
                        )}>
                          {cat.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 cursor-pointer"
                          onClick={() => {
                            setEditingCategory(cat)
                            setIsEditOpen(true)
                          }}
                        >
                          <IconEdit className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-destructive cursor-pointer"
                          onClick={() => handleDelete(cat.id, cat.name)}
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

      {/* Create Category Modal */}
      <CreateCategory 
        isOpen={isCreateOpen} 
        onOpenChange={setIsCreateOpen} 
        onCreate={handleCreate} 
      />

      {/* Edit Category Modal */}
      <EditCategory 
        isOpen={isEditOpen} 
        onOpenChange={setIsEditOpen} 
        category={editingCategory}
        onSave={handleSave} 
      />
    </div>
  )
}


