"use client";

import React from "react";
import { motion } from "framer-motion";
import { Rocket, ShieldCheck, CheckCircle2 } from "lucide-react";

const ConfirmationStep: React.FC = () => {
    return (
        <div className="flex flex-col items-center text-center py-4">
            {/* Animated icon */}
            <motion.div
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", damping: 14, stiffness: 180, delay: 0.1 }}
                className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
                style={{ backgroundColor: "rgb(var(--color-accent-subtle))" }}
            >
                <Rocket className="w-10 h-10" style={{ color: "rgb(var(--color-accent))" }} />
            </motion.div>

            <h2 className="text-2xl font-bold mb-2" style={{ color: "rgb(var(--color-text-primary))" }}>
                Almost There!
            </h2>
            <p className="text-sm leading-relaxed mb-8 max-w-xs" style={{ color: "rgb(var(--color-text-secondary))" }}>
                Your workspace is ready to be created. Click the button below to activate your account and access your dashboard.
            </p>

            {/* Summary checklist */}
            <div className="w-full space-y-3">
                {[
                    { icon: CheckCircle2, label: "Organization details saved" },
                    { icon: CheckCircle2, label: "Subscription plan selected" },
                    { icon: ShieldCheck, label: "256-bit encryption enabled" },
                ].map(({ icon: Icon, label }) => (
                    <div
                        key={label}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl"
                        style={{
                            backgroundColor: "rgb(var(--color-surface-raised))",
                            border: "1px solid rgb(var(--color-border-subtle))",
                        }}
                    >
                        <Icon className="w-4 h-4 flex-shrink-0" style={{ color: "rgb(var(--color-accent))" }} />
                        <span className="text-sm text-left" style={{ color: "rgb(var(--color-text-secondary))" }}>
                            {label}
                        </span>
                    </div>
                ))}
            </div>

            <p className="text-xs mt-6" style={{ color: "rgb(var(--color-text-muted))" }}>
                By activating, you agree to our Terms and Conditions
            </p>
        </div>
    );
};

export default ConfirmationStep;
