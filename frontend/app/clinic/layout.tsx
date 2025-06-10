import type React from "react"
import { Inter } from "next/font/google"
import Sidebar from "@/components/clinic-sidebar"
import BottomNavigation from "@/components/clinic-bottom-navigation"

const inter = Inter({ subsets: ["latin"] })

export default function ClinicLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className={`flex min-h-screen ${inter.className}`}>
      <Sidebar />
      <main className="flex-1 p-6 md:p-8 pb-20 md:pb-8">{children}</main>
      <BottomNavigation />
    </div>
  )
}
