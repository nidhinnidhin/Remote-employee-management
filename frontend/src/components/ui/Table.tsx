"use client";

import React from "react";

export interface Column<T> {
    header: string;
    accessor: keyof T | ((item: T) => React.ReactNode);
    className?: string;
}

export interface TableProps<T> {
    data: T[];
    columns: Column<T>[];
    keyExtractor: (item: T) => string | number;
    isLoading?: boolean;
    emptyMessage?: string;
}

const Table = <T,>({
    data,
    columns,
    keyExtractor,
    isLoading = false,
    emptyMessage = "No data available",
}: TableProps<T>) => {
    if (isLoading) {
        return (
            <div className="w-full h-64 flex items-center justify-center bg-neutral-900/50 rounded-lg border border-neutral-800">
                <div className="flex flex-col items-center gap-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                    <span className="text-neutral-400 text-sm">Loading data...</span>
                </div>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="w-full h-64 flex items-center justify-center bg-neutral-900/50 rounded-lg border border-neutral-800">
                <p className="text-neutral-400">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="w-full overflow-x-auto rounded-lg border border-neutral-800 bg-neutral-900/50">
            <table className="w-full text-left text-sm">
                <thead className="bg-neutral-800/50 text-neutral-400 uppercase text-xs font-medium">
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
                <tbody className="divide-y divide-neutral-800">
                    {data.map((item, rowIndex) => (
                        <tr
                            key={keyExtractor(item)}
                            className="hover:bg-neutral-800/30 transition-colors"
                        >
                            {columns.map((col, colIndex) => (
                                <td
                                    key={colIndex}
                                    className={`px-6 py-4 whitespace-nowrap text-neutral-200 ${col.className || ""
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
