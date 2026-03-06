import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { BaseModalProps } from "@/shared/types/otp/base-modal-props.type";
import { motion, AnimatePresence } from "framer-motion";

const BaseModal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = "max-w-md",
}: BaseModalProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6"
          onClick={onClose}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`relative w-full ${maxWidth} bg-[rgb(var(--color-surface-raised))] border border-[rgb(var(--color-border))] rounded-[2rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden max-h-[90vh]`}
          >
            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-accent/20 hover:scrollbar-thumb-accent/40">
              {title && (
                <div className="mb-6 text-center">
                  <h2 className="text-2xl font-black text-primary tracking-tight font-heading">
                    {title}
                  </h2>
                  {description && (
                    <p className="text-muted mt-2 text-sm font-medium">{description}</p>
                  )}
                </div>
              )}

              <div className="relative z-10">
                {children}
              </div>
            </div>

            {/* Sticky Footer */}
            {footer && (
              <div className="p-6 border-t border-[rgb(var(--color-border-subtle))] bg-white/[0.02] backdrop-blur-xl">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default BaseModal;
