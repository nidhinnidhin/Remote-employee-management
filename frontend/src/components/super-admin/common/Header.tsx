"use client";

import React from "react";
import Image from "next/image";
import { UserNav } from "@/components/common/UserNav";
import { Bell } from "lucide-react";

export const Header: React.FC = () => {
  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-8 border-border-subtle bg-bg/50 backdrop-blur-md sticky top-0 z-30">
      <div className="flex items-center md:hidden">
        <Image
          src="/images/stafflow-logo.png"
          alt="Stafflow"
          width={200}
          height={60}
          priority
          className="w-32 h-auto object-contain"
        />
      </div>

      <div className="flex-1 flex justify-end items-center gap-4">
        <button className="p-2 text-muted hover:text-accent transition-colors relative">
          <Bell size={20} strokeWidth={1.5} />
        </button>

        <div className="pl-4 border-l border-border-subtle">
          <UserNav
            userEmail="admin@issuehub.com"
            userName="Super Admin"
            theme="theme-super"
          />
        </div>
      </div>
    </header>
  );
};
