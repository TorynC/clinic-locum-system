"use client";

import {
  Home,
  Calendar,
  Briefcase,
  BarChart3,
  User,
  Bell,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function DoctorBottomNavigation() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/doctor", icon: Home },
    { name: "Jobs", href: "/doctor/jobs", icon: Briefcase },
    { name: "Calendar", href: "/doctor/calendar", icon: Calendar },
    { name: "Dashboard", href: "/doctor/dashboard", icon: BarChart3 },
    { name: "Profile", href: "/doctor/profile", icon: User },
    { name: "Notifications", href: "/doctor/notifications", icon: Bell },
    { name: "Log Out", href: "/", icon: LogOut },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden">
      <div className="grid grid-cols-7 h-16 px-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/doctor"
              ? pathname === "/doctor"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex flex-col items-center justify-center h-full py-2 px-1"
              aria-label={item.name}
            >
              <item.icon
                className={cn(
                  "h-4 w-4 mb-1",
                  isActive ? "text-purple-600" : "text-gray-500"
                )}
              />
              <span
                className={cn(
                  "text-xs font-medium leading-tight text-center",
                  isActive ? "text-purple-600" : "text-gray-500"
                )}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
