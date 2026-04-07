"use client";

import React, { useState, useRef, useEffect } from "react";
import { LogOut, User, ChevronDown, Settings } from "lucide-react";
import { LogoutConfirmationModal } from "./modals/LogoutConfirmationModal";
import { logoutAction } from "@/actions/auth/logout.action";
import { motion, AnimatePresence } from "framer-motion";

interface UserNavProps {
  userEmail?: string;
  userName?: string;
  avatarUrl?: string;
}

export const UserNav: React.FC<UserNavProps> = ({
  userEmail,
  userName,
  avatarUrl,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutAction();
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
      setIsLogoutModalOpen(false);
    }
  };

  const initials = userName
    ? userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : userEmail
      ? userEmail[0].toUpperCase()
      : "U";

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-2 p-1 rounded-full hover:bg-white/5 transition-colors group"
      >
        <div className="h-9 w-9 rounded-full overflow-hidden flex items-center justify-center text-sm font-bold ring-2 ring-white/10 group-hover:ring-accent/50 transition-all bg-accent text-btn-primary-text">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={userName}
              className="w-full h-full object-cover"
            />
          ) : (
            initials
          )}
        </div>
        <ChevronDown
          size={16}
          className={`text-muted transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-56 rounded-2xl bg-surface-raised border border-border shadow-dropdown overflow-hidden z-50 glass-dropdown"
          >
            <div className="p-4  bg-white/5">
              <p className="text-sm font-semibold text-primary truncate">
                {userName || "User Profile"}
              </p>
              <p className="text-xs text-muted truncate mt-0.5">
                {userEmail || "Signed in"}
              </p>
            </div>

            <div className="p-2  border-border-subtle">
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  setIsLogoutModalOpen(true);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-danger hover:bg-danger/10 rounded-lg transition-colors"
              >
                <LogOut size={16} />
                <span>Log out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <LogoutConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
        loading={isLoggingOut}
      />
    </div>
  );
};
