"use client";

import { TableProps } from "@/shared/types/ui/table-props.type";
import React from "react";

const Table = <T,>({
  data,
  columns,
  keyExtractor,
  isLoading = false,
  emptyMessage = "No data available",
  theme = "dark", // Default to dark for backward compatibility
}: TableProps<T> & { theme?: "dark" | "light" }) => {
  const themeStyles = {
    dark: {
      container: "border-neutral-800 bg-neutral-900/50",
      header: "bg-neutral-800/50 text-neutral-400",
      row: "hover:bg-neutral-800/30",
      text: "text-neutral-200",
      divider: "divide-neutral-800",
      loading: "bg-neutral-900/50 border-neutral-800",
    },
    light: {
      container: "border-gray-100 bg-white shadow-sm",
      header: "bg-gray-50/30 text-gray-400 font-medium",
      row: "hover:bg-gray-50/50 border-b border-gray-50",
      text: "text-gray-900",
      divider: "divide-gray-50",
      loading: "bg-white border-gray-100",
    },
  };

  const styles = themeStyles[theme];

  if (isLoading) {
    return (
      <div
        className={`w-full h-64 flex items-center justify-center rounded-lg border ${styles.loading}`}
      >
        <div className="flex flex-col items-center gap-2">
          <div
            className={`animate-spin rounded-full h-8 w-8 border-b-2 ${theme === "dark" ? "border-red-600" : "border-purple-600"}`}
          ></div>
          <span
            className={`${theme === "dark" ? "text-neutral-400" : "text-purple-500"} text-sm`}
          >
            Loading data...
          </span>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div
        className={`w-full h-64 flex items-center justify-center rounded-lg border ${styles.loading}`}
      >
        <p
          className={`${theme === "dark" ? "text-neutral-400" : "text-gray-400"}`}
        >
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div
      className={`w-full overflow-x-auto rounded-lg border ${styles.container}`}
    >
      <table className="w-full text-left text-sm">
        <thead className={`${styles.header} text-xs`}>
          <tr>
            {columns.map((col, index) => (
              <th
                key={index}
                scope="col"
                className={`px-6 py-4 ${col.className || ""}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={`divide-y ${styles.divider}`}>
          {data.map((item, rowIndex) => (
            <tr
              key={keyExtractor(item)}
              className={`${styles.row} transition-colors`}
            >
              {columns.map((col, colIndex) => (
                <td
                  key={colIndex}
                  className={`px-6 py-4 whitespace-nowrap ${styles.text} ${
                    col.className || ""
                  }`}
                >
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
  );
};

export default Table;
