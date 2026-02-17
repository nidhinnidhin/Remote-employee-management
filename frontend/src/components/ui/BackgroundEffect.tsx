"use client";

import React from "react";

export default function BackgroundEffect() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-neutral-950" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-900/20 via-neutral-950/40 to-neutral-950" />

      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-red-600/10 blur-[100px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-red-600/10 blur-[100px] rounded-full" />


    </div>
  );
}
