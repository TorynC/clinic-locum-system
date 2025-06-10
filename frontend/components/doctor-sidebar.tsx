import type React from "react"
import Link from "next/link"
import { Calendar, ClipboardList, Home, Settings, User, Briefcase, LogOut, Bell } from "lucide-react"

export default function DoctorSidebar() {
  return (
    <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 h-screen sticky top-0">
      <div className="p-6 bg-purple-gradient text-white">
        <h1 className="text-2xl font-bold">MediLocum</h1>
        <p className="text-sm text-purple-100">Doctor Dashboard</p>
      </div>
      <nav className="flex-1 px-4 space-y-1 py-4">
        <SidebarLink href="/doctor" icon={<Home className="h-5 w-5" />} label="Home" />
        <SidebarLink href="/doctor/jobs" icon={<Briefcase className="h-5 w-5" />} label="Browse Jobs" />
        <SidebarLink href="/doctor/calendar" icon={<Calendar className="h-5 w-5" />} label="My Calendar" />
        <SidebarLink href="/doctor/dashboard" icon={<ClipboardList className="h-5 w-5" />} label="Dashboard" />
        <SidebarLink href="/doctor/profile" icon={<User className="h-5 w-5" />} label="My Profile" />
        <SidebarLink href="/doctor/notifications" icon={<Bell className="h-5 w-5" />} label="Notifications" />
        <SidebarLink href="/doctor/settings" icon={<Settings className="h-5 w-5" />} label="Settings" />
      </nav>
      <div className="p-4 border-t border-gray-200">
        <Link
          href="/"
          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 rounded-md hover:bg-purple-50 hover:text-purple-600 transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5 text-gray-500" />
          Sign Out
        </Link>
      </div>
    </div>
  )
}

function SidebarLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center px-4 py-3 text-gray-700 rounded-md hover:bg-purple-50 hover:text-purple-600 transition-colors"
    >
      <span className="mr-3 text-gray-500">{icon}</span>
      {label}
    </Link>
  )
}
