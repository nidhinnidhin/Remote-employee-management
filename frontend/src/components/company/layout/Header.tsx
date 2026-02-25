"use client";

import React from "react";
import { Menu, Bell, Search } from "lucide-react";
import { HeaderProps } from "@/shared/types/company/layout/header-props.type";

const Header: React.FC<HeaderProps> = ({ onMobileMenuDatas }) => {
  return (
    <header
      className="top-nav sticky top-0 z-40 flex h-16 items-center px-4 sm:px-6 lg:px-8 backdrop-blur-md"
      style={{ backdropFilter: "blur(12px)" }}
    >
      {/* Mobile Menu Button */}
      <button
        type="button"
        className="-m-2.5 p-2.5 lg:hidden transition-colors"
        style={{ color: "rgb(var(--color-text-secondary))" }}
        onClick={onMobileMenuDatas}
      >
        <span className="sr-only">Open sidebar</span>
        <Menu size={24} />
      </button>

      {/* Spacer / Search */}
      <div className="flex-1 flex justify-end gap-x-4 lg:gap-x-6">
        <div className="flex items-center gap-x-4">
          {/* Search */}
          <div className="hidden sm:block relative">
            <input
              type="text"
              placeholder="Search..."
              className="field-input w-64 pl-3 pr-10 py-1.5 text-sm"
            />
            <Search
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: "rgb(var(--color-text-muted))" }}
            />
          </div>

          {/* Notifications */}
          <button
            className="-m-2.5 p-2.5 relative transition-colors"
            style={{ color: "rgb(var(--color-text-secondary))" }}
          >
            <span className="sr-only">View notifications</span>
            <Bell size={20} />
            <span
              className="absolute top-2 right-2 w-2 h-2 rounded-full border"
              style={{
                backgroundColor: "rgb(var(--color-danger))",
                borderColor: "rgb(var(--color-nav-bg))",
              }}
            />
          </button>

          {/* User Profile */}
          <div
            className="pl-4"
            style={{ borderLeft: "1px solid rgb(var(--color-border-subtle))" }}
          >
            <div
              className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ring-2 ring-white cursor-pointer"
              style={{
                backgroundColor: "rgb(var(--color-accent))",
                color: "rgb(var(--color-btn-primary-text))",
              }}
            >
              CA
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
