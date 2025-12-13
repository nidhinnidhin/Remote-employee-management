"use client";

import React, { useState } from 'react';
import RegisterStepper from '@/components/auth/company-admin/register/RegisterStepper';
import CompanyInfoForm from '@/components/auth/company-admin/register/CompanyInfoForm';
import AdminAccountForm from '@/components/auth/company-admin/register/AdminAccountForm';
import PlanSelection from '@/components/auth/company-admin/register/PlanSelection';
import PaymentForm from '@/components/auth/company-admin/register/PaymentForm';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function CompanyRegisterPage() {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        companyInfo: {},
        adminAccount: {},
        plan: {
            planId: 'professional',
            billingCycle: 'yearly',
            planName: 'Professional',
            price: 49,
        },
        payment: {},
    });

    const nextStep = (stepData: any, stepKey: string) => {
        setFormData((prev) => ({ ...prev, [stepKey]: stepData }));
        setCurrentStep((prev) => prev + 1);
    };

    const prevStep = () => {
        setCurrentStep((prev) => prev - 1);
    };

    const handleComplete = (paymentData: any) => {
        setFormData((prev) => ({ ...prev, payment: paymentData }));
        console.log('Registration Complete:', { ...formData, payment: paymentData });
        alert('Registration Submitted! (Check console for data)');
    };

    return (
        <div className="flex min-h-screen bg-white font-sans selection:bg-blue-100 selection:text-blue-900">
            <div className="hidden lg:flex w-[40%] bg-blue-600 relative overflow-hidden flex-col">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/50 rounded-full blur-3xl opacity-40 -translate-y-1/2 translate-x-1/2 mix-blend-overlay" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/50 rounded-full blur-3xl opacity-40 translate-y-1/2 -translate-x-1/2 mix-blend-multiply" />
                <div className="absolute inset-0 bg-gradient-to-b from-blue-600 to-blue-700 opacity-90" />
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                <div className="relative z-20 p-10 pb-0 shrink-0">
                    <Link href="/" className="group inline-flex items-center gap-2 text-blue-100 hover:text-white transition-all text-sm font-medium opacity-80 hover:opacity-100">
                        <div className="bg-white/10 p-1.5 rounded-lg group-hover:bg-white/20 transition-colors">
                            <ChevronLeft size={14} />
                        </div>
                        Back to home
                    </Link>
                </div>

                <div className="relative z-10 flex-1 flex flex-col justify-center px-12 xl:px-20 min-h-0">
                    <RegisterStepper currentStep={currentStep} />
                </div>

                <div className="relative z-10 p-10 pt-0 shrink-0 text-center space-y-6">
                    <div className="text-blue-200/80 text-sm font-medium">
                        Already have an account? <Link href="/company-admin-login" className="text-white font-bold hover:underline transition-all">Sign in</Link>
                    </div>
                    <div className="text-blue-200/40 text-xs">
                        © 2024 Your Company. All rights reserved.
                    </div>
                </div>
            </div>
            <div className="flex-1 w-full lg:w-[60%] overflow-y-auto h-screen bg-white relative">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-500 lg:hidden" />

                <div className="min-h-full flex flex-col p-6 py-12 lg:p-24 max-w-4xl mx-auto">
                    <div className="lg:hidden mb-10">
                        <div className="flex items-center justify-between mb-8">
                            <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors text-sm font-medium">
                                <ChevronLeft size={16} />
                                Back
                            </Link>
                            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full uppercase tracking-wider">Step {currentStep}/4</span>
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Create Account</h1>
                    </div>


                    <div className="flex-1 flex flex-col justify-center w-full">
                        {currentStep === 1 && (
                            <CompanyInfoForm
                                onNext={(data) => nextStep(data, 'companyInfo')}
                                initialData={formData.companyInfo}
                            />
                        )}
                        {currentStep === 2 && (
                            <AdminAccountForm
                                onNext={(data) => nextStep(data, 'adminAccount')}
                                onBack={prevStep}
                                initialData={formData.adminAccount}
                            />
                        )}
                        {currentStep === 3 && (
                            <PlanSelection
                                onNext={(data) => nextStep(data, 'plan')}
                                onBack={prevStep}
                                initialData={formData.plan}
                            />
                        )}
                        {currentStep === 4 && (
                            <PaymentForm
                                onComplete={handleComplete}
                                onBack={prevStep}
                                planData={formData.plan as any}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
