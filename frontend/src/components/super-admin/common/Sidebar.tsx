"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FRONTEND_ROUTES } from "@/constants/frontend.routes";
import {
  Building2,
  CreditCard,
  Ticket,
} from "lucide-react";
import Image from "next/image";

export default function Sidebar() {
  const pathname = usePathname();

  const navigation = [
    {
      name: "Companies",
      href: FRONTEND_ROUTES.SUPER_ADMIN.COMPANIES,
      icon: Building2,
    },
    {
      name: "Subscription Plans",
      href: FRONTEND_ROUTES.SUPER_ADMIN.SUBSCRIPTIONS,
      icon: CreditCard,
    },
    {
      name: "Tickets",
      href: FRONTEND_ROUTES.SUPER_ADMIN.TICKETS,
      icon: Ticket,
    },
  ];

  return (
    <aside className="sidebar fixed inset-y-0 left-0 w-64 hidden lg:flex flex-col z-50 bg-[#0b0c0e]">
      {/* Brand Header */}
      <div
        className="h-20 flex items-center px-6" 
        style={{ borderBottom: "1px solid rgb(var(--color-sidebar-border))" }}
      >
        <div className="flex items-center justify-center w-full">
          <Image
            src="/images/stafflow-logo.png"
            alt="Staffflow"
            width={160}
            height={50}
            priority
            className="object-contain"
          />
        </div>
      </div>

      {/* Navigation Body */}
      <div className="flex-1 flex flex-col justify-between p-4 overflow-y-auto custom-scrollbar">
        {/* Main Menu Items (Pushed down slightly with context header for professional framing) */}
        <div className="space-y-6 pt-4">
          <div>
            <p className="px-3 text-[10px] font-bold tracking-wider text-slate-500 uppercase mb-3">
              Platform Management
            </p>
            <nav className="space-y-1.5">
              {navigation.map((item) => {
                const isActive =
                  pathname === item.href || pathname?.startsWith(`${item.href}/`);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`sidebar-link flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                      isActive ? "active text-white" : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {/* Minimalist Modern Indicator Bar */}
                    {isActive && (
                      <span className="absolute left-0 top-3 bottom-3 w-0.5 bg-indigo-500 rounded-r" />
                    )}
                    
                    <Icon 
                      size={18} 
                      strokeWidth={isActive ? 2 : 1.5} 
                      className={`transition-colors ${isActive ? "text-indigo-400" : "text-slate-400 group-hover:text-slate-300"}`}
                    />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Professional Bottom Info Footer (Balances out the 3 items visually) */}
        <div 
          className="pt-4"
          style={{ borderTop: "1px solid rgb(var(--color-sidebar-border))" }}
        >
          <div className="flex items-center gap-3 px-2 py-1.5">
            <div className="h-8 w-8 rounded-full border border-white/[0.08] flex items-center justify-center text-xs font-semibold text-slate-400">
              SA
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-slate-300 truncate">Super Admin</span>
              <span className="text-[10px] text-slate-500 truncate">Control Panel</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}