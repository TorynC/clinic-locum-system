"use client"

import { Home, Calendar, PlusCircle, ClipboardList, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export default function BottomNavigation() {
  const pathname = usePathname()

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Post Job", href: "/post-job", icon: PlusCircle },
    { name: "Calendar", href: "/calendar", icon: Calendar },
    { name: "Dashboard", href: "/dashboard", icon: ClipboardList },
    { name: "Profile", href: "/profile", icon: User },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden safe-bottom">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn("bottom-nav-item w-full h-full mobile-touch-target", isActive && "active")}
            >
              <item.icon className={cn("h-6 w-6 mb-1", isActive ? "text-purple-600" : "text-gray-500")} />
              <span className={cn("text-xs", isActive ? "text-purple-600" : "text-gray-500")}>{item.name}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
