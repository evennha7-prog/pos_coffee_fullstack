"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  IconSearch,
  IconBell,
  IconShoppingCart,
  IconSun,
  IconMoon,
} from "@tabler/icons-react"

export function DashboardHeader() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("theme")
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
        setIsDark(true)
        document.documentElement.classList.add("dark")
      } else {
        setIsDark(false)
        document.documentElement.classList.remove("dark")
      }
    } catch {
      // fallback
    }
  }, [])

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
      setIsDark(false)
    } else {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
      setIsDark(true)
    }
  }

  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between border-b bg-background/95 backdrop-blur-md px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-14">
      {/* Left side: Sidebar Toggle & Breadcrumb */}
      <div className="flex items-center gap-3">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="h-4 self-center"
        />
        <Breadcrumb className="hidden sm:block">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard" className="font-semibold text-foreground">
                Coffee POS
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Middle side: Search Bar */}
      <div className="flex max-w-sm flex-1 items-center px-4">
        <div className="relative w-full">
          <IconSearch className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products, sales, customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 w-full rounded-md bg-muted/50 pl-8 pr-4 text-sm focus:bg-background"
          />
        </div>
      </div>

      {/* Right side: Actions */}
      <div className="flex items-center gap-3">
        {/* Dark / Light mode toggle button */}
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9"
          onClick={toggleTheme}
          aria-label="Toggle Dark / Light Mode"
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? (
            <IconSun className="h-4 w-4 text-amber-400" />
          ) : (
            <IconMoon className="h-4 w-4 text-slate-700" />
          )}
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="relative h-9 w-9"
          aria-label="Notifications"
        >
          <IconBell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
          </span>
        </Button>

        <Button
          size="sm"
          className="h-9 gap-1.5 font-medium bg-purple-600 text-white hover:bg-purple-700 shadow-sm transition-colors cursor-pointer"
          onClick={() => router.push("/dashboard/sale/pos")}
        >
          <IconShoppingCart className="h-4 w-4" />
          <span className="hidden sm:inline">Open POS</span>
        </Button>
      </div>
    </header>
  )
}

