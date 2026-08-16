"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  IconLayoutRows,
  IconWaveSine,
  IconCommand,
  IconLayoutGrid,
  IconMenu2,
  IconDatabase,
  IconCategory,
  IconCoffee,
  IconUsers,
  IconTruck,
  IconShoppingCart,
  IconClipboardList,
  IconCirclePlus,
  IconReceipt,
  IconReceiptTax,
  IconCalculator,
  IconCurrencyDollar,
  IconUsersGroup,
  IconUserCheck,
  IconUserPlus,
  IconShieldLock,
  IconReportAnalytics,
  IconChartLine,
  IconPackages,
  IconAlertTriangle,
  IconBox,
  IconTrendingDown,
  IconCircleX,
  IconHourglass,
  IconTrendingUp,
  IconRefresh,
  IconPlayerPlay,
  IconClipboardText,
  IconCircleCheck,
  IconLock,
  IconAdjustments,
  IconBarcode,
  IconAlertCircle,
  IconCalendarX,
  IconHistory,
  IconTruckLoading,
  IconArrowUpRight,
  IconArrowDownRight,
  IconPigMoney,
} from "@tabler/icons-react"

// This is sample data.
const data = {
  user: {
    name: "Super Admin",
    email: "super@coffee.com",
    avatar: "/favicon.ico",
  },
  teams: [
    {
      name: "Coffee POS",
      logo: (
        <img
          src="/favicon.ico"
          alt="Coffee POS"
          className="h-full w-full object-cover rounded-lg"
        />
      ),
      plan: "Main Branch",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: (
        <div className="flex h-5 w-5 items-center justify-center rounded-md bg-emerald-600 text-white shadow-xs">
          <IconLayoutGrid className="h-3.5 w-3.5" />
        </div>
      ),
      isActive: true,
    },
    {
      title: "Menu",
      url: "#",
      icon: <IconMenu2 className="size-4 text-amber-500" />,
      items: [
        {
          title: "Category",
          url: "/dashboard/category",
          icon: (
            <div className="flex p-1 rounded-md bg-amber-500/15 text-amber-500">
              <IconCategory className="size-3.5" />
            </div>
          ),
        },
        {
          title: "Product",
          url: "/dashboard/product",
          icon: (
            <div className="flex p-1 rounded-md bg-orange-500/15 text-orange-500">
              <IconCoffee className="size-3.5" />
            </div>
          ),
        },
        {
          title: "Customer",
          url: "/dashboard/customer",
          icon: (
            <div className="flex p-1 rounded-md bg-blue-500/15 text-blue-500">
              <IconUsers className="size-3.5" />
            </div>
          ),
        },
        {
          title: "Supplier",
          url: "/dashboard/supplier",
          icon: (
            <div className="flex p-1 rounded-md bg-emerald-500/15 text-emerald-500">
              <IconTruck className="size-3.5" />
            </div>
          ),
        },
      ],
    },
    {
      title: "Purchase",
      url: "#",
      icon: <IconShoppingCart className="size-4 text-indigo-500" />,
      items: [
        {
          title: "Purchase List",
          url: "/dashboard/purchase/list",
          icon: (
            <div className="flex p-1 rounded-md bg-indigo-500/15 text-indigo-500">
              <IconClipboardList className="size-3.5" />
            </div>
          ),
        },
        {
          title: "Create Purchase",
          url: "/dashboard/purchase/create",
          icon: (
            <div className="flex p-1 rounded-md bg-teal-500/15 text-teal-500">
              <IconCirclePlus className="size-3.5" />
            </div>
          ),
        },
      ],
    },
    {
      title: "Sale",
      url: "#",
      icon: <IconReceipt className="size-4 text-violet-500" />,
      items: [
        {
          title: "List Sale",
          url: "/dashboard/sale/list",
          icon: (
            <div className="flex p-1 rounded-md bg-violet-500/15 text-violet-500">
              <IconReceiptTax className="size-3.5" />
            </div>
          ),
        },
        {
          title: "POS",
          url: "/dashboard/sale/pos",
          icon: (
            <div className="flex p-1 rounded-md bg-purple-500/15 text-purple-500">
              <IconCalculator className="size-3.5" />
            </div>
          ),
        },
        {
          title: "Exchange Currency",
          url: "/dashboard/sale/exchange-currency",
          icon: (
            <div className="flex p-1 rounded-md bg-amber-400/15 text-amber-500">
              <IconCurrencyDollar className="size-3.5" />
            </div>
          ),
        },
      ],
    },
    {
      title: "Stock Management",
      url: "#",
      icon: <IconBox className="size-4 text-blue-500" />,
      items: [
        {
          title: "Opening Stock",
          url: "/dashboard/stock/opening",
          icon: (
            <div className="flex p-1 rounded-md bg-slate-500/15 text-slate-500">
              <IconPlayerPlay className="size-3.5" />
            </div>
          ),
        },
        {
          title: "Current Stock",
          url: "/dashboard/stock/current",
          icon: (
            <div className="flex p-1 rounded-md bg-indigo-500/15 text-indigo-500">
              <IconClipboardText className="size-3.5" />
            </div>
          ),
        },
        {
          title: "Available Stock",
          url: "/dashboard/stock/available",
          icon: (
            <div className="flex p-1 rounded-md bg-emerald-500/15 text-emerald-500">
              <IconCircleCheck className="size-3.5" />
            </div>
          ),
        },
        {
          title: "Reserved Stock",
          url: "/dashboard/stock/reserved",
          icon: (
            <div className="flex p-1 rounded-md bg-teal-500/15 text-teal-500">
              <IconLock className="size-3.5" />
            </div>
          ),
        },
        {
          title: "Stock Adjustment",
          url: "/dashboard/stock/adjustment",
          icon: (
            <div className="flex p-1 rounded-md bg-amber-500/15 text-amber-500">
              <IconAdjustments className="size-3.5" />
            </div>
          ),
        },
        {
          title: "Stock Count",
          url: "/dashboard/stock/count",
          icon: (
            <div className="flex p-1 rounded-md bg-sky-500/15 text-sky-500">
              <IconBarcode className="size-3.5" />
            </div>
          ),
        },
        {
          title: "Damaged/Lost Items",
          url: "/dashboard/stock/damaged-lost",
          icon: (
            <div className="flex p-1 rounded-md bg-rose-500/15 text-rose-500">
              <IconAlertCircle className="size-3.5" />
            </div>
          ),
        },
        {
          title: "Expired Items",
          url: "/dashboard/stock/expired",
          icon: (
            <div className="flex p-1 rounded-md bg-violet-500/15 text-violet-500">
              <IconCalendarX className="size-3.5" />
            </div>
          ),
        },
        {
          title: "Stock record",
          url: "/dashboard/stock/record",
          icon: (
            <div className="flex p-1 rounded-md bg-emerald-500/15 text-emerald-500">
              <IconPackages className="size-3.5" />
            </div>
          ),
        },
        {
          title: "Purchasing goods",
          url: "/dashboard/report/purchasing-goods",
          icon: (
            <div className="flex p-1 rounded-md bg-teal-500/15 text-teal-500">
              <IconShoppingCart className="size-3.5" />
            </div>
          ),
        },
      ],
    },
    {
      title: "Inventory Alerts",
      url: "#",
      icon: <IconAlertTriangle className="size-4 text-rose-500" />,
      items: [
        {
          title: "Low Stock Alert",
          url: "/dashboard/inventory/low-stock",
          icon: (
            <div className="flex p-1 rounded-md bg-amber-500/15 text-amber-500">
              <IconTrendingDown className="size-3.5" />
            </div>
          ),
        },
        {
          title: "Out of Stock Alert",
          url: "/dashboard/inventory/out-of-stock",
          icon: (
            <div className="flex p-1 rounded-md bg-rose-500/15 text-rose-500">
              <IconCircleX className="size-3.5" />
            </div>
          ),
        },
        {
          title: "Expiring Soon Alert",
          url: "/dashboard/inventory/expiring-soon",
          icon: (
            <div className="flex p-1 rounded-md bg-orange-500/15 text-orange-500">
              <IconHourglass className="size-3.5" />
            </div>
          ),
        },
        {
          title: "Overstock Alert",
          url: "/dashboard/inventory/overstock",
          icon: (
            <div className="flex p-1 rounded-md bg-cyan-500/15 text-cyan-500">
              <IconTrendingUp className="size-3.5" />
            </div>
          ),
        },
        {
          title: "Reorder Level",
          url: "/dashboard/inventory/reorder-level",
          icon: (
            <div className="flex p-1 rounded-md bg-purple-500/15 text-purple-500">
              <IconRefresh className="size-3.5" />
            </div>
          ),
        },
      ],
    },
    {
      title: "User",
      url: "#",
      icon: <IconUsersGroup className="size-4 text-cyan-500" />,
      items: [
        {
          title: "User List",
          url: "/dashboard/user/list",
          icon: (
            <div className="flex p-1 rounded-md bg-cyan-500/15 text-cyan-500">
              <IconUserCheck className="size-3.5" />
            </div>
          ),
        },
        {
          title: "Create User",
          url: "/dashboard/user/create",
          icon: (
            <div className="flex p-1 rounded-md bg-pink-500/15 text-pink-500">
              <IconUserPlus className="size-3.5" />
            </div>
          ),
        },
        {
          title: "Role & Permissions",
          url: "/dashboard/user/roles",
          icon: (
            <div className="flex p-1 rounded-md bg-rose-500/15 text-rose-500">
              <IconShieldLock className="size-3.5" />
            </div>
          ),
        },
      ],
    },
    {
      title: "Report",
      url: "#",
      icon: <IconReportAnalytics className="size-4 text-sky-500" />,
      items: [
        {
          title: "Sale Report",
          url: "/dashboard/report/sale",
          icon: (
            <div className="flex p-1 rounded-md bg-sky-500/15 text-sky-500">
              <IconChartLine className="size-3.5" />
            </div>
          ),
        },
        {
          title: "History Sale",
          url: "/dashboard/report/history-sale",
          icon: (
            <div className="flex p-1 rounded-md bg-indigo-500/15 text-indigo-500">
              <IconHistory className="size-3.5" />
            </div>
          ),
        },
        {
          title: "Income",
          url: "/dashboard/report/income",
          icon: (
            <div className="flex p-1 rounded-md bg-emerald-500/15 text-emerald-500">
              <IconArrowUpRight className="size-3.5" />
            </div>
          ),
        },
        {
          title: "Expenses",
          url: "/dashboard/report/expenses",
          icon: (
            <div className="flex p-1 rounded-md bg-rose-500/15 text-rose-500">
              <IconArrowDownRight className="size-3.5" />
            </div>
          ),
        },
        {
          title: "Profit",
          url: "/dashboard/report/profit",
          icon: (
            <div className="flex p-1 rounded-md bg-purple-500/15 text-purple-500">
              <IconPigMoney className="size-3.5" />
            </div>
          ),
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
