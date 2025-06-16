import type React from "react"
import Link from "next/link"
import { Calendar, ClipboardList, Home, Settings, User, Users, PlusCircle, LogOut, Pencil } from "lucide-react"

export default function Sidebar() {
  return (
    <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 h-screen sticky top-0">
      <div className="p-6 bg-purple-gradient text-white">
        <h1 className="text-2xl font-bold">MediLocum</h1>
        <p className="text-sm text-purple-100">Clinic Dashboard</p>
      </div>
      <nav className="flex-1 px-4 space-y-1 py-4">
        <SidebarLink href="/clinic" icon={<Home className="h-5 w-5" />} label="Home" />
        <SidebarLink href="/clinic/post-job" icon={<PlusCircle className="h-5 w-5" />} label="Post a Job" />
        <SidebarLink href="/clinic/edit-job" icon={<Pencil className="h-5 w-5" />} label="Edit a Job" />
        <SidebarLink href="/clinic/calendar" icon={<Calendar className="h-5 w-5" />} label="Calendar" />
        <SidebarLink href="/clinic/dashboard" icon={<ClipboardList className="h-5 w-5" />} label="Dashboard" />
        <SidebarLink href="/clinic/profile" icon={<User className="h-5 w-5" />} label="Clinic Profile" />
        <SidebarLink href="/clinic/doctors" icon={<Users className="h-5 w-5" />} label="Preferred Doctors" />
        <SidebarLink href="/clinic/settings" icon={<Settings className="h-5 w-5" />} label="Settings" />
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
