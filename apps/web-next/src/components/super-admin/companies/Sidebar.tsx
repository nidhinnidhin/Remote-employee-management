"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  CreditCard,
  Users,
  Wallet,
  MessageSquare,
  Settings,
  FileText,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    // { label: "Dashboard", icon: LayoutDashboard, href: "/super-admin/dashboard" },
    {
      label: "Companies",
      icon: Building2,
      href: "/super-admin/companies-listing",
    },
    // { label: "Subscription Plans", icon: CreditCard, href: "/super-admin/subscription-plans" },
    // { label: "Global Users", icon: Users, href: "/super-admin/users" },
    // { label: "Billing & Payments", icon: Wallet, href: "/super-admin/billing" },
    // { label: "Support Tickets", icon: MessageSquare, href: "/super-admin/support" },
    // { label: "Platform Settings", icon: Settings, href: "/super-admin/settings" },
    // { label: "System Logs", icon: FileText, href: "/super-admin/logs" },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-100 h-screen fixed top-0 left-0 flex flex-col z-50">
      <div className="h-16 flex items-center px-6 border-b border-gray-50">
        <span className="text-xl font-bold text-violet-600">Super Admin</span>
        <span className="text-xl font-bold text-gray-400 ml-1">Panel</span>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                isActive
                  ? "bg-violet-50 text-violet-600"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <item.icon
                className={`w-5 h-5 ${
                  isActive ? "text-violet-600" : "text-gray-400"
                }`}
              />
              {item.label}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
