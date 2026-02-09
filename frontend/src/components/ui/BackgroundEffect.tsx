"use client";

import React from "react";

export default function BackgroundEffect() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-neutral-950" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-900/20 via-neutral-950/40 to-neutral-950" />

      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-red-600/10 blur-[100px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-red-600/10 blur-[100px] rounded-full" />

      {/* <svg
        className="w-full h-full opacity-40"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      > */}
        <defs>
          <radialGradient id="fade-center" cx="50" cy="50" r="50">
            <stop offset="0%" stopColor="black" stopOpacity="0" />
            <stop offset="100%" stopColor="black" stopOpacity="1" />
          </radialGradient>
        </defs>

        <g className="stroke-white/20" strokeWidth="1">
          <circle cx="85" cy="20" r="2" className="fill-red-500" />
          <circle cx="90" cy="15" r="2" className="fill-red-500" />
          <circle cx="92" cy="25" r="2" className="fill-red-500" />
          <circle cx="80" cy="10" r="2" className="fill-red-500" />

          <path d="M 85 20 L 90 15 L 92 25 L 85 20" fill="none" />
          <path d="M 90 15 L 80 10 L 85 20" fill="none" />
          <path d="M 92 25 L 95 40" fill="none" />
        </g>

        <g className="stroke-white/20" strokeWidth="1">
          <circle cx="10" cy="70" r="2" className="fill-red-500" />
          <circle cx="15" cy="75" r="2" className="fill-red-500" />
          <circle cx="5" cy="80" r="2" className="fill-red-500" />
          <circle cx="12" cy="60" r="2" className="fill-red-500" />

          <path d="M 10 70 L 15 75 L 5 80 L 10 70" fill="none" />
          <path d="M 10 70 L 12 60" fill="none" />
        </g>

        <path
          d="M 0 10 Q 50 50 100 90"
          fill="none"
          stroke="url(#fade-center)"
          strokeWidth="0.5"
          className="opacity-10"
        />
      {/* </svg> */}
    </div>
  );
}
