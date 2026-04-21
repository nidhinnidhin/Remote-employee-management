"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FRONTEND_ROUTES } from "@/constants/frontend.routes";
import {
  LayoutDashboard,
  Users,
  Building2,
  FolderOpen,
  CheckSquare,
  MessageSquare,
  CalendarDays,
  CreditCard,
  Building,
  FileText,
  ChevronLeft,
  ChevronRight,
  X,
  Shield,
  Settings2
} from "lucide-react";
import { SidebarProps } from "@/shared/types/company/layout/sidebar-props.type";
import { cn } from "@/lib/utils";

// Reference-style grouping for the Admin Sidebar
const navigationGroups = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, href: FRONTEND_ROUTES.ADMIN.DASHBOARD },
      { label: "Employees", icon: Users, href: FRONTEND_ROUTES.ADMIN.EMPLOYEES },
    ],
  },
  {
    title: "Management",
    items: [
      { label: "Departments", icon: Building2, href: FRONTEND_ROUTES.COMPANY.DEPARTMENTS },
      { label: "Projects", icon: FolderOpen, href: FRONTEND_ROUTES.COMPANY.PROJECTS },
      { label: "Tasks", icon: CheckSquare, href: FRONTEND_ROUTES.COMPANY.TASKS },
    ],
  },
  {
    title: "Communication",
    items: [
      { label: "Discussion Pools", icon: MessageSquare, href: FRONTEND_ROUTES.COMPANY.DISCUSSIONS },
      { label: "Attendance & Leave", icon: CalendarDays, href: FRONTEND_ROUTES.COMPANY.ATTENDANCE },
    ],
  },
  {
    title: "Organization",
    items: [
      { label: "Subscription", icon: CreditCard, href: FRONTEND_ROUTES.COMPANY.SUBSCRIPTION },
      { label: "Company Profile", icon: Building, href: FRONTEND_ROUTES.COMPANY.PROFILE },
      { label: "Audit Logs", icon: FileText, href: FRONTEND_ROUTES.COMPANY.AUDIT_LOGS },
      { label: "Company Policy", icon: Shield, href: FRONTEND_ROUTES.ADMIN.COMPANY_POLICY },
    ],
  },
];

const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  toggleCollapse,
  isMobileOpen,
  closeMobileSidebar,
}) => {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          "sidebar fixed top-0 left-0 h-full z-50 transition-all duration-300 ease-in-out flex flex-col",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0",
          isCollapsed ? "lg:w-20" : "lg:w-64",
          "w-64"
        )}
      >
        {/* Header - Aligned with Reference */}
        <div
          className="h-16 flex items-center justify-between px-6 border-b"
          style={{ borderBottomColor: "rgb(var(--color-sidebar-border) / 0.1)" }}
        >
          <div className="flex items-center min-w-0">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20">
              <Building2 size={18} className="text-white" strokeWidth={2.5} />
            </div>
            {!isCollapsed && (
              <span className="ml-3 font-black text-sm tracking-tighter uppercase truncate text-sidebar-text">
                Workspace <span className="opacity-60">Admin</span>
              </span>
            )}
          </div>

          {/* Mobile Close */}
          <button onClick={closeMobileSidebar} className="lg:hidden p-1 text-sidebar-text/60">
            <X size={20} />
          </button>
        </div>

        {/* Desktop Collapse Toggle - Float style from reference */}
        {/* Desktop Collapse Toggle */}
<button
  onClick={toggleCollapse}
  className={cn(
    "hidden lg:flex items-center justify-center absolute -right-3 top-12 z-[60]",
    "w-6 h-6 rounded-full border border-white/10 transition-all duration-300 group",
    "bg-[#08090a] shadow-[0_0_10px_rgba(0,0,0,0.5)] hover:shadow-indigo-500/20",
    "hover:scale-110 hover:border-indigo-500/50"
  )}
>
  <div className={cn(
    "transition-colors",
    isCollapsed ? "text-indigo-500" : "text-slate-500 group-hover:text-white"
  )}>
    {isCollapsed ? <ChevronRight size={12} strokeWidth={3} /> : <ChevronLeft size={12} strokeWidth={3} />}
  </div>
</button>

        {/* Navigation - Grouped & Aligned */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-7 custom-scrollbar">
          {navigationGroups.map((group) => (
            <div key={group.title} className="space-y-1">
              {!isCollapsed && (
                <h4 className="px-3 text-[10px] font-black uppercase tracking-[0.15em] opacity-40 mb-2">
                  {group.title}
                </h4>
              )}

              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "sidebar-link group flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200",
                      isActive ? "active font-bold" : "opacity-70 hover:opacity-100"
                    )}
                    title={isCollapsed ? item.label : ""}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon 
                        size={18} 
                        strokeWidth={isActive ? 2.5 : 1.5} 
                        className={cn(isActive ? "text-indigo-500" : "text-sidebar-text/60")}
                      />
                      {!isCollapsed && (
                        <span className="text-[13px] tracking-tight whitespace-nowrap overflow-hidden">
                          {item.label}
                        </span>
                      )}
                    </div>
                    
                    {/* Active Indicator (Reference Style) */}
                    {!isCollapsed && isActive && (
                      <div className="w-1 h-4 bg-indigo-500 rounded-full" />
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Bottom Profile Section - SaaS Classic */}
        <div className="p-4 border-t" style={{ borderTopColor: "rgb(var(--color-sidebar-border) / 0.1)" }}>
           <div className={cn(
             "flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer",
             isCollapsed && "justify-center"
           )}>
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-700 uppercase shrink-0">
                AD
              </div>
              {!isCollapsed && (
                <>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold truncate">Admin User</p>
                    <p className="text-[10px] opacity-50 truncate font-medium">Company Manager</p>
                  </div>
                  <Settings2 size={14} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                </>
              )}
           </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;