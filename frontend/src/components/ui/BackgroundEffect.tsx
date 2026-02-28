"use client";

import React from "react";

export default function BackgroundEffect() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 portal-page" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[rgb(var(--color-accent-subtle))]/20 via-portal-page/40 to-portal-page" />

      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[rgb(var(--color-accent))]/10 blur-[100px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-[rgb(var(--color-accent))]/10 blur-[100px] rounded-full" />


    </div>
  );
}
