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
      ? "bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl shadow-black/30"
      : "bg-white border border-gray-200/80 rounded-2xl shadow-sm shadow-gray-200/60",

    // Scroll container
    scroll: "w-full overflow-x-auto",

    // <table>
    table: "w-full text-sm border-collapse",

    // <thead>
    thead: isDark
      ? "bg-neutral-800/60 border-b border-neutral-700/60"
      : "bg-gray-50/80 border-b border-gray-200/80",

    // <th>
    th: isDark
      ? "px-5 py-3.5 text-left text-[11px] font-semibold tracking-widest uppercase text-neutral-400 whitespace-nowrap select-none"
      : "px-5 py-3.5 text-left text-[11px] font-semibold tracking-widest uppercase text-gray-400 whitespace-nowrap select-none",

    // <tbody>
    tbody: isDark
      ? "divide-y divide-neutral-800/70"
      : "divide-y divide-gray-100",

    // <tr>
    tr: isDark
      ? "group transition-colors duration-150 hover:bg-neutral-800/40"
      : "group transition-colors duration-150 hover:bg-blue-50/40",

    // <td>
    td: isDark
      ? "px-5 py-3.5 whitespace-nowrap text-neutral-200 text-sm"
      : "px-5 py-3.5 whitespace-nowrap text-gray-800 text-sm",

    // Empty / loading shell
    shell: isDark
      ? "bg-neutral-900 border border-neutral-800 rounded-2xl"
      : "bg-white border border-gray-200/80 rounded-2xl shadow-sm",

    // Spinner ring
    spinnerRing: isDark ? "border-neutral-700" : "border-gray-200",
    spinnerAccent: isDark ? "border-t-violet-500" : "border-t-blue-500",

    // Caption text inside shell
    caption: isDark ? "text-neutral-400" : "text-gray-400",
    captionSub: isDark ? "text-neutral-600" : "text-gray-300",
  };

  /* ─── Loading skeleton ──────────────────────────────────────────────────── */
  if (isLoading) {
    return (
      <div className={`${tk.shell} overflow-hidden`}>
        {/* Fake header */}
        <div
          className={`px-5 py-3.5 border-b ${
            isDark
              ? "border-neutral-800 bg-neutral-800/60"
              : "border-gray-100 bg-gray-50/80"
          }`}
        >
          <div className="flex gap-6">
            {[120, 80, 100, 90, 60].map((w, i) => (
              <div
                key={i}
                style={{ width: w }}
                className={`h-2.5 rounded-full ${
                  isDark ? "bg-neutral-700" : "bg-gray-200"
                } animate-pulse`}
              />
            ))}
          </div>
        </div>
        {/* Fake rows */}
        {Array.from({ length: 6 }).map((_, ri) => (
          <div
            key={ri}
            className={`px-5 py-4 flex gap-6 border-b ${
              isDark ? "border-neutral-800/70" : "border-gray-100"
            }`}
            style={{ animationDelay: `${ri * 80}ms` }}
          >
            {/* Avatar placeholder */}
            <div
              className={`h-8 w-8 rounded-full shrink-0 ${
                isDark ? "bg-neutral-800" : "bg-gray-200"
              } animate-pulse`}
            />
            {[140, 70, 110, 80, 50].map((w, ci) => (
              <div
                key={ci}
                style={{ width: w }}
                className={`h-2.5 rounded-full my-auto ${
                  isDark ? "bg-neutral-800" : "bg-gray-200"
                } animate-pulse`}
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
          className={`h-14 w-14 rounded-2xl flex items-center justify-center ${
            isDark
              ? "bg-neutral-800 text-neutral-500"
              : "bg-gray-100 text-gray-400"
          }`}
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
            className={`font-semibold text-sm ${isDark ? "text-neutral-200" : "text-gray-700"}`}
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
        className={`px-5 py-3 flex items-center justify-between border-t ${
          isDark ? "border-neutral-800/70" : "border-gray-100"
        }`}
      >
        <span
          className={`text-xs ${isDark ? "text-neutral-500" : "text-gray-400"}`}
        >
          Showing{" "}
          <span
            className={`font-semibold ${isDark ? "text-neutral-300" : "text-gray-600"}`}
          >
            {data.length}
          </span>{" "}
          {data.length === 1 ? "record" : "records"}
        </span>

        {/* Subtle branding / last-updated hint slot — optional */}
        <span
          className={`text-xs ${isDark ? "text-neutral-600" : "text-gray-300"}`}
        >
          ● Live
        </span>
      </div>
    </div>
  );
};

export default Table;
