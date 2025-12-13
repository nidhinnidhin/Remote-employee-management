"use client";

import { useState } from "react";
import { MoreVertical } from "lucide-react";

export interface TableColumn<T> {
    key: string;                // property key
    label: string;              // table header label
    className?: string;         // optional styling
    render?: (row: T) => React.ReactNode; // custom cell renderer
}

interface FlexibleTableProps<T> {
    columns: TableColumn<T>[];
    data: T[];
    actions?: (row: T) => React.ReactNode; // action menu support
}

export default function ReusableTable<T extends { id: number }>({
    columns,
    data,
    actions
}: FlexibleTableProps<T>) {

    const [activeMenu, setActiveMenu] = useState<number | null>(null);

    const toggleMenu = (id: number) => {
        setActiveMenu(activeMenu === id ? null : id);
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left">

                {/* DYNAMIC TABLE HEAD */}
                <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                        {columns.map(col => (
                            <th
                                key={col.key}
                                className={`px-6 py-4 text-xs font-semibold text-gray-500 uppercase ${col.className || ""}`}
                            >
                                {col.label}
                            </th>
                        ))}
                        {actions && (
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">
                                Actions
                            </th>
                        )}
                    </tr>
                </thead>

                {/* DYNAMIC TABLE BODY */}
                <tbody className="divide-y divide-gray-100">
                    {data.map(row => (
                        <tr key={row.id} className="hover:bg-gray-50 transition">

                            {columns.map(col => (
                                <td key={col.key} className="px-6 py-4">
                                    {col.render ? col.render(row) : (row as any)[col.key]}
                                </td>
                            ))}

                            {actions && (
                                <td className="px-6 py-4 text-right relative">
                                    <button
                                        onClick={() => toggleMenu(row.id)}
                                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"
                                    >
                                        <MoreVertical className="w-4 h-4" />
                                    </button>

                                    {activeMenu === row.id && (
                                        <div className="absolute right-0 top-10 w-44 bg-white shadow-lg border rounded-xl z-20 py-1">
                                            {actions(row)}
                                        </div>
                                    )}
                                </td>
                            )}

                        </tr>
                    ))}
                </tbody>

            </table>
        </div>
    );
}
