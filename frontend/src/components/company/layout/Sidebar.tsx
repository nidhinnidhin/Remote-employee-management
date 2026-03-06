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
  Shield
} from "lucide-react";
import { SidebarProps } from "@/shared/types/company/layout/sidebar-props.type";

const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  toggleCollapse,
  isMobileOpen,
  closeMobileSidebar,
}) => {
  const pathname = usePathname();

  const menuItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: FRONTEND_ROUTES.ADMIN.DASHBOARD,
    },
    { label: "Employees", icon: Users, href: FRONTEND_ROUTES.ADMIN.EMPLOYEES },
    {
      label: "Departments & Teams",
      icon: Building2,
      href: FRONTEND_ROUTES.COMPANY.DEPARTMENTS,
    },
    { label: "Projects", icon: FolderOpen, href: FRONTEND_ROUTES.COMPANY.PROJECTS },
    { label: "Tasks", icon: CheckSquare, href: FRONTEND_ROUTES.COMPANY.TASKS },
    {
      label: "Discussion Pools",
      icon: MessageSquare,
      href: FRONTEND_ROUTES.COMPANY.DISCUSSIONS,
    },
    {
      label: "Attendance & Leave",
      icon: CalendarDays,
      href: FRONTEND_ROUTES.COMPANY.ATTENDANCE,
    },
    {
      label: "Subscription",
      icon: CreditCard,
      href: FRONTEND_ROUTES.COMPANY.SUBSCRIPTION,
    },
    {
      label: "Company Profile",
      icon: Building,
      href: FRONTEND_ROUTES.COMPANY.PROFILE,
    },
    { label: "Audit Logs", icon: FileText, href: FRONTEND_ROUTES.COMPANY.AUDIT_LOGS },
    { label: "Company policy", icon: Shield, href: FRONTEND_ROUTES.ADMIN.COMPANY_POLICY },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`sidebar fixed top-0 left-0 h-full z-50 transition-all duration-300 ease-in-out
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
          ${isCollapsed ? "lg:w-20" : "lg:w-64"}
          w-64
        `}
      >
        {/* Header */}
        <div
          className="h-16 flex items-center justify-between px-4"
          style={{ borderBottom: "1px solid rgb(var(--color-sidebar-border))" }}
        >
          {!isCollapsed && (
            <span className="sidebar-logo-text text-xl truncate">
              Workspace Admin
            </span>
          )}

          {/* Mobile Close Button */}
          <button
            onClick={closeMobileSidebar}
            className="lg:hidden p-1 transition-colors"
            style={{ color: "rgb(var(--color-sidebar-text))" }}
          >
            <X size={20} />
          </button>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={toggleCollapse}
            className="hidden lg:flex items-center justify-center w-8 h-8 rounded-full transition-colors absolute -right-3 top-20 border z-50 shadow-sm"
            style={{
              backgroundColor: "rgb(var(--color-surface-raised))",
              borderColor: "rgb(var(--color-border))",
              color: "rgb(var(--color-text-secondary))",
            }}
          >
            {isCollapsed ? (
              <ChevronRight size={14} />
            ) : (
              <ChevronLeft size={14} />
            )}
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-link flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group shadow-sm
                  ${isActive ? "active" : ""}
                `}
                title={isCollapsed ? item.label : ""}
              >
                <item.icon size={20} strokeWidth={1.5} />
                {!isCollapsed && (
                  <span className="font-medium text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
