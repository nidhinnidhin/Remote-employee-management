"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function ReusablePagination({ page, totalPages, onPageChange }: PaginationProps) {
    return (
        <div className="p-4 border-t rounded-b-2xl bg-white flex justify-between items-center">
            <p className="text-sm text-gray-500">
                Page <span className="font-semibold">{page}</span> of {totalPages}
            </p>

            <div className="flex gap-2">
                <button
                    disabled={page === 1}
                    onClick={() => onPageChange(page - 1)}
                    className="p-2 border rounded-lg disabled:opacity-30"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                    disabled={page === totalPages}
                    onClick={() => onPageChange(page + 1)}
                    className="p-2 border rounded-lg disabled:opacity-30"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
