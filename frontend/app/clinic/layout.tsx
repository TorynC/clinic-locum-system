import type React from "react";
import Sidebar from "@/components/clinic-sidebar";
import BottomNavigation from "@/components/clinic-bottom-navigation";
import { Toaster } from "sonner";

export default function ClinicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen">
      <Toaster position="top-right" richColors />
      <Sidebar />
      <main className="flex-1 p-6 md:p-8 pb-20 md:pb-8">{children}</main>
      <BottomNavigation />
    </div>
  );
}
