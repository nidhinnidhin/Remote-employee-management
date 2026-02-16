"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  CreditCard,
  Users,
  Receipt,
  MessageSquare,
  Settings,
  FileText,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const navigation = [
    {
      name: "Dashboard",
      href: "/super-admin/dashboard",
      icon: LayoutDashboard,
    },
    { name: "Companies", href: "/super-admin/companies", icon: Building2 },
    {
      name: "Subscription Plans",
      href: "/super-admin/subscriptions",
      icon: CreditCard,
    },
    { name: "Global Users", href: "/super-admin/users", icon: Users },
    {
      name: "Billing & Payments",
      href: "/super-admin/billing",
      icon: Receipt,
    },
    {
      name: "Support Tickets",
      href: "/super-admin/support",
      icon: MessageSquare,
    },
    {
      name: "Platform Settings",
      href: "/super-admin/settings",
      icon: Settings,
    },
    { name: "System Logs", href: "/super-admin/logs", icon: FileText },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-100 hidden lg:flex flex-col z-50">
      {/* Header */}
      <div className="h-16 flex items-center px-6 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="bg-purple-600 p-1.5 rounded-lg">
            <span className="text-white font-bold text-lg">IH</span>
          </div>
          <span className="text-gray-900 font-bold text-lg">IssueHub</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href || pathname?.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-purple-50 text-purple-700"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon
                className={`w-5 h-5 ${
                  isActive
                    ? "text-purple-600"
                    : "text-gray-400 group-hover:text-gray-500"
                }`}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User Info / Footer */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xs">
            SA
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Super Admin</p>
            <p className="text-xs text-gray-500">admin@issuehub.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
