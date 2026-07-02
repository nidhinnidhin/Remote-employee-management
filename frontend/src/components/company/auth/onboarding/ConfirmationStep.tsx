"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    Rocket, Building2, Mail, Users, Globe, Briefcase,
    CheckCircle2, ShieldCheck, Crown, Tag, Check
} from "lucide-react";
import type { SubscriptionPlan } from "@/shared/types/superadmin/subscription/subscription.type";

interface ConfirmationStepProps {
    company: {
        id: string;
        name: string;
        email: string;
        size: string;
        industry: string;
        website: string;
    };
    plan: SubscriptionPlan | null;
    planName: string;
    user: {
        firstName: string;
        lastName: string;
        email: string;
    };
}

const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div
        className="w-full rounded-2xl p-5 mb-4"
        style={{
            backgroundColor: "rgb(var(--color-surface-raised))",
            border: "1px solid rgb(var(--color-border-subtle))",
        }}
    >
        <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 rounded-lg" style={{ backgroundColor: "rgb(var(--color-accent-subtle))" }}>
                <div style={{ color: "rgb(var(--color-accent))" }}>{icon}</div>
            </div>
            <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: "rgb(var(--color-text-primary))" }}>
                {title}
            </h3>
        </div>
        {children}
    </div>
);

const DetailRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="flex justify-between items-start py-2 border-b last:border-b-0" style={{ borderColor: "rgb(var(--color-border-subtle))" }}>
        <span className="text-xs font-medium" style={{ color: "rgb(var(--color-text-muted))" }}>{label}</span>
        <span className="text-xs font-semibold text-right max-w-[55%] break-words" style={{ color: "rgb(var(--color-text-primary))" }}>{value || "—"}</span>
    </div>
);

const ConfirmationStep: React.FC<ConfirmationStepProps> = ({ company, plan, planName, user }) => {
    return (
        <div className="flex flex-col items-center py-2 w-full">
            {/* Animated header icon */}
            <motion.div
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", damping: 14, stiffness: 180, delay: 0.1 }}
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                style={{ backgroundColor: "rgb(var(--color-accent-subtle))" }}
            >
                <Rocket className="w-8 h-8" style={{ color: "rgb(var(--color-accent))" }} />
            </motion.div>

            <h2 className="text-2xl font-bold mb-1 text-center" style={{ color: "rgb(var(--color-text-primary))" }}>
                Review &amp; Activate
            </h2>
            <p className="text-sm mb-6 text-center max-w-sm" style={{ color: "rgb(var(--color-text-secondary))" }}>
                Verify the details below. Once you activate, your workspace will be live.
            </p>

            {/* ── Company Details ─────────────────────────────────────── */}
            <Section title="Company Details" icon={<Building2 className="w-4 h-4" />}>
                <DetailRow label="Company Name" value={company.name} />
                <DetailRow label="Business Email" value={company.email} />
                <DetailRow label="Team Size" value={company.size} />
                <DetailRow label="Industry" value={company.industry} />
                {company.website && (
                    <DetailRow label="Website" value={company.website} />
                )}
            </Section>

            {/* ── User Admin Details ──────────────────────────────────── */}
            <Section title="Administrator Details" icon={<Users className="w-4 h-4" />}>
                <DetailRow label="Admin Name" value={`${user.firstName} ${user.lastName}`.trim()} />
                <DetailRow label="Admin Email" value={user.email} />
            </Section>

            {/* ── Subscription Plan ────────────────────────────────────── */}
            <Section title="Subscription Plan" icon={<Crown className="w-4 h-4" />}>
                <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                        <Tag className="w-3.5 h-3.5" style={{ color: "rgb(var(--color-accent))" }} />
                        <span className="text-sm font-bold" style={{ color: "rgb(var(--color-text-primary))" }}>
                            {plan?.name || planName || "—"}
                        </span>
                    </div>
                    <span
                        className="text-sm font-black"
                        style={{ color: "rgb(var(--color-accent))" }}
                    >
                        {plan ? (plan.price === 0 ? "Free" : `₹${plan.price}/mo`) : "—"}
                    </span>
                </div>

                {plan?.description && (
                    <p className="text-xs mb-3" style={{ color: "rgb(var(--color-text-muted))" }}>
                        {plan.description}
                    </p>
                )}

                {plan?.features && plan.features.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t" style={{ borderColor: "rgb(var(--color-border-subtle))" }}>
                        <p className="text-[10px] uppercase font-bold tracking-wider mb-2" style={{ color: "rgb(var(--color-text-muted))" }}>
                            Included features
                        </p>
                        {plan.features.map((feat, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                                    style={{ backgroundColor: "rgb(var(--color-accent-subtle))" }}>
                                    <Check className="w-2.5 h-2.5" style={{ color: "rgb(var(--color-accent))" }} strokeWidth={3} />
                                </div>
                                <span className="text-xs" style={{ color: "rgb(var(--color-text-secondary))" }}>{feat}</span>
                            </div>
                        ))}
                    </div>
                )}

                {plan && (
                    <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t" style={{ borderColor: "rgb(var(--color-border-subtle))" }}>
                        <div className="text-center p-2 rounded-xl" style={{ backgroundColor: "rgb(var(--color-bg))" }}>
                            <p className="text-xs font-bold" style={{ color: "rgb(var(--color-accent))" }}>{plan.maxProjects}</p>
                            <p className="text-[10px]" style={{ color: "rgb(var(--color-text-muted))" }}>Projects</p>
                        </div>
                        <div className="text-center p-2 rounded-xl" style={{ backgroundColor: "rgb(var(--color-bg))" }}>
                            <p className="text-xs font-bold" style={{ color: "rgb(var(--color-accent))" }}>{plan.maxMembers}</p>
                            <p className="text-[10px]" style={{ color: "rgb(var(--color-text-muted))" }}>Members</p>
                        </div>
                    </div>
                )}
            </Section>

            {/* ── Security Guarantee ───────────────────────────────────── */}
            <div
                className="w-full rounded-2xl px-5 py-4 flex items-center gap-3 mb-4"
                style={{
                    backgroundColor: "rgba(var(--color-accent), 0.06)",
                    border: "1px solid rgba(var(--color-accent), 0.15)",
                }}
            >
                <ShieldCheck className="w-5 h-5 flex-shrink-0" style={{ color: "rgb(var(--color-accent))" }} />
                <p className="text-xs leading-relaxed" style={{ color: "rgb(var(--color-text-secondary))" }}>
                    Your data is protected with <strong>256-bit AES encryption</strong> and enterprise-grade security.
                </p>
            </div>

            <p className="text-[11px] text-center" style={{ color: "rgb(var(--color-text-muted))" }}>
                By activating, you agree to our Terms &amp; Conditions and Privacy Policy.
            </p>
        </div>
    );
};

export default ConfirmationStep;
