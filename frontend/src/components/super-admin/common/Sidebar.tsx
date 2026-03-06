"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FRONTEND_ROUTES } from "@/constants/frontend.routes";
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
      href: FRONTEND_ROUTES.SUPER_ADMIN.DASHBOARD,
      icon: LayoutDashboard,
    },
    { name: "Companies", href: FRONTEND_ROUTES.SUPER_ADMIN.COMPANIES, icon: Building2 },
    {
      name: "Subscription Plans",
      href: FRONTEND_ROUTES.SUPER_ADMIN.SUBSCRIPTIONS,
      icon: CreditCard,
    },
    { name: "Global Users", href: FRONTEND_ROUTES.SUPER_ADMIN.USERS, icon: Users },
    {
      name: "Billing & Payments",
      href: FRONTEND_ROUTES.SUPER_ADMIN.BILLING,
      icon: Receipt,
    },
    {
      name: "Support Tickets",
      href: FRONTEND_ROUTES.SUPER_ADMIN.SUPPORT,
      icon: MessageSquare,
    },
    {
      name: "Platform Settings",
      href: FRONTEND_ROUTES.SUPER_ADMIN.SETTINGS,
      icon: Settings,
    },
    { name: "System Logs", href: FRONTEND_ROUTES.SUPER_ADMIN.LOGS, icon: FileText },
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
