"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import CompanyOnboardingStep from "./CompanyOnboardingStep";
import SubscriptionStep from "./SubscriptionStep";
import ConfirmationStep from "./ConfirmationStep";
import { onboardAction, getOnboardingStatusAction, finalizeOnboardingAction } from "@/actions/auth/onboard.action";
import { ArrowRight, ArrowLeft, Check, Loader2, Rocket } from "lucide-react";
import type { SubscriptionPlan } from "@/shared/types/superadmin/subscription/subscription.type";

const steps = [
    { title: "Organization", number: 1 },
    { title: "Subscription", number: 2 },
    { title: "Confirmation", number: 3 },
];

const OnboardingStepper: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(true); // Start with loading
    const router = useRouter();
    const searchParams = useSearchParams();
    const [onboardingUserId, setOnboardingUserId] = useState<string | null>(null);

    const [onboardingData, setOnboardingData] = useState({
        company: {
            id: "",
            name: "",
            email: "",
            size: "",
            industry: "",
            website: "",
        },
        subscription: {
            planId: "",
            planName: "Professional",
        },
        user: {
            firstName: "",
            lastName: "",
            email: "",
        }
    });

    // Stores the full plan object so ConfirmationStep can show price, features, etc.
    const [selectedPlanDetails, setSelectedPlanDetails] = useState<SubscriptionPlan | null>(null);

    React.useEffect(() => {
        const userIdFromUrl = searchParams.get("userId");
        const userIdFromStorage = localStorage.getItem("registration_user_id");
        const userId = userIdFromUrl || userIdFromStorage;

        if (userId) {
            if (userIdFromUrl) localStorage.setItem("registration_user_id", userIdFromUrl);
            setOnboardingUserId(userId);
            fetchStatus(userId);
        } else {
            setIsLoading(false);
        }
    }, [searchParams]);

    const fetchStatus = async (userId: string) => {
        try {
            const result = await getOnboardingStatusAction(userId);
            if (result.success && result.data) {
                const { step, company, user } = result.data;
                
                // If user is already fully onboarded, redirect
                if (user?.isOnboarded) {
                    router.replace("/admin/dashboard");
                    return;
                }

                if (company) {
                    setOnboardingData(prev => ({
                        ...prev,
                        company: {
                            id: company.id,
                            name: company.name,
                            email: company.email,
                            size: company.size,
                            industry: company.industry,
                            website: company.website || "",
                        }
                    }));
                }

                if (user) {
                    setOnboardingData(prev => ({
                        ...prev,
                        user: {
                            firstName: user.firstName || "",
                            lastName: user.lastName || "",
                            email: user.email || "",
                        }
                    }));
                }

                // Map backend step to stepper number
                const stepMap: Record<string, number> = {
                    'ORGANIZATION': 1,
                    'SUBSCRIPTION': 2,
                    'CONFIRMATION': 3,
                    'COMPLETED': 3
                };
                setCurrentStep(stepMap[step] || 1);
            }
        } catch (err) {
            console.error("Failed to fetch onboarding status", err);
        } finally {
            setIsLoading(false);
        }
    };

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

    const handleSubscriptionChange = (planId: string, planName: string, planDetails?: SubscriptionPlan) => {
        setOnboardingData(prev => ({
            ...prev,
            subscription: { planId, planName }
        }));
        if (planDetails) setSelectedPlanDetails(planDetails);
    };

    const validateStep = (step: number) => {
        const newErrors: any = {};
        if (step === 1) {
            const name = onboardingData.company.name.trim();

            if (!name) {
                newErrors.name = "Company name is required";
            } else if (name.length < 2) {
                newErrors.name = "Company name must be at least 2 characters";
            } else if (name.length > 100) {
                newErrors.name = "Company name must not exceed 100 characters";
            } else if (!/^[a-zA-Z0-9\s.,&'-]+$/.test(name)) {
                newErrors.name = "Company name contains invalid characters";
            } else if (/^[^a-zA-Z0-9]+$/.test(name)) {
                newErrors.name = "Company name must contain at least one letter or number";
            }

            if (!onboardingData.company.email) {
                newErrors.email = "Business email is required";
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(onboardingData.company.email)) {
                newErrors.email = "Please enter a valid business email address";
            }

            if (!onboardingData.company.size) newErrors.size = "Please select team size";
            if (!onboardingData.company.industry) newErrors.industry = "Please select an industry";

            // Website is optional — but if filled, it must look like a URL
            if (onboardingData.company.website) {
                const website = onboardingData.company.website.trim();
                if (!/^https?:\/\/.+\..+/.test(website)) {
                    newErrors.website = "Please enter a valid URL (e.g. https://acme.com)";
                }
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = async () => {
        if (!validateStep(currentStep)) return;

        const userId = onboardingUserId || localStorage.getItem("registration_user_id");
        if (!userId) {
            setErrors({ form: "Registration session expired. Please sign up again." });
            return;
        }

        if (currentStep === 1) {
            setIsLoading(true);
            try {
                const { id, ...companyData } = onboardingData.company;
                const result = await onboardAction({
                    company: companyData,
                    userId
                });

                if (result.success) {
                    if (result.data?.company?.id) {
                        setOnboardingData(prev => ({
                            ...prev,
                            company: { ...prev.company, id: result.data.company.id }
                        }));
                    }
                    setCurrentStep(2);
                } else {
                    setErrors({ form: result.error || "Failed to save company details" });
                }
            } catch (err) {
                setErrors({ form: "Something went wrong" });
            } finally {
                setIsLoading(false);
            }
        } else if (currentStep === 2) {
            // Subscription is handled inside SubscriptionStep with Razorpay
            // This button might be disabled until payment is verified
            setCurrentStep(3);
        } else {
            // Step 3 Confirmation
            setIsLoading(true);
            try {
                const result = await finalizeOnboardingAction(userId);
                if (result.success) {
                    localStorage.removeItem("registration_user_id");
                    router.replace("/admin/dashboard");
                } else {
                    setErrors({ form: result.error || "Failed to finalize account" });
                }
            } catch (err) {
                setErrors({ form: "Something went wrong" });
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleBack = () => {
        if (currentStep > 1) setCurrentStep(prev => prev - 1);
    };

    // ADJUSTED: Width expands to 6xl (1152px) for Subscription Step, stays 2xl (672px) for others
    const containerMaxWidth = currentStep === 2 ? "max-w-6xl" : "max-w-2xl";

    return (
        <div className={`w-full ${containerMaxWidth} mx-auto py-10 px-4 flex flex-col transition-all duration-500 ease-in-out`}>

            {/* ── Step Indicator ────────────────────────────────── */}
            <div className="flex items-center w-full mb-12 px-2 max-w-2xl mx-auto">
                {steps.map((step, i) => {
                    const isCompleted = currentStep > step.number;
                    const isActive = currentStep === step.number;

                    return (
                        <React.Fragment key={step.number}>
                            <div className="flex flex-col items-center gap-2">
                                <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 text-sm font-bold"
                                    style={{
                                        borderColor: isCompleted || isActive ? "rgb(var(--color-accent))" : "rgb(var(--color-border-subtle))",
                                        backgroundColor: isCompleted ? "rgb(var(--color-accent))" : "transparent",
                                        color: isCompleted ? "#fff" : isActive ? "rgb(var(--color-accent))" : "rgb(var(--color-text-muted))",
                                    }}
                                >
                                    {isCompleted ? <Check className="w-5 h-5" /> : step.number}
                                </div>
                                <span
                                    className="text-xs font-bold uppercase tracking-wider"
                                    style={{
                                        color: isActive ? "rgb(var(--color-text-primary))" : "rgb(var(--color-text-muted))",
                                    }}
                                >
                                    {step.title}
                                </span>
                            </div>

                            {i < steps.length - 1 && (
                                <div
                                    className="flex-1 h-0.5 mx-4 mb-6 transition-colors duration-500"
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

            {/* ── Card Content ──────────────────────────────────── */}
            <div className="relative">
                <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* 
                           Note: The 'rounded-2xl border' is removed from here for Step 2 
                           if your SubscriptionStep already has its own card styling.
                           If not, keep the styling below.
                        */}
                        <div 
                            className={currentStep === 2 ? "" : "rounded-[32px] border px-10 py-10 shadow-sm"}
                            style={currentStep === 2 ? {} : {
                                backgroundColor: "rgb(var(--color-surface-raised))",
                                borderColor: "rgb(var(--color-border-subtle))",
                            }}
                        >
                            {currentStep === 1 && (
                                <CompanyOnboardingStep
                                    formData={onboardingData.company}
                                    onChange={handleCompanyChange}
                                    errors={errors}
                                />
                            )}
                            
                            {currentStep === 2 && (
                                <SubscriptionStep
                                    selectedPlan={onboardingData.subscription.planId}
                                    onSelect={handleSubscriptionChange}
                                    companyId={onboardingData.company.id}
                                    userId={onboardingUserId!}
                                    onPaymentSuccess={() => setCurrentStep(3)}
                                />
                            )}

                            {currentStep === 3 && (
                                <ConfirmationStep
                                    company={onboardingData.company}
                                    plan={selectedPlanDetails}
                                    planName={onboardingData.subscription.planName}
                                    user={onboardingData.user}
                                />
                            )}

                            {errors.form && (
                                <p className="text-sm text-center mt-6 py-3 px-4 rounded-xl font-medium"
                                    style={{
                                        color: "rgb(var(--color-danger))",
                                        backgroundColor: "rgba(var(--color-danger), 0.1)",
                                    }}
                                >
                                    {errors.form}
                                </p>
                            )}

                            {/* ── Navigation Actions ────────────────────────────── */}
                            <div className={`flex flex-col gap-4 mt-10 ${currentStep === 2 ? "max-w-2xl mx-auto" : ""}`}>
                                {currentStep !== 2 && (
                                    <button
                                        onClick={handleNext}
                                        disabled={isLoading}
                                        className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-sm transition-all active:scale-[0.98] disabled:opacity-60"
                                        style={{
                                            backgroundColor: "rgb(var(--color-accent))",
                                            color: "rgb(var(--color-bg))",
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
                                )}

                                {currentStep === 2 && (
                                    <button
                                        onClick={handleBack}
                                        disabled={isLoading}
                                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-70"
                                        style={{ color: "rgb(var(--color-text-secondary))" }}
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        Back
                                    </button>
                                )}

                                <div className="flex items-center justify-center gap-2 pt-2">
                                    <SecurityLockIcon />
                                    <span className="text-[11px] font-medium" style={{ color: "rgb(var(--color-text-muted))" }}>
                                        Enterprise-grade encryption and security included
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
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "rgb(var(--color-text-muted))" }}>
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);

export default OnboardingStepper;