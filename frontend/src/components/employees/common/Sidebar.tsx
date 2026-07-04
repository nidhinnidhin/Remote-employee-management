"use client";

import React, { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
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
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useProfileStore } from "@/store/profile.store";
import Image from "next/image";

const navigationGroups = [
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
      {
        icon: Users2,
        label: "Department",
        href: FRONTEND_ROUTES.EMPLOYEE.TEAMS,
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
    ],
  },
  {
    title: "Growth & Policy",
    items: [
      {
        icon: ShieldCheck,
        label: "Company Policy",
        href: FRONTEND_ROUTES.EMPLOYEE.POLICY,
      },
      {
        icon: FileText,
        label: "Activity Logs",
        href: FRONTEND_ROUTES.EMPLOYEE.LOGS,
      },
    ],
  },
];

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const router = useRouter();

  // Single source of truth: isMobile derived from viewport, isOpen only matters on mobile.
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { userProfile, isLoading } = useProfileStore();

  // --- Fix 1: debounce + single listener, and always resync isOpen when switching to desktop ---
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        // Guarantees the mobile overlay can never be left mounted once we're on desktop.
        setIsOpen(false);
      }
    };

    checkMobile();

    let frame: number;
    const onResize = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(checkMobile);
    };

    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(frame);
    };
  }, []);

  // --- Fix 2: always close the mobile drawer on route change, no matter how navigation happened ---
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // --- Fix 3: centralised, memoized navigation handler so nothing stale gets captured in closures ---
  const handleNavigate = useCallback(
    (href: string) => {
      setIsOpen(false);
      router.push(href);
    },
    [router],
  );

  return (
    <>
      {/* Mobile Trigger */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="p-2 rounded-xl bg-[#08090a] border border-white/10 text-white shadow-2xl"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Fix 4: overlay only ever rendered when BOTH isOpen and isMobile are true,
          and it's removed from the tree entirely (not just visually hidden) when either flips. */}
      <AnimatePresence>
        {isOpen && isMobile && (
          <motion.div
            key="sidebar-overlay"
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
          // Fix 5: sidebar itself sits above the overlay (z-50 vs overlay's z-40), so it can
          // never end up "under" a stuck transparent layer even if state briefly desyncs.
          "fixed inset-y-0 left-0 z-50 bg-[#08090a] border-r border-white/[0.06] flex flex-col h-full lg:relative lg:translate-x-0 overflow-visible",
          className,
        )}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed((prev) => !prev)}
          className="hidden lg:flex items-center justify-center w-6 h-6 rounded-md border 
                     bg-[#08090a] border-white/10 text-slate-400 hover:text-white
                     absolute -right-3 top-20 shadow-sm z-50 transition-colors"
        >
          {isCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>

        {/* Logo Section */}
        <div className="h-16 flex items-center px-6 overflow-hidden shrink-0">
          {!isCollapsed && (
            <Image
              src="/images/stafflow-employee-logo.png"
              alt="Stafflow"
              width={200}
              height={60}
              priority
              className="transition-all duration-300 object-contain w-40 h-auto"
            />
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
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => handleNavigate(item.href)}
                    title={isCollapsed ? item.label : ""}
                    className={cn(
                      "w-full group relative flex items-center px-3 py-2 rounded-lg transition-all duration-200 text-left",
                      isActive
                        ? "bg-accent/10 text-accent"
                        : "text-slate-400 hover:text-slate-100 hover:bg-white/[0.03]",
                      isCollapsed ? "justify-center" : "justify-between",
                    )}
                  >
                    <div className="flex items-center gap-3 pointer-events-none">
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
                        key={`indicator-${item.label}`}
                        layoutId="activeIndicator"
                        className="w-1 h-4 bg-accent rounded-full"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Bottom Profile Section */}
        <div className="p-4 border-t border-white/[0.04] bg-white/[0.01] shrink-0">
          <button
            type="button"
            onClick={() => handleNavigate(FRONTEND_ROUTES.EMPLOYEE.PROFILE)}
            className="w-full text-left focus:outline-none"
          >
            <div
              className={cn(
                "flex items-center gap-3 p-2 rounded-xl hover:bg-white/[0.04] transition-colors group",
                isCollapsed && "justify-center",
              )}
            >
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white uppercase shrink-0">
                {userProfile?.firstName && userProfile?.lastName
                  ? `${userProfile.firstName[0]}${userProfile.lastName[0]}`
                  : userProfile?.firstName
                    ? userProfile.firstName[0]
                    : "JD"}
              </div>
              {!isCollapsed && (
                <>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white truncate">
                      {isLoading
                        ? "..."
                        : `${userProfile?.firstName || ""} ${userProfile?.lastName || ""}`.trim() ||
                          "Employee"}
                    </p>
                    <p className="text-[10px] text-slate-500 font-medium truncate">
                      {userProfile?.title ||
                        userProfile?.role?.replace(/_/g, " ") ||
                        "Member"}
                    </p>
                  </div>
                  <Settings2
                    size={14}
                    className="text-slate-600 group-hover:text-accent transition-colors shrink-0"
                  />
                </>
              )}
            </div>
          </button>
        </div>
      </motion.aside>
    </>
  );
}
