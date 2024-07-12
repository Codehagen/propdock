"use client"

import type { SidebarNavItem } from "@/types"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { Icons } from "@/components/shared/icons"

interface DashboardNavProps {
  items: SidebarNavItem[]
  slug?: string
}

export function DashboardNav({ items, slug }: DashboardNavProps) {
  const path = usePathname()

  if (!items.length) {
    return null
  }

  return (
    <nav className="grid items-start gap-2 max-md:grid-flow-col">
      {items.map((item) => {
        const Icon = Icons[item.icon || "arrowRight"]
        const CheckIcon = Icons.check
        return (
          <div key={item.href}>
            <Link
              href={
                item.disabled
                  ? `/`
                  : `${slug ? `/property/${slug}${item.href}` : `${item.href}`}`
              }
            >
              <span
                className={cn(
                  "group flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  path === item.href ? "bg-accent" : "transparent",
                  item.disabled && "cursor-not-allowed opacity-80",
                )}
              >
                <div className="flex items-center">
                  <Icon className="mr-2 h-4 w-4" />
                  <span>{item.title}</span>
                </div>
                {item.completed && (
                  <CheckIcon className="ml-2 h-4 w-4 text-green-500" />
                )}
              </span>
            </Link>
          </div>
        )
      })}
    </nav>
  )
}
