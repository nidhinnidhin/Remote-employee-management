"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
    X
} from "lucide-react";

interface SidebarProps {
    isCollapsed: boolean;
    toggleCollapse: () => void;
    isMobileOpen: boolean;
    closeMobileSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
    isCollapsed,
    toggleCollapse,
    isMobileOpen,
    closeMobileSidebar,
}) => {
    const pathname = usePathname();

    const menuItems = [
        { label: "Dashboard", icon: LayoutDashboard, href: "/company-admin/dashboard" },
        { label: "Employees", icon: Users, href: "/company-admin/employees" },
        { label: "Departments & Teams", icon: Building2, href: "/company-admin/departments" },
        { label: "Projects", icon: FolderOpen, href: "/company-admin/projects" },
        { label: "Tasks", icon: CheckSquare, href: "/company-admin/tasks" },
        { label: "Discussion Pools", icon: MessageSquare, href: "/company-admin/discussions" },
        { label: "Attendance & Leave", icon: CalendarDays, href: "/company-admin/attendance" },
        { label: "Subscription", icon: CreditCard, href: "/company-admin/subscription" },
        { label: "Company Profile", icon: Building, href: "/company-admin/profile" },
        { label: "Audit Logs", icon: FileText, href: "/company-admin/audit-logs" },
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
                className={`fixed top-0 left-0 h-full z-50 bg-neutral-900 border-r border-neutral-800 transition-all duration-300 ease-in-out
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
          ${isCollapsed ? "lg:w-20" : "lg:w-64"}
          w-64
        `}
            >
                {/* Header */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-neutral-800/50">
                    {!isCollapsed && (
                        <span className="text-xl font-bold text-white truncate">
                            Workspace Admin
                        </span>
                    )}
                    {/* Mobile Close Button */}
                    <button
                        onClick={closeMobileSidebar}
                        className="lg:hidden p-1 text-neutral-400 hover:text-white"
                    >
                        <X size={20} />
                    </button>

                    {/* Desktop Collapse Toggle */}
                    <button
                        onClick={toggleCollapse}
                        className="hidden lg:flex items-center justify-center w-8 h-8 rounded-full bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700 transition-colors absolute -right-3 top-20 border border-neutral-700 shadow-sm z-50"
                    >
                        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
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
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group
                  ${isActive
                                        ? "bg-red-500/10 text-red-500"
                                        : "text-neutral-400 hover:bg-neutral-800 hover:text-white"}
                `}
                                title={isCollapsed ? item.label : ""}
                            >
                                <div className={`${isActive ? "text-red-500" : "text-neutral-400 group-hover:text-white"}`}>
                                    <item.icon size={20} strokeWidth={1.5} />
                                </div>

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
