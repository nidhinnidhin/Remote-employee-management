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
    <aside className="sidebar fixed inset-y-0 left-0 w-64 hidden lg:flex flex-col z-50">
      {/* Header */}
      <div
        className="h-16 flex items-center px-6"
        style={{ borderBottom: "1px solid rgb(var(--color-sidebar-border))" }}
      >
        <div className="flex items-center gap-2">
          <div
            className="p-1.5 rounded-lg"
            style={{ backgroundColor: "rgb(var(--color-accent))" }}
          >
            <span className="text-white font-bold text-lg">IH</span>
          </div>
          <span className="sidebar-logo-text text-lg">IssueHub</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href || pathname?.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`sidebar-link flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? "active" : ""
                }`}
            >
              <Icon size={20} strokeWidth={1.5} />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
