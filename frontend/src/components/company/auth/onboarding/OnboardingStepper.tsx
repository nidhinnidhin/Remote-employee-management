"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import CompanyOnboardingStep from "./CompanyOnboardingStep";
import SubscriptionStep from "./SubscriptionStep";
import ConfirmationStep from "./ConfirmationStep";
import { onboardAction } from "@/actions/auth/onboard.action";
import { ArrowRight, ArrowLeft, Check, Loader2, Rocket } from "lucide-react";

const steps = [
    { title: "Organization", number: 1 },
    { title: "Subscription", number: 2 },
    { title: "Confirmation", number: 3 },
];

const OnboardingStepper: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const [onboardingUserId, setOnboardingUserId] = useState<string | null>(null);

    React.useEffect(() => {
        const userIdFromUrl = searchParams.get("userId");
        const userIdFromStorage = localStorage.getItem("registration_user_id");

        if (userIdFromUrl) {
            localStorage.setItem("registration_user_id", userIdFromUrl);
            setOnboardingUserId(userIdFromUrl);
        } else if (userIdFromStorage) {
            setOnboardingUserId(userIdFromStorage);
        }
    }, [searchParams]);

    const [onboardingData, setOnboardingData] = useState({
        company: {
            name: "",
            email: "",
            size: "",
            industry: "",
            website: "",
        },
        subscription: {
            plan: "Professional",
        }
    });

    const [errors, setErrors] = useState<any>({});

    const handleCompanyChange = (e: any) => {
        const { name, value } = e.target;
        setOnboardingData(prev => ({
            ...prev,
            company: { ...prev.company, [name]: value }
        }));
        if (errors[name]) {
            setErrors((prev: any) => ({ ...prev, [name]: "" }));
        }
    };

    const handleSubscriptionChange = (plan: string) => {
        setOnboardingData(prev => ({
            ...prev,
            subscription: { ...prev.subscription, plan }
        }));
    };

    const validateStep = (step: number) => {
        const newErrors: any = {};
        if (step === 1) {
            if (!onboardingData.company.name) newErrors.name = "Company name is required";
            if (!onboardingData.company.email) {
                newErrors.email = "Company email is required";
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(onboardingData.company.email)) {
                newErrors.email = "Please enter a valid email address";
            }
            if (!onboardingData.company.size) newErrors.size = "Please select employee size";
            if (!onboardingData.company.industry) newErrors.industry = "Please select industry";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = async () => {
        if (!validateStep(currentStep)) return;

        if (currentStep < 3) {
            setCurrentStep(prev => prev + 1);
        } else {
            const userId = onboardingUserId || localStorage.getItem("registration_user_id");

            if (!userId) {
                setErrors({ form: "Registration session expired. Please sign up again." });
                return;
            }

            setIsLoading(true);
            try {
                const result = await onboardAction({
                    ...onboardingData,
                    userId
                });

                if (result.success) {
                    localStorage.removeItem("registration_user_id");
                    router.replace("/admin/dashboard");
                } else {
                    // If the error is about company email already taken, surface it
                    // as an inline field error on step 1
                    const errMsg = result.error || "";
                    const isEmailConflict =
                        errMsg.toLowerCase().includes("company") ||
                        errMsg.toLowerCase().includes("email") ||
                        errMsg.toLowerCase().includes("exist") ||
                        errMsg.toLowerCase().includes("taken") ||
                        errMsg.toLowerCase().includes("already");

                    if (isEmailConflict) {
                        setErrors({ email: "This company email is already registered. Please use a different email." });
                        setCurrentStep(1); // Navigate back to company info step
                    } else {
                        setErrors({ form: errMsg });
                    }
                }
            } catch (err) {
                setErrors({ form: "Something went wrong during setup" });
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleBack = () => {
        if (currentStep > 1) setCurrentStep(prev => prev - 1);
    };

    return (
        <div className="w-full max-w-2xl mx-auto py-6 px-4 flex flex-col">

            {/* ── Step Indicator ────────────────────────────────── */}
            <div className="flex items-center w-full mb-8 px-2">
                {steps.map((step, i) => {
                    const isCompleted = currentStep > step.number;
                    const isActive = currentStep === step.number;

                    return (
                        <React.Fragment key={step.number}>
                            {/* Circle + label */}
                            <div className="flex flex-col items-center gap-2">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 text-sm font-semibold
                                        ${isCompleted
                                            ? "bg-accent border-accent text-white"
                                            : isActive
                                                ? "border-accent text-accent bg-transparent"
                                                : "border-border text-muted bg-transparent"
                                        }`}
                                    style={{
                                        borderColor: isCompleted || isActive ? "rgb(var(--color-accent))" : "rgb(var(--color-border-subtle))",
                                        color: isCompleted ? "#fff" : isActive ? "rgb(var(--color-accent))" : "rgb(var(--color-text-muted))",
                                    }}
                                >
                                    {isCompleted ? (
                                        <Check className="w-4 h-4" />
                                    ) : (
                                        step.number
                                    )}
                                </div>
                                <span
                                    className="text-xs font-semibold"
                                    style={{
                                        color: isActive
                                            ? "rgb(var(--color-text-primary))"
                                            : "rgb(var(--color-text-muted))",
                                    }}
                                >
                                    <span className="text-muted mr-1">{step.number}</span>
                                    {step.title}
                                </span>
                            </div>

                            {/* Connector */}
                            {i < steps.length - 1 && (
                                <div
                                    className="flex-1 h-px mx-3 mb-5 transition-colors duration-500"
                                    style={{
                                        backgroundColor: currentStep > step.number
                                            ? "rgb(var(--color-accent))"
                                            : "rgb(var(--color-border-subtle))",
                                    }}
                                />
                            )}
                        </React.Fragment>
                    );
                })}
            </div>

            {/* ── Card ──────────────────────────────────────────── */}
            <div className="relative">
                <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="rounded-2xl border overflow-hidden"
                        style={{
                            backgroundColor: "rgb(var(--color-surface))",
                            borderColor: "rgb(var(--color-border-subtle))",
                        }}
                    >
                        <div className="px-10 py-8">
                            {currentStep === 1 && (
                                <CompanyOnboardingStep
                                    formData={onboardingData.company}
                                    onChange={handleCompanyChange}
                                    errors={errors}
                                />
                            )}
                            {currentStep === 2 && (
                                <SubscriptionStep
                                    selectedPlan={onboardingData.subscription.plan}
                                    onSelect={handleSubscriptionChange}
                                />
                            )}
                            {currentStep === 3 && (
                                <ConfirmationStep />
                            )}

                            {errors.form && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-sm text-center mt-4 py-2 px-4 rounded-lg font-medium"
                                    style={{
                                        color: "rgb(var(--color-danger))",
                                        backgroundColor: "rgb(var(--color-danger-subtle))",
                                    }}
                                >
                                    {errors.form}
                                </motion.p>
                            )}

                            {/* ── Actions ───────────────────────────────────── */}
                            <div className="flex flex-col gap-3 mt-6">
                                <button
                                    onClick={handleNext}
                                    disabled={isLoading}
                                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all active:scale-[0.98] disabled:opacity-60"
                                    style={{
                                        backgroundColor: "rgb(var(--color-accent))",
                                        color: "rgb(var(--color-text-inverse, 255 255 255))",
                                    }}
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : currentStep === 3 ? (
                                        <>Activate Account <Rocket className="w-4 h-4" /></>
                                    ) : (
                                        <>Continue <ArrowRight className="w-4 h-4" /></>
                                    )}
                                </button>

                                {currentStep > 1 && (
                                    <button
                                        onClick={handleBack}
                                        disabled={isLoading}
                                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm transition-all hover:opacity-80 disabled:opacity-50"
                                        style={{
                                            color: "rgb(var(--color-text-secondary))",
                                            backgroundColor: "transparent",
                                        }}
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        Back
                                    </button>
                                )}

                                {/* Security footer */}
                                <div className="flex items-center justify-center gap-2 pt-1">
                                    <SecurityLockIcon />
                                    <span
                                        className="text-xs"
                                        style={{ color: "rgb(var(--color-text-muted))" }}
                                    >
                                        Enterprise-grade security included
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

const SecurityLockIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ color: "rgb(var(--color-text-muted))" }}
    >
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);

export default OnboardingStepper;
