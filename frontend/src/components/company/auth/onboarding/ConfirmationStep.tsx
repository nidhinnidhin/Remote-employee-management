"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Rocket, ShieldCheck } from "lucide-react";

const ConfirmationStep: React.FC = () => {
    return (
        <div className="space-y-8 flex flex-col items-center py-12">
            <div className="text-center">
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", damping: 15, stiffness: 200, delay: 0.2 }}
                    className="w-24 h-24 bg-accent/10 rounded-[2.5rem] flex items-center justify-center mb-10 mx-auto shadow-inner"
                >
                    <Rocket className="w-12 h-12 text-accent" />
                </motion.div>
                <h2 className="text-4xl font-black text-primary tracking-tight mb-4">Almost There!</h2>
                <p className="text-secondary text-lg max-w-md mx-auto leading-relaxed">
                    Your workspace is ready to be created. Click the button below to activate your account and access your dashboard.
                </p>
            </div>

            <div className="w-full max-w-sm grid grid-cols-1 gap-4 mt-8">
                <div className="flex items-center gap-4 p-5 rounded-3xl bg-bg-card border border-border-subtle shadow-sm">
                    <div className="p-3 rounded-2xl bg-accent/10">
                        <ShieldCheck className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-primary uppercase tracking-wider">Secure Access</p>
                        <p className="text-xs text-secondary mt-0.5">Your data is protected with 256-bit encryption</p>
                    </div>
                </div>
            </div>

            <p className="text-xs text-muted text-center mt-12 italic">
                By activating, you agree to our Terms and Conditions
            </p>
        </div>
    );
};

export default ConfirmationStep;
