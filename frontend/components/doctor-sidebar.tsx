"use client"

import type React from "react"
import Link from "next/link"
import { Calendar, BarChart3, Home, User, Briefcase, LogOut, Bell, Stethoscope } from "lucide-react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export default function DoctorSidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden md:flex flex-col w-72 bg-white border-r border-slate-200 h-screen sticky top-0 shadow-soft">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
            <Stethoscope className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              LocumLah
            </h1>
            <p className="text-sm text-slate-500">Doctor Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        <SidebarLink
          href="/doctor"
          icon={<Home className="w-5 h-5" />}
          label="Home"
          isActive={pathname === "/doctor"}
        />
        <SidebarLink
          href="/doctor/jobs"
          icon={<Briefcase className="w-5 h-5" />}
          label="Browse Jobs"
          isActive={pathname.startsWith("/doctor/jobs")}
        />
        <SidebarLink
          href="/doctor/calendar"
          icon={<Calendar className="w-5 h-5" />}
          label="My Calendar"
          isActive={pathname.startsWith("/doctor/calendar")}
        />
        <SidebarLink
          href="/doctor/dashboard"
          icon={<BarChart3 className="w-5 h-5" />}
          label="Dashboard"
          isActive={pathname.startsWith("/doctor/dashboard")}
        />
        <SidebarLink
          href="/doctor/profile"
          icon={<User className="w-5 h-5" />}
          label="My Profile"
          isActive={pathname.startsWith("/doctor/profile")}
        />
        <SidebarLink
          href="/doctor/notifications"
          icon={<Bell className="w-5 h-5" />}
          label="Notifications"
          isActive={pathname.startsWith("/doctor/notifications")}
        />
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200">
        <Link
          href="/"
          className="flex items-center w-full px-4 py-3 text-slate-600 rounded-xl hover:bg-slate-100 hover:text-slate-900 transition-all duration-200"
        >
          <LogOut className="mr-3 w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </Link>
      </div>
    </div>
  )
}

function SidebarLink({
  href,
  icon,
  label,
  isActive,
}: {
  href: string
  icon: React.ReactNode
  label: string
  isActive: boolean
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center px-4 py-3 text-slate-600 rounded-xl hover:bg-slate-100 hover:text-slate-900 transition-all duration-200",
        isActive && "bg-blue-50 text-blue-700 border border-blue-200",
      )}
    >
      <span className="mr-3 text-current">{icon}</span>
      <span className="font-medium">{label}</span>
    </Link>
  )
}
