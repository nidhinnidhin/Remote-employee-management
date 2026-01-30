"use client";

import { BaseModalProps } from "@/types/otp/base-modal-props.type";
import { motion, AnimatePresence } from "framer-motion";

const BaseModal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
}: BaseModalProps) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center"
        onClick={onClose}
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
          className="bg-neutral-900 w-full max-w-md p-8 rounded-lg border border-neutral-700"
        >
          {title && (
            <h2 className="text-2xl font-bold text-white mb-2 text-center">
              {title}
            </h2>
          )}

          {description && (
            <p className="text-neutral-400 mb-6 text-center">{description}</p>
          )}
          {children}

          {footer && <div className="mt-6">{footer}</div>}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default BaseModal;
