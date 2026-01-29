"use client";

import React from "react";
import { Menu, Bell, Search } from "lucide-react";
import { HeaderProps } from "@/types/company/layout/header-props.type";

const Header: React.FC<HeaderProps> = ({ onMobileMenuDatas }) => {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-md px-4 sm:px-6 lg:px-8">
      {/* Mobile Menu Button */}
      <button
        type="button"
        className="-m-2.5 p-2.5 text-neutral-400 lg:hidden hover:text-white"
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
              className="bg-neutral-900 border border-neutral-800 rounded-lg pl-3 pr-10 py-1.5 text-sm text-white focus:outline-none focus:border-red-500 transition-colors w-64"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 w-4 h-4" />
          </div>

          {/* Notifications */}
          <button className="-m-2.5 p-2.5 text-neutral-400 hover:text-white relative">
            <span className="sr-only">View notifications</span>
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-600 border border-neutral-900"></span>
          </button>

          {/* User Profile */}
          <div className="pl-4 border-l border-neutral-800">
            <div className="h-8 w-8 rounded-full bg-red-600 flex items-center justify-center text-white text-xs font-bold ring-2 ring-neutral-800 cursor-pointer">
              CA
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
