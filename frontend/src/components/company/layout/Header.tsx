"use client";

import React from "react";
import { Menu, Bell, Search } from "lucide-react";
import { HeaderProps } from "@/shared/types/company/layout/header-props.type";
import { UserNav } from "@/components/common/UserNav";

const Header: React.FC<HeaderProps> = ({ onMobileMenuDatas }) => {
  return (
    <header
      className="top-nav sticky top-0 z-40 flex h-16 items-center px-4 sm:px-6 lg:px-8 border-b border-white/[0.05] backdrop-blur-md"
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

          {/* User Profile */}
          <div className="pl-4 border-l border-white/10">
            <UserNav theme="theme-company" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
