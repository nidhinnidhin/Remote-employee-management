"use client";

import React from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-white font-sans selection:bg-blue-100 selection:text-blue-900">
      {children}
    </div>
  );
}
