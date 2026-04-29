"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FRONTEND_ROUTES } from "@/constants/frontend.routes";
import {
  LayoutGrid,
  Fingerprint,
  CalendarOff,
  CheckCircle2,
  FolderKanban,
  Users2,
  MessageSquareText,
  Megaphone,
  Search,
  Heart,
  LineChart,
  Settings2,
  MessagesSquare,
  ShieldCheck,
  Menu,
  X,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useProfileStore } from "@/store/profile.store";

const navigationGroups = [
// ... (rest of the file)
  {
    title: "Overview",
    items: [
      {
        icon: LayoutGrid,
        label: "Dashboard",
        href: FRONTEND_ROUTES.EMPLOYEE.DASHBOARD,
      },
      {
        icon: CheckCircle2,
        label: "Tasks",
        href: FRONTEND_ROUTES.EMPLOYEE.TASKS,
      },
      {
        icon: FolderKanban,
        label: "Projects",
        href: FRONTEND_ROUTES.EMPLOYEE.PROJECTS,
      },
    ],
  },
  {
    title: "Organization",
    items: [
      {
        icon: Fingerprint,
        label: "Attendance",
        href: FRONTEND_ROUTES.EMPLOYEE.ATTENDANCE,
      },
      {
        icon: CalendarOff,
        label: "Leaves",
        href: FRONTEND_ROUTES.EMPLOYEE.LEAVES,
      },
      { icon: Users2, label: "Department", href: FRONTEND_ROUTES.EMPLOYEE.TEAMS },
      {
        icon: Search,
        label: "Directory",
        href: FRONTEND_ROUTES.EMPLOYEE.DIRECTORY,
      },
    ],
  },
  {
    title: "Communication",
    items: [
      {
        icon: MessagesSquare,
        label: "Chats",
        href: FRONTEND_ROUTES.EMPLOYEE.CHATS,
      },
      {
        icon: MessageSquareText,
        label: "Discussions",
        href: FRONTEND_ROUTES.EMPLOYEE.DISCUSSIONS,
      },
      {
        icon: Megaphone,
        label: "Announcements",
        href: FRONTEND_ROUTES.EMPLOYEE.ANNOUNCEMENTS,
      },
    ],
  },
  {
    title: "Growth & Policy",
    items: [
      {
        icon: LineChart,
        label: "Performance",
        href: FRONTEND_ROUTES.EMPLOYEE.PERFORMANCE,
      },
      { icon: Heart, label: "Mood Check", href: FRONTEND_ROUTES.EMPLOYEE.MOOD },
      {
        icon: ShieldCheck,
        label: "Company Policy",
        href: FRONTEND_ROUTES.EMPLOYEE.POLICY,
      },
    ],
  },
];

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false); // Mobile Drawer State
  const [isCollapsed, setIsCollapsed] = useState(false); // Desktop Collapse State
  const [isMobile, setIsMobile] = useState(false);
  const { userProfile, isLoading } = useProfileStore();

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setIsOpen(false);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <>
      {/* Mobile Trigger */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-xl bg-[#08090a] border border-white/10 text-white shadow-2xl"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{
          x: isMobile ? (isOpen ? 0 : "-100%") : 0,
          width: isMobile ? "256px" : isCollapsed ? "80px" : "256px",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={cn(
          "fixed inset-y-0 left-0 z-40 bg-[#08090a] border-r border-white/[0.06] flex flex-col h-full lg:relative lg:translate-x-0 overflow-visible",
          className,
        )}
      >
        {/* Toggle Button - Integrated Functionality */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex items-center justify-center w-6 h-6 rounded-md border 
                     bg-[#08090a] border-white/10 text-slate-400 hover:text-white
                     absolute -right-3 top-20 shadow-sm z-50 transition-colors"
        >
          {isCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>

        {/* Logo Section */}
        <div className="h-16 flex items-center px-6 border-b border-white/[0.04] overflow-hidden shrink-0">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center mr-3 shrink-0">
            <LayoutGrid size={18} className="text-white" strokeWidth={2.5} />
          </div>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-black text-sm tracking-tighter text-white uppercase whitespace-nowrap"
            >
              Nexus <span className="text-accent">Portal</span>
            </motion.span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-6 px-3 space-y-8 custom-scrollbar">
          {navigationGroups.map((group) => (
            <div key={group.title} className="space-y-1">
              {!isCollapsed && (
                <h4 className="px-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3 whitespace-nowrap">
                  {group.title}
                </h4>
              )}

              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => isMobile && setIsOpen(false)}
                    title={isCollapsed ? item.label : ""}
                  >
                    <div
                      className={cn(
                        "group relative flex items-center px-3 py-2 rounded-lg transition-all duration-200",
                        isActive
                          ? "bg-accent/10 text-accent"
                          : "text-slate-400 hover:text-slate-100 hover:bg-white/[0.03]",
                        isCollapsed ? "justify-center" : "justify-between",
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon
                          size={18}
                          strokeWidth={isActive ? 2 : 1.5}
                          className={cn(
                            isActive
                              ? "text-accent"
                              : "text-slate-500 group-hover:text-slate-300",
                          )}
                        />
                        {!isCollapsed && (
                          <span className="text-[13px] font-bold tracking-tight whitespace-nowrap">
                            {item.label}
                          </span>
                        )}
                      </div>

                      {isActive && !isCollapsed && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="w-1 h-4 bg-accent rounded-full"
                        />
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Bottom Profile Section */}
        <div className="p-4 border-t border-white/[0.04] bg-white/[0.01] shrink-0">
          <Link href={FRONTEND_ROUTES.EMPLOYEE.PROFILE}>
            <div
              className={cn(
                "flex items-center gap-3 p-2 rounded-xl hover:bg-white/[0.04] transition-colors group",
                isCollapsed && "justify-center",
              )}
            >
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white uppercase shrink-0">
                {userProfile?.firstName && userProfile?.lastName 
                  ? `${userProfile.firstName[0]}${userProfile.lastName[0]}` 
                  : userProfile?.firstName ? userProfile.firstName[0] : "JD"}
              </div>
              {!isCollapsed && (
                <>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white truncate">
                      {isLoading ? "..." : `${userProfile?.firstName || ""} ${userProfile?.lastName || ""}`.trim() || "Employee"}
                    </p>
                    <p className="text-[10px] text-slate-500 font-medium truncate">
                      {userProfile?.title || userProfile?.role?.replace(/_/g, " ") || "Member"}
                    </p>
                  </div>
                  <Settings2
                    size={14}
                    className="text-slate-600 group-hover:text-accent transition-colors shrink-0"
                  />
                </>
              )}
            </div>
          </Link>
        </div>
      </motion.aside>
    </>
  );
}
