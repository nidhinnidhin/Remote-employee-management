"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  Building2,
  Briefcase,
  UserCheck,
  Clock,
  CalendarDays,
  Home,
  ShieldCheck,
  Lock,
  TrendingUp,
  GraduationCap,
  Github,
  HeartHandshake,
  Scale,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export const POLICY_TABS = [
  { id: "overview", label: "Overview", icon: Building2 },
  { id: "employment", label: "Employment", icon: Briefcase },
  { id: "conduct", label: "Conduct", icon: UserCheck },
  { id: "working-hours", label: "Hours", icon: Clock },
  { id: "leave-policy", label: "Leave", icon: CalendarDays },
  { id: "remote-work", label: "Remote", icon: Home },
  { id: "it-security", label: "Security", icon: ShieldCheck },
  { id: "data-privacy", label: "Privacy", icon: Lock },
  { id: "performance", label: "Growth", icon: TrendingUp },
  { id: "learning", label: "Learning", icon: GraduationCap },
  { id: "open-source", label: "OSS", icon: Github },
  { id: "anti-harassment", label: "Safety", icon: HeartHandshake },
  { id: "disciplinary", label: "Legal", icon: Scale },
  { id: "exit", label: "Exit", icon: LogOut },
];

interface PolicyTabsProps {
  activeTab: string;
  onTabChange: (id: string) => void;
}

export function PolicyTabs({ activeTab, onTabChange }: PolicyTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // Check if scrolling is possible to toggle arrow visibility
  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const node = scrollRef.current;
    if (node) {
      node.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
      checkScroll();
    }
    return () => {
      node?.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount =
        direction === "left" ? -clientWidth / 2 : clientWidth / 2;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full relative group flex items-center">
      {/* Left Slider Button */}
      <AnimatePresence>
        {showLeftArrow && (
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            onClick={() => scroll("left")}
            className="absolute left-0 z-30 w-10 h-10 flex items-center justify-center bg-surface/90 border border-white/10 rounded-xl backdrop-blur-md text-slate-400 hover:text-accent shadow-xl"
          >
            <ChevronLeft size={18} strokeWidth={2.5} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Main Track */}
      <div
        ref={scrollRef}
        className={cn(
          "flex items-center gap-1 p-1.5 bg-surface/40 backdrop-blur-md border border-white/[0.06] rounded-2xl overflow-x-auto scroll-smooth w-full",
          " [&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none]",
        )}
      >
        {POLICY_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "relative flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all duration-300 outline-none shrink-0",
                isActive
                  ? "text-accent"
                  : "text-slate-500 hover:text-slate-300",
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activePolicyIndicator"
                  className="absolute inset-0 bg-accent/[0.08] border border-accent/20 rounded-xl shadow-[0_0_15px_rgba(var(--color-accent),0.05)]"
                  transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                />
              )}

              <tab.icon
                size={14}
                strokeWidth={isActive ? 2.5 : 2}
                className="relative z-10"
              />
              <span className="relative z-10 text-[10px] font-black uppercase tracking-[0.1em] whitespace-nowrap">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Right Slider Button */}
      <AnimatePresence>
        {showRightArrow && (
          <motion.button
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            onClick={() => scroll("right")}
            className="absolute right-0 z-30 w-10 h-10 flex items-center justify-center bg-surface/90 border border-white/10 rounded-xl backdrop-blur-md text-slate-400 hover:text-accent shadow-xl"
          >
            <ChevronRight size={18} strokeWidth={2.5} />
          </motion.button>
        )}
      </AnimatePresence>
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-bg to-transparent pointer-events-none z-10 rounded-l-2xl opacity-60" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-bg to-transparent pointer-events-none z-10 rounded-r-2xl opacity-60" />
    </div>
  );
}
