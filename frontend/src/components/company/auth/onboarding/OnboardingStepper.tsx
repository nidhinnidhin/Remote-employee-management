"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import CompanyOnboardingStep from "./CompanyOnboardingStep";
import SubscriptionStep from "./SubscriptionStep";
import ConfirmationStep from "./ConfirmationStep";
import { onboardAction } from "@/actions/auth/onboard.action";
import { ArrowRight, ArrowLeft, Loader2, Rocket, Building2, ShieldCheck, Sparkles } from "lucide-react";

const steps = [
    { title: "Organization", icon: Building2, description: "Basic details" },
    { title: "Subscription", icon: Sparkles, description: "Choose your plan" },
    { title: "Confirmation", icon: ShieldCheck, description: "Review & finish" },
];

const OnboardingStepper: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const [onboardingUserId, setOnboardingUserId] = useState<string | null>(null);

    // Effect to catch userId from social login redirect or localStorage
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
            if (!onboardingData.company.email) newErrors.email = "Company email is required";
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
            // Final step - trigger API
            // Use state first, fallback to storage
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
                    router.replace("/company/employees/dashboard");
                } else {
                    setErrors({ form: result.error });
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
        <div className="w-full max-w-2xl mx-auto py-12 px-4 min-h-[600px] flex flex-col justify-center">
            {/* Header section with icons */}
            <div className="md:flex items-center justify-between mb-12 hidden">
                {steps.map((s, i) => {
                    const stepNum = i + 1;
                    const isActive = currentStep === stepNum;
                    const isCompleted = currentStep > stepNum;
                    const Icon = s.icon;

                    return (
                        <div key={i} className="flex-1 flex items-center relative">
                            {/* Connector Line */}
                            {i !== 0 && (
                                <div className={`absolute left-[-50%] right-[calc(50%+20px)] h-0.5 transition-colors duration-500 ${isCompleted ? 'bg-accent' : 'bg-border-subtle'}`} />
                            )}

                            <div className="flex flex-col items-center mx-auto z-10">
                                <motion.div
                                    animate={{
                                        scale: isActive ? 1.1 : 1,
                                        backgroundColor: isActive || isCompleted ? "rgb(var(--color-accent))" : "rgb(var(--color-surface-raised))"
                                    }}
                                    className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-lg transition-all ${isActive ? 'ring-4 ring-accent/20 border-accent' : 'border-border-subtle'}`}
                                >
                                    <Icon className={`w-6 h-6 ${isActive || isCompleted ? 'text-white' : 'text-muted'}`} />
                                </motion.div>
                                <span className={`text-[10px] font-bold uppercase tracking-widest mt-3 transition-colors ${isActive ? 'text-accent' : 'text-muted'}`}>
                                    {s.title}
                                </span>
                            </div>

                            {/* Connector Line Right */}
                            {i !== steps.length - 1 && (
                                <div className={`absolute right-[-50%] left-[calc(50%+20px)] h-0.5 transition-colors duration-500 ${isCompleted ? 'bg-accent' : 'bg-border-subtle'}`} />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Mobile Progress (Simplified) */}
            <div className="flex gap-2 mb-8 md:hidden">
                {steps.map((_, i) => (
                    <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i + 1 <= currentStep ? "bg-accent" : "bg-border-subtle"}`}
                    />
                ))}
            </div>

            <div className="relative">
                <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.98 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="portal-card p-10 md:p-12 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-border-subtle bg-card"
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
                                className="text-danger text-sm text-center mt-6 bg-danger/10 py-2 rounded-lg border border-danger/20 font-medium"
                            >
                                {errors.form}
                            </motion.p>
                        )}

                        <div className="flex flex-col sm:flex-row gap-4 mt-12 pt-8 border-t border-border-subtle/50">
                            {currentStep > 1 && (
                                <button
                                    onClick={handleBack}
                                    disabled={isLoading}
                                    className="sm:w-32 flex items-center justify-center gap-2 py-4 rounded-xl border border-border-subtle text-secondary font-semibold hover:bg-bg-subtle transition-all active:scale-95 disabled:opacity-50"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                    Back
                                </button>
                            )}
                            <button
                                onClick={handleNext}
                                disabled={isLoading}
                                className="flex-1 flex items-center justify-center gap-3 py-4 rounded-xl bg-accent text-white font-bold hover:opacity-90 transition-all active:scale-[0.98] shadow-xl shadow-accent/25 disabled:bg-muted"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                ) : (
                                    <>
                                        {currentStep === 3 ? (
                                            <>
                                                Activate Account
                                                <Rocket className="w-5 h-5" />
                                            </>
                                        ) : (
                                            <>
                                                Continue
                                                <ArrowRight className="w-5 h-5" />
                                            </>
                                        )}
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Visual background accents */}
            <div className="fixed top-1/4 -left-20 w-80 h-80 bg-accent/5 rounded-full blur-[100px] pointer-events-none -z-10" />
            <div className="fixed bottom-1/4 -right-20 w-80 h-80 bg-accent/5 rounded-full blur-[100px] pointer-events-none -z-10" />
        </div>
    );
};

export default OnboardingStepper;
