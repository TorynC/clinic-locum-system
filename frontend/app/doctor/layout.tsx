"use client";

import type React from "react";
import DoctorSidebar from "@/components/doctor-sidebar";
import DoctorBottomNavigation from "@/components/doctor-bottom-navigation";
import { Toaster } from "sonner";
import NotificationListener from "@/components/notification-listener";
import { useDoctorProfileGuard } from "@/hooks/useDoctorProfileGuard";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isProfileComplete, isLoading } = useDoctorProfileGuard();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Toaster position="top-right" richColors />
      <NotificationListener userType="doctor" />
      <DoctorSidebar />
      <main className="flex-1 p-3 sm:p-6 md:p-8 pb-20 md:pb-8 overflow-x-hidden">
        {children}
      </main>
      <DoctorBottomNavigation></DoctorBottomNavigation>
    </div>
  );
}

export default function DoctorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <LayoutContent>{children}</LayoutContent>;
}
