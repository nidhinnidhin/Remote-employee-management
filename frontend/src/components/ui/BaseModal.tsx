"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { BaseModalProps } from "@/shared/types/otp/base-modal-props.type";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface EnhancedModalProps extends BaseModalProps {
  theme?: "theme-employee" | "theme-company" | "theme-super";
}

const BaseModal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = "max-w-md",
  theme = "theme-employee", // Default fallback
}: EnhancedModalProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          className={cn(
            "fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6",
            theme,
          )}
          onClick={onClose}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={cn(
              "relative w-full flex flex-col overflow-hidden max-h-[90vh]",
              "bg-[rgb(var(--color-modal-bg))] border border-[rgb(var(--color-modal-border))] rounded-[1rem]",
              "shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)]",
              maxWidth,
              theme,
            )}
          >
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              {title && (
                <div className="mb-8 text-center">
                  <h2 className="text-2xl font-black text-white tracking-tighter uppercase">
                    {title}
                  </h2>
                  {description && (
                    <p className="text-slate-400 mt-2 text-sm font-medium max-w-[85%] mx-auto leading-relaxed">
                      {description}
                    </p>
                  )}
                </div>
              )}

              <div className="relative z-10 text-white">{children}</div>
            </div>

            {footer && (
              <div className="p-6 border-t border-white/[0.06] bg-white/[0.02] backdrop-blur-xl">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
};

export default BaseModal;
