"use client";

import React from "react";

/**
 * Full-viewport decorative background for the onboarding page.
 * Matches the screenshot: dark base, teal glow blobs, dot grids,
 * crosshair (+) accents and abstract wireframe shapes on both sides.
 */
const OnboardingBackground: React.FC = () => {
    return (
        <div
            aria-hidden="true"
            className="absolute inset-0 z-0 overflow-hidden"
            style={{ backgroundColor: "rgb(var(--color-bg))" }}
        >
            {/* ── Large teal glow blobs ─────────────────────────── */}
            <div
                className="absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full"
                style={{
                    background:
                        "radial-gradient(circle, rgba(45,212,191,0.12) 0%, rgba(45,212,191,0.04) 50%, transparent 70%)",
                    filter: "blur(40px)",
                }}
            />
            <div
                className="absolute -bottom-32 -right-32 w-[520px] h-[520px] rounded-full"
                style={{
                    background:
                        "radial-gradient(circle, rgba(45,212,191,0.10) 0%, rgba(45,212,191,0.03) 55%, transparent 70%)",
                    filter: "blur(50px)",
                }}
            />
            {/* Secondary mid-page glow */}
            <div
                className="absolute top-1/2 left-8 -translate-y-1/2 w-56 h-56 rounded-full"
                style={{
                    background:
                        "radial-gradient(circle, rgba(45,212,191,0.08) 0%, transparent 70%)",
                    filter: "blur(30px)",
                }}
            />
            <div
                className="absolute top-1/3 right-6 w-48 h-48 rounded-full"
                style={{
                    background:
                        "radial-gradient(circle, rgba(45,212,191,0.07) 0%, transparent 70%)",
                    filter: "blur(28px)",
                }}
            />

            {/* ── Left decorative panel ─────────────────────────── */}
            <svg
                className="absolute left-0 top-0 h-full w-44 opacity-40"
                viewBox="0 0 176 900"
                fill="none"
                preserveAspectRatio="xMinYMid slice"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Dot grid */}
                {Array.from({ length: 12 }).map((_, row) =>
                    Array.from({ length: 5 }).map((_, col) => (
                        <circle
                            key={`ld-${row}-${col}`}
                            cx={18 + col * 22}
                            cy={40 + row * 72}
                            r="1.5"
                            fill="rgba(45,212,191,0.35)"
                        />
                    ))
                )}

                {/* Plus crosshairs */}
                {[{ x: 30, y: 130 }, { x: 100, y: 280 }, { x: 48, y: 480 }, { x: 130, y: 620 }, { x: 20, y: 780 }].map(
                    (pt, i) => (
                        <g key={`lp-${i}`} stroke="rgba(45,212,191,0.5)" strokeWidth="1.5" strokeLinecap="round">
                            <line x1={pt.x - 7} y1={pt.y} x2={pt.x + 7} y2={pt.y} />
                            <line x1={pt.x} y1={pt.y - 7} x2={pt.x} y2={pt.y + 7} />
                        </g>
                    )
                )}

                {/* Abstract wireframe circle (left-mid) */}
                <circle
                    cx="28"
                    cy="460"
                    r="52"
                    stroke="rgba(45,212,191,0.18)"
                    strokeWidth="1"
                    fill="none"
                />
                <circle
                    cx="28"
                    cy="460"
                    r="34"
                    stroke="rgba(45,212,191,0.12)"
                    strokeWidth="1"
                    fill="none"
                />

                {/* Bottom-left quarter-arc shape */}
                <path
                    d="M0 760 Q80 700 110 820"
                    stroke="rgba(45,212,191,0.20)"
                    strokeWidth="1.5"
                    fill="none"
                />
                <path
                    d="M -10 820 Q60 750 100 880"
                    stroke="rgba(45,212,191,0.12)"
                    strokeWidth="1"
                    fill="none"
                />

                {/* Top-left chart bars (like analytics illustration) */}
                {[
                    { x: 16, h: 28, y: 185 },
                    { x: 30, h: 48, y: 165 },
                    { x: 44, h: 36, y: 177 },
                    { x: 58, h: 55, y: 158 },
                    { x: 72, h: 22, y: 191 },
                ].map((bar, i) => (
                    <rect
                        key={`bar-${i}`}
                        x={bar.x}
                        y={bar.y}
                        width="10"
                        height={bar.h}
                        rx="2"
                        fill="rgba(45,212,191,0.15)"
                        stroke="rgba(45,212,191,0.3)"
                        strokeWidth="0.5"
                    />
                ))}
            </svg>

            {/* ── Right decorative panel ────────────────────────── */}
            <svg
                className="absolute right-0 top-0 h-full w-44 opacity-40"
                viewBox="0 0 176 900"
                fill="none"
                preserveAspectRatio="xMaxYMid slice"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Dot grid */}
                {Array.from({ length: 12 }).map((_, row) =>
                    Array.from({ length: 5 }).map((_, col) => (
                        <circle
                            key={`rd-${row}-${col}`}
                            cx={158 - col * 22}
                            cy={40 + row * 72}
                            r="1.5"
                            fill="rgba(45,212,191,0.35)"
                        />
                    ))
                )}

                {/* Plus crosshairs */}
                {[{ x: 148, y: 100 }, { x: 60, y: 250 }, { x: 130, y: 420 }, { x: 50, y: 560 }, { x: 155, y: 750 }].map(
                    (pt, i) => (
                        <g key={`rp-${i}`} stroke="rgba(45,212,191,0.5)" strokeWidth="1.5" strokeLinecap="round">
                            <line x1={pt.x - 7} y1={pt.y} x2={pt.x + 7} y2={pt.y} />
                            <line x1={pt.x} y1={pt.y - 7} x2={pt.x} y2={pt.y + 7} />
                        </g>
                    )
                )}

                {/* Three-dot ellipsis hint (top-right) */}
                {[0, 10, 20].map((offset, i) => (
                    <circle
                        key={`dot3-${i}`}
                        cx={148 + offset}
                        cy={300}
                        r="2.5"
                        fill="rgba(45,212,191,0.4)"
                    />
                ))}

                {/* Abstract wireframe circle (right-mid) */}
                <circle
                    cx="148"
                    cy="500"
                    r="55"
                    stroke="rgba(45,212,191,0.18)"
                    strokeWidth="1"
                    fill="none"
                />
                <circle
                    cx="148"
                    cy="500"
                    r="36"
                    stroke="rgba(45,212,191,0.12)"
                    strokeWidth="1"
                    fill="none"
                />

                {/* Top-right concentric arcs */}
                <path
                    d="M176 60 Q110 120 130 200"
                    stroke="rgba(45,212,191,0.18)"
                    strokeWidth="1.5"
                    fill="none"
                />
                <path
                    d="M186 80 Q100 150 125 240"
                    stroke="rgba(45,212,191,0.10)"
                    strokeWidth="1"
                    fill="none"
                />

                {/* Bottom-right quarter triangle wireframe */}
                <polygon
                    points="176,900 80,900 176,750"
                    stroke="rgba(45,212,191,0.18)"
                    strokeWidth="1"
                    fill="rgba(45,212,191,0.04)"
                />
            </svg>

            {/* ── Subtle grid overlay ───────────────────────────── */}
            <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(45,212,191,1) 1px, transparent 1px), linear-gradient(90deg, rgba(45,212,191,1) 1px, transparent 1px)",
                    backgroundSize: "60px 60px",
                }}
            />
        </div>
    );
};

export default OnboardingBackground;
