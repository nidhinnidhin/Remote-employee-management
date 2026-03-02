"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FRONTEND_ROUTES } from "@/constants/frontend.routes";
import {
  LayoutGrid,
  UserCircle,
  Fingerprint,
  CalendarOff,
  CheckCircle2,
  FolderKanban,
  Users2,
  MessageSquareText,
  CalendarDays,
  Megaphone,
  Search,
  Heart,
  LineChart,
  BarChart4,
  Settings2,
  MessagesSquare,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: LayoutGrid, label: "Dashboard", href: FRONTEND_ROUTES.EMPLOYEE.DASHBOARD },
  { icon: UserCircle, label: "My Profile", href: FRONTEND_ROUTES.EMPLOYEE.PROFILE },
  { icon: Fingerprint, label: "Attendance", href: FRONTEND_ROUTES.EMPLOYEE.ATTENDANCE },
  { icon: CalendarOff, label: "Leave Management", href: FRONTEND_ROUTES.EMPLOYEE.LEAVES },
  { icon: CheckCircle2, label: "Tasks", href: FRONTEND_ROUTES.EMPLOYEE.TASKS },
  { icon: FolderKanban, label: "Projects", href: FRONTEND_ROUTES.EMPLOYEE.PROJECTS },
  { icon: Users2, label: "Teams", href: FRONTEND_ROUTES.EMPLOYEE.TEAMS },
  { icon: MessageSquareText, label: "Discussion Pools", href: FRONTEND_ROUTES.EMPLOYEE.DISCUSSIONS },
  { icon: CalendarDays, label: "Calendar", href: FRONTEND_ROUTES.EMPLOYEE.CALENDAR },
  { icon: Megaphone, label: "Announcements", href: FRONTEND_ROUTES.EMPLOYEE.ANNOUNCEMENTS },
  { icon: Search, label: "Employee Directory", href: FRONTEND_ROUTES.EMPLOYEE.DIRECTORY },
  { icon: Heart, label: "Mood Check-in", href: FRONTEND_ROUTES.EMPLOYEE.MOOD },
  { icon: LineChart, label: "Performance", href: FRONTEND_ROUTES.EMPLOYEE.PERFORMANCE },
  { icon: BarChart4, label: "Reports", href: FRONTEND_ROUTES.EMPLOYEE.REPORTS },
  { icon: Settings2, label: "Settings", href: FRONTEND_ROUTES.EMPLOYEE.SETTINGS },
  { icon: MessagesSquare, label: "All chats", href: FRONTEND_ROUTES.EMPLOYEE.CHATS },
  { icon: ShieldCheck, label: "Company policy", href: FRONTEND_ROUTES.EMPLOYEE.POLICY },
];

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg shadow-md border"
          style={{
            backgroundColor: "rgb(var(--color-surface))",
            borderColor: "rgb(var(--color-border-subtle))",
            color: "rgb(var(--color-accent))",
          }}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Backdrop for mobile */}
      <AnimatePresence>
        {isOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 backdrop-blur-sm z-40 lg:hidden"
            style={{ backgroundColor: "rgba(0,0,0,0.2)" }}
          />
        )}
      </AnimatePresence>

      {/* Sidebar Content */}
      <motion.aside
        initial={false}
        animate={{ x: isMobile ? (isOpen ? 0 : "-100%") : 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className={cn(
          "sidebar fixed inset-y-0 left-0 z-40 w-64 flex flex-col h-full lg:relative lg:translate-x-0 transition-none",
          className,
        )}
      >
        <div className="p-6">
          <h1
            className="text-xl font-bold flex items-center gap-2 tracking-tight sidebar-logo-text"
          >
            Employee management
          </h1>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 pb-4 space-y-0.5 custom-scrollbar">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.label} href={item.href}>
                <div
                  className={cn(
                    "relative group flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
                    isActive ? "text-white" : "sidebar-link",
                  )}
                >
                  {/* Active background highlight */}
                  {isActive && (
                    <motion.div
                      layoutId="sidebarHighlight"
                      className="absolute inset-0 rounded-lg -z-10 shadow-sm"
                      style={{ backgroundColor: "rgb(var(--color-accent))" }}
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}

                  <item.icon
                    size={18}
                    strokeWidth={1.5}
                    className={cn(
                      "shrink-0",
                      isActive
                        ? "text-white"
                        : "transition-colors",
                    )}
                    style={
                      !isActive
                        ? { color: "rgb(var(--color-text-muted))" }
                        : undefined
                    }
                  />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </motion.aside>
    </>
  );
}
