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
          className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="portal-card-inner w-full max-w-md p-8 rounded-2xl shadow-2xl border"
            style={{
              backgroundColor: "rgb(var(--color-surface-raised))",
              borderColor: "rgb(var(--color-border))",
            }}
          >
            {title && (
              <h2 className="text-2xl font-bold text-primary mb-2 text-center">
                {title}
              </h2>
            )}

            {description && (
              <p className="text-muted mb-6 text-center text-sm">{description}</p>
            )}

            <div className="relative z-10">
              {children}
            </div>

            {footer && <div className="mt-8">{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default BaseModal;
