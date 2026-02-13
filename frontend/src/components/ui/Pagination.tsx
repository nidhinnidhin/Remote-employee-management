"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PaginationProps } from "@/shared/types/ui/pagination-props.type";

const Pagination: React.FC<PaginationProps & { theme?: "dark" | "light" }> = ({
    currentPage,
    totalPages,
    onPageChange,
    className = "",
    theme = "dark",
}) => {
    const themeStyles = {
        dark: {
            container: "border-neutral-800",
            text: "text-neutral-400",
            activeText: "text-white",
            button: {
                base: "text-neutral-400 ring-neutral-700 hover:bg-neutral-800",
                active: "z-10 bg-red-600 text-white focus-visible:outline-red-600 border-red-600 ring-red-600",
                disabled: "disabled:opacity-50 disabled:cursor-not-allowed",
            },
        },
        light: {
            container: "border-gray-100 bg-white",
            text: "text-gray-500",
            activeText: "text-gray-900",
            button: {
                base: "text-gray-500 ring-gray-100 hover:bg-gray-50 hover:text-pink-500",
                active: "z-10 bg-pink-500 text-white focus-visible:outline-pink-500 ring-pink-500",
                disabled: "disabled:opacity-40 disabled:cursor-not-allowed text-gray-300",
            },
        },
    };

    const styles = themeStyles[theme];

    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first, last, and current page with surrounding
            if (currentPage <= 3) {
                pages.push(1, 2, 3, 4, "...", totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
            }
        }
        return pages;
    };

    if (totalPages <= 1) return null;

    return (
        <div className={`flex items-center justify-between border-t px-4 py-3 sm:px-6 ${styles.container} ${className}`}>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                    <p className={`text-sm ${styles.text}`}>
                        Showing page <span className={`font-medium ${styles.activeText}`}>{currentPage}</span> of{" "}
                        <span className={`font-medium ${styles.activeText}`}>{totalPages}</span>
                    </p>
                </div>
                <div>
                    <nav
                        className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                        aria-label="Pagination"
                    >
                        <button
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`relative inline-flex items-center rounded-l-md px-2 py-2 ring-1 ring-inset focus:z-20 focus:outline-offset-0 transition-colors ${styles.button.base} ${styles.button.disabled}`}
                        >
                            <span className="sr-only">Previous</span>
                            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                        </button>
                        {getPageNumbers().map((page, index) =>
                            typeof page === "number" ? (
                                <button
                                    key={index}
                                    onClick={() => onPageChange(page)}
                                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 focus:outline-offset-0 ring-1 ring-inset transition-colors ${currentPage === page
                                        ? styles.button.active
                                        : styles.button.base
                                        }`}
                                >
                                    {page}
                                </button>
                            ) : (
                                <span
                                    key={index}
                                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset focus:outline-offset-0 ${styles.button.base} ring-opacity-50`}
                                >
                                    ...
                                </span>
                            )
                        )}
                        <button
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`relative inline-flex items-center rounded-r-md px-2 py-2 ring-1 ring-inset focus:z-20 focus:outline-offset-0 transition-colors ${styles.button.base} ${styles.button.disabled}`}
                        >
                            <span className="sr-only">Next</span>
                            <ChevronRight className="h-4 w-4" aria-hidden="true" />
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default Pagination;
