"use client";

import { TableProps } from "@/shared/types/ui/table-props.type";
import React from "react";

const Table = <T,>({
  data,
  columns,
  keyExtractor,
  isLoading = false,
  emptyMessage = "No data available",
  theme = "dark",
}: TableProps<T> & { theme?: "dark" | "light" }) => {
  const isDark = theme === "dark";

  /* ─── Token map ─────────────────────────────────────────────────────────── */
  const tk = {
    // Wrapper
    wrapper: isDark
      ? "bg-[rgb(var(--color-nav-bg))] border border-[rgb(var(--color-border-subtle))] rounded-2xl shadow-xl shadow-black/30"
      : "bg-[rgb(var(--color-nav-bg))] border border-[rgb(var(--color-border-subtle))] rounded-2xl shadow-sm shadow-gray-200/60",

    // Scroll container
    scroll: "w-full overflow-x-auto",

    // <table>
    table: "w-full text-sm border-collapse",

    // <thead>
    thead: isDark
      ? "bg-[rgb(var(--color-bg-subtle))] border-b border-[rgb(var(--color-border-subtle))]"
      : "bg-[rgb(var(--color-bg-subtle))] border-b border-[rgb(var(--color-border-subtle))]",

    // <th>
    th: "px-5 py-3.5 text-left text-[11px] font-semibold tracking-widest uppercase text-muted whitespace-nowrap select-none",

    // <tbody>
    tbody: "divide-y divide-[rgb(var(--color-border-subtle))]/50",

    // <tr>
    tr: "group transition-colors duration-150 hover:bg-[rgb(var(--color-bg-subtle))]/40",

    // <td>
    td: "px-5 py-3.5 whitespace-nowrap text-secondary text-sm group-hover:text-primary",

    // Empty / loading shell
    shell: "bg-[rgb(var(--color-nav-bg))] border border-[rgb(var(--color-border-subtle))] rounded-2xl shadow-sm",

    // Spinner ring
    spinnerRing: "border-[rgb(var(--color-border-subtle))]",
    spinnerAccent: "border-t-[rgb(var(--color-accent))]",

    // Caption text inside shell
    caption: "text-muted",
    captionSub: "text-muted/60",
  };

  /* ─── Loading skeleton ──────────────────────────────────────────────────── */
  if (isLoading) {
    return (
      <div className={`${tk.shell} overflow-hidden`}>
        {/* Fake header */}
        <div
          className={`px-5 py-3.5 border-b border-[rgb(var(--color-border-subtle))] bg-[rgb(var(--color-bg-subtle))]/60`}
        >
          <div className="flex gap-6">
            {[120, 80, 100, 90, 60].map((w, i) => (
              <div
                key={i}
                style={{ width: w }}
                className={`h-2.5 rounded-full bg-[rgb(var(--color-border-subtle))] animate-pulse`}
              />
            ))}
          </div>
        </div>
        {/* Fake rows */}
        {Array.from({ length: 6 }).map((_, ri) => (
          <div
            key={ri}
            className={`px-5 py-4 flex gap-6 border-b border-[rgb(var(--color-border-subtle))]/50`}
            style={{ animationDelay: `${ri * 80}ms` }}
          >
            {/* Avatar placeholder */}
            <div
              className={`h-8 w-8 rounded-full shrink-0 bg-[rgb(var(--color-bg-subtle))] animate-pulse`}
            />
            {[140, 70, 110, 80, 50].map((w, ci) => (
              <div
                key={ci}
                style={{ width: w }}
                className={`h-2.5 rounded-full my-auto bg-[rgb(var(--color-bg-subtle))] animate-pulse`}
              />
            ))}
          </div>
        ))}
        {/* Spinner overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 pointer-events-none">
          <div
            className={`h-9 w-9 rounded-full border-2 ${tk.spinnerRing} ${tk.spinnerAccent} animate-spin`}
          />
          <span className={`text-xs font-medium tracking-wide ${tk.caption}`}>
            Loading data…
          </span>
        </div>
        {/* Relative wrapper for overlay */}
        <style>{`.relative-shell { position: relative; }`}</style>
      </div>
    );
  }

  /* ─── Empty state ───────────────────────────────────────────────────────── */
  if (!data || data.length === 0) {
    return (
      <div
        className={`${tk.shell} flex flex-col items-center justify-center py-20 gap-4`}
      >
        {/* Illustration */}
        <div
          className={`h-14 w-14 rounded-2xl flex items-center justify-center bg-[rgb(var(--color-bg-subtle))] text-muted`}
        >
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="3" />
            <path d="M3 9h18M9 21V9" />
          </svg>
        </div>
        <div className="text-center">
          <p
            className={`font-semibold text-sm text-primary`}
          >
            {emptyMessage}
          </p>
          <p className={`text-xs mt-1 ${tk.captionSub}`}>
            There are no records to display right now.
          </p>
        </div>
      </div>
    );
  }

  /* ─── Table ─────────────────────────────────────────────────────────────── */
  return (
    <div className={tk.wrapper}>
      <div className={tk.scroll}>
        <table className={tk.table}>
          <thead className={tk.thead}>
            <tr>
              {columns.map((col, i) => (
                <th
                  key={i}
                  scope="col"
                  className={`${tk.th} ${col.className ?? ""}`}
                >
                  <span className="flex items-center gap-1.5">
                    {col.header}
                  </span>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className={tk.tbody}>
            {data.map((item) => (
              <tr key={keyExtractor(item)} className={tk.tr}>
                {columns.map((col, ci) => (
                  <td key={ci} className={`${tk.td} ${col.className ?? ""}`}>
                    {typeof col.accessor === "function"
                      ? col.accessor(item)
                      : (item[col.accessor] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer row count */}
      <div
        className={`px-5 py-3 flex items-center justify-between border-t border-[rgb(var(--color-border-subtle))]/50`}
      >
        <span
          className={`text-xs text-muted/60`}
        >
          Showing{" "}
          <span
            className={`font-semibold text-muted`}
          >
            {data.length}
          </span>{" "}
          {data.length === 1 ? "record" : "records"}
        </span>

        {/* Subtle branding / last-updated hint slot — optional */}
        <span
          className={`text-xs text-muted/40`}
        >
          ● Live
        </span>
      </div>
    </div>
  );
};

export default Table;
