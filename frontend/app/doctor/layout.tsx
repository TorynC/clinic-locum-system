import type React from "react"
import DoctorSidebar from "@/components/doctor-sidebar"
import DoctorBottomNavigation from "@/components/doctor-bottom-navigation"

export default function DoctorLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex min-h-screen">
      <DoctorSidebar />
      <main className="flex-1 p-6 md:p-8 pb-20 md:pb-8">{children}</main>
      <DoctorBottomNavigation />
    </div>
  )
}
