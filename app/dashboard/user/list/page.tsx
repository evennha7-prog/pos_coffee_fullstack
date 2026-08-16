"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { IconPlus, IconSearch, IconEdit, IconTrash, IconChevronDown, IconLoader2 } from "@tabler/icons-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { getUsers, updateUser, deleteUser, User } from "@/lib/api"
import EditUser from "../EditUser"

export default function UserListPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [pageSize, setPageSize] = useState("10")

  // Modal dialog states
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deletingUser, setDeletingUser] = useState<User | null>(null)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const data = await getUsers()
      setUsers(data)
    } catch (error) {
      console.error("Failed to load users:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // Filter users based on search query
  const filteredUsers = users.filter((u) =>
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Handle Edit Action
  const handleEditClick = (user: User) => {
    setEditingUser(user)
    setIsEditOpen(true)
  }

  // Handle Edit Save
  const handleSave = async (updatedUser: any) => {
    try {
      const res = await updateUser(updatedUser.id, updatedUser)
      if (res.success && res.result) {
        setUsers(users.map(u => u.id === updatedUser.id ? res.result! : u))
      } else {
        alert(res.error || "Failed to update user")
      }
    } catch (error) {
      console.error("Failed to update user:", error)
    }
  }

  // Handle Delete Action Trigger
  const handleDeleteClick = (user: User) => {
    setDeletingUser(user)
    setIsDeleteOpen(true)
  }

  // Handle Delete Confirm
  const handleDeleteConfirm = async () => {
    if (deletingUser) {
      try {
        const success = await deleteUser(deletingUser.id)
        if (success) {
          setUsers(users.filter(u => u.id !== deletingUser.id))
        } else {
          alert("Failed to delete user")
        }
      } catch (error) {
        console.error("Failed to delete user:", error)
      } finally {
        setDeletingUser(null)
        setIsDeleteOpen(false)
      }
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 bg-slate-50/50 dark:bg-background">
      {/* Top Header: Title & "+ New" Button */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Users Management</h1>
        <Link href="/dashboard/user/create">
          <Button className="bg-black hover:bg-black/90 text-white rounded-xl px-5 font-bold h-10 gap-1.5 cursor-pointer">
            <IconPlus className="h-4 w-4" /> New User
          </Button>
        </Link>
      </div>

      <Card className="border bg-card shadow-xs rounded-2xl overflow-hidden">
        <CardContent className="p-6 space-y-6">
          {/* Filter Bar (Limit selector & Search) */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Page Limit Selector */}
            <div className="relative w-20">
              <select
                value={pageSize}
                onChange={(e) => setPageSize(e.target.value)}
                className="h-9 w-full rounded-xl border border-input bg-input/20 pl-3 pr-8 py-1 text-sm font-semibold transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 appearance-none cursor-pointer text-foreground"
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
              <IconChevronDown className="absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 pointer-events-none text-muted-foreground" />
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="Search by username, email, role..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-sm h-9 rounded-xl" 
              />
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto border rounded-2xl">
            {loading ? (
              <div className="flex items-center justify-center py-12 text-muted-foreground gap-2">
                <IconLoader2 className="h-5 w-5 animate-spin text-primary" />
                <span>Loading users from MySQL...</span>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground font-semibold">
                No users found matching "{searchQuery}"
              </div>
            ) : (
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-muted/40 border-b text-xs font-bold text-muted-foreground uppercase">
                  <tr>
                    <th className="px-6 py-3.5 w-20">N.o</th>
                    <th className="px-6 py-3.5">Username</th>
                    <th className="px-6 py-3.5">Email</th>
                    <th className="px-6 py-3.5">Role</th>
                    <th className="px-6 py-3.5 w-28 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredUsers.map((user, idx) => (
                    <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 font-bold text-foreground">
                        {idx + 1}
                      </td>
                      <td className="px-6 py-4 font-medium text-foreground">
                        {user.username}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground font-medium">
                        {user.email}
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase",
                          user.role === "super" && "bg-purple-500/10 text-purple-700 dark:text-purple-400",
                          user.role === "admin" && "bg-blue-500/10 text-blue-700 dark:text-blue-400",
                          user.role === "cashier" && "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                        )}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-3">
                        <Button 
                          variant="ghost" 
                          size="icon-xs"
                          onClick={() => handleEditClick(user)}
                          className="text-cyan-500 hover:text-cyan-600 hover:bg-cyan-500/10 cursor-pointer h-7 w-7 rounded-lg"
                        >
                          <IconEdit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon-xs"
                          onClick={() => handleDeleteClick(user)}
                          className="text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 cursor-pointer h-7 w-7 rounded-lg"
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

      {/* Edit User Dialog */}
      <EditUser
        isOpen={isEditOpen}
        onOpenChange={setIsEditOpen}
        user={editingUser}
        onSave={handleSave}
      />

      {/* Delete User Alert Dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User Account</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete user "{deletingUser?.username}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer"
            >
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
