import { clientApi } from "@/lib/axios/axiosClient";
import { CompanyRow } from "@/shared/types/superadmin/companies/companiesColumns";
import React from "react";

export const RowActions = ({
  row,
  onStatusChange
}: {
  row: CompanyRow,
  onStatusChange?: () => void
}) => {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [position, setPosition] = React.useState({
    top: 0,
    left: 0,
    openUp: false,
  });
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const DROPDOWN_WIDTH = 192;
  const DROPDOWN_HEIGHT = 112;
  const OFFSET = 6;

  const toggleMenu = () => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceRight = window.innerWidth - rect.left;
    const openUp = spaceBelow < DROPDOWN_HEIGHT + OFFSET;

    const top = openUp
      ? rect.top - DROPDOWN_HEIGHT - OFFSET
      : rect.bottom + OFFSET;

    const left =
      spaceRight < DROPDOWN_WIDTH ? rect.right - DROPDOWN_WIDTH : rect.left;

    setPosition({ top, left, openUp });
    setOpen((prev) => !prev);
  };

  const handleToggleStatus = async () => {
    const newStatus = row.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    setLoading(true);
    try {
      await clientApi.patch(`/super-admin/companies/${row.id}/status`, {
        status: newStatus,
      });
      alert(`Company status updated to ${newStatus} successfully`);
      if (onStatusChange) onStatusChange();
    } catch (error) {
      console.error("Failed to update status", error);
      alert("Failed to update company status. Please try again.");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  // Close on outside click
  React.useEffect(() => {
    if (!open) return;
    const handleOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open]);

  // Close on scroll or resize
  React.useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, []);

  return (
    <>
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        aria-label="Row actions"
        aria-expanded={open}
        aria-haspopup="menu"
        disabled={loading}
        className={`
          relative flex items-center justify-center w-8 h-8 rounded-md
          text-gray-400 hover:text-gray-600
          hover:bg-gray-100 active:bg-gray-200
          transition-colors duration-150
          focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1
          ${open ? "bg-gray-100 text-gray-600" : ""}
          ${loading ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        {/* Vertical three-dot icon */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="pointer-events-none"
        >
          <circle cx="8" cy="3" r="1.5" />
          <circle cx="8" cy="8" r="1.5" />
          <circle cx="8" cy="13" r="1.5" />
        </svg>
      </button>

      {open && (
        <div
          ref={dropdownRef}
          role="menu"
          aria-label="Row actions menu"
          style={{
            position: "fixed",
            top: position.top,
            left: position.left,
            width: DROPDOWN_WIDTH,
            transformOrigin: position.openUp ? "bottom center" : "top center",
            animation: "dropdownEnter 0.15s ease forwards",
          }}
          className="bg-white border border-gray-200 rounded-xl shadow-lg z-[9999] overflow-hidden py-1"
        >
          <style>{`
            @keyframes dropdownEnter {
              from { opacity: 0; transform: scale(0.95) translateY(${position.openUp ? "4px" : "-4px"}); }
              to   { opacity: 1; transform: scale(1)    translateY(0); }
            }
          `}</style>

          <button
            role="menuitem"
            onClick={() => {
              console.log("View details", row.id);
              setOpen(false);
            }}
            className="
              w-full flex items-center gap-2.5 px-3.5 py-2.5
              text-sm font-medium text-gray-700
              hover:bg-gray-50 active:bg-gray-100
              transition-colors duration-100
            "
          >
            {/* Eye icon */}
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-400 shrink-0"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            View Details
          </button>

          <div className="mx-3 my-1 border-t border-gray-100" />

          <button
            role="menuitem"
            onClick={handleToggleStatus}
            disabled={loading}
            className={`
              w-full flex items-center gap-2.5 px-3.5 py-2.5
              text-sm font-medium
              ${row.status === "ACTIVE" ? "text-red-600 hover:bg-red-50 active:bg-red-100" : "text-green-600 hover:bg-green-50 active:bg-green-100"}
              transition-colors duration-100
              ${loading ? "opacity-50" : ""}
            `}
          >
            {/* Ban/suspend or Check icon */}
            {row.status === "ACTIVE" ? (
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
              </svg>
            ) : (
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            )}
            {row.status === "ACTIVE" ? "Suspend Company" : "Activate Company"}
          </button>
        </div>
      )}
    </>
  );
};
