"use client";

import React from "react";
import BackLink from "./BackLink";
import AuthHeader from "./AuthHeader";

export default function AuthRightPanel({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full lg:w-[60%] flex flex-col justify-center items-center p-6 lg:p-24 bg-white relative">
      <BackLink />

      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700">
        <AuthHeader />
        {children}
      </div>

      <div className="mt-12 text-center text-xs text-slate-400">
        © 2024 Remote Employee Management. All rights reserved.
      </div>
    </div>
  );
}
