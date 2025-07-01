"use client"

import type React from "react"
import Link from "next/link"
import { Calendar, BarChart3, Home, Settings, User, Users, Plus, LogOut, Building2, Pencil, Briefcase } from "lucide-react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export default function ClinicSidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden md:flex flex-col w-72 bg-white border-r border-slate-200 h-screen sticky top-0 shadow-soft">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              LocumLah
            </h1>
            <p className="text-sm text-slate-500">Clinic Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        <SidebarLink
          href="/clinic"
          icon={<Home className="w-5 h-5" />}
          label="Dashboard"
          isActive={pathname === "/clinic"}
        />
        <SidebarLink
          href="/clinic/post-job"
          icon={<Plus className="w-5 h-5" />}
          label="Post Job"
          isActive={pathname.startsWith("/clinic/post-job")}
        />
        <SidebarLink
          href="/clinic/edit-job"
          icon={<Pencil className="w-5 h-5" />}
          label="Edit Job"
          isActive={pathname.startsWith("/clinic/edit-job")}
        />
        <SidebarLink
          href="/clinic/calendar"
          icon={<Calendar className="w-5 h-5" />}
          label="Calendar"
          isActive={pathname.startsWith("/clinic/calendar")}
        />
        <SidebarLink
          href="/clinic/applications"
          icon={<Briefcase className="w-5 h-5" />}
          label="Applications"
          isActive={pathname.startsWith("/clinic/applications")}
        />
        <SidebarLink
          href="/clinic/dashboard"
          icon={<BarChart3 className="w-5 h-5" />}
          label="Analytics"
          isActive={pathname.startsWith("/clinic/dashboard")}
        />
        <SidebarLink
          href="/clinic/doctors"
          icon={<Users className="w-5 h-5" />}
          label="Doctors"
          isActive={pathname.startsWith("/clinic/doctors")}
        />
        <SidebarLink
          href="/clinic/profile"
          icon={<User className="w-5 h-5" />}
          label="Profile"
          isActive={pathname.startsWith("/clinic/profile")}
        />
        <SidebarLink
          href="/clinic/settings"
          icon={<Settings className="w-5 h-5" />}
          label="Settings"
          isActive={pathname.startsWith("/clinic/settings")}
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
