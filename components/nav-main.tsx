"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { IconChevronRight } from "@tabler/icons-react"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: React.ReactNode
    isActive?: boolean
    items?: {
      title: string
      url: string
      icon?: React.ReactNode
    }[]
  }[]
}) {
  const pathname = usePathname()

  // Track open state per section
  const [openItems, setOpenItems] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {}
    items.forEach((item) => {
      const isSubActive = item.items?.some(
        (sub) => sub.url !== "#" && (pathname === sub.url || pathname.startsWith(sub.url))
      )
      if (item.isActive || isSubActive) {
        initial[item.title] = true
      }
    })
    return initial
  })

  // Automatically expand active section when pathname changes
  useEffect(() => {
    items.forEach((item) => {
      const isSubActive = item.items?.some(
        (sub) => sub.url !== "#" && (pathname === sub.url || pathname.startsWith(sub.url))
      )
      if (isSubActive) {
        setOpenItems((prev) => ({ ...prev, [item.title]: true }))
      }
    })
  }, [pathname, items])

  const toggleOpen = (title: string, isOpen: boolean) => {
    setOpenItems((prev) => ({
      ...prev,
      [title]: isOpen,
    }))
  }

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const hasSubItems = item.items && item.items.length > 0
          const isItemActive = item.url !== "#" && pathname === item.url

          if (!hasSubItems) {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  isActive={isItemActive || item.isActive}
                  tooltip={item.title}
                  render={<Link href={item.url} />}
                  className={
                    isItemActive || item.isActive
                      ? "font-semibold text-foreground text-sm"
                      : "text-muted-foreground hover:text-foreground text-sm"
                  }
                >
                  {item.icon}
                  <span
                    className={
                      isItemActive || item.isActive
                        ? "font-semibold text-foreground"
                        : "font-normal text-muted-foreground"
                    }
                  >
                    {item.title}
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          }

          const isOpen = openItems[item.title] ?? item.isActive ?? false

          return (
            <Collapsible
              key={item.title}
              open={isOpen}
              onOpenChange={(openState) => toggleOpen(item.title, openState)}
              className="group/collapsible"
              render={<SidebarMenuItem />}
            >
              <CollapsibleTrigger
                render={<SidebarMenuButton tooltip={item.title} />}
              >
                {item.icon}
                <span className="font-medium">{item.title}</span>
                <IconChevronRight className="ml-auto transition-transform duration-200 group-data-open/collapsible:rotate-90" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => {
                    const isSubActive =
                      subItem.url !== "#" &&
                      (pathname === subItem.url || pathname.startsWith(subItem.url))
                    return (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          isActive={isSubActive}
                          render={
                            subItem.url === "#" ? (
                              <button type="button" />
                            ) : (
                              <Link href={subItem.url} />
                            )
                          }
                        >
                          {subItem.icon}
                          <span>{subItem.title}</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    )
                  })}
                </SidebarMenuSub>
              </CollapsibleContent>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}

