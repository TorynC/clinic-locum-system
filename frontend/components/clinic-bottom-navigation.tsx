"use client";

import {
  Home,
  Calendar,
  PlusCircle,
  ClipboardList,
  User,
  Bell,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function BottomNavigation() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/clinic", icon: Home },
    { name: "Post Job", href: "/clinic/post-job", icon: PlusCircle },
    { name: "Calendar", href: "/clinic/calendar", icon: Calendar },
    { name: "Dashboard", href: "/clinic/dashboard", icon: ClipboardList },
    { name: "Profile", href: "/clinic/profile", icon: User },
    { name: "Notifications", href: "/clinic/notifications", icon: Bell },
    { name: "Log Out", href: "/", icon: LogOut },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden">
      <div className="grid grid-cols-7 h-16 px-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/clinic"
              ? pathname === "/clinic"
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
