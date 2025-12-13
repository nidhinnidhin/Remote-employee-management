import React from 'react';
import { Building2, User, CreditCard, ShieldCheck, Check } from 'lucide-react';

interface RegisterStepperProps {
    currentStep: number;
}

const steps = [
    {
        id: 1,
        title: 'Company Info',
        description: 'Tell us about your organization',
        icon: Building2,
    },
    {
        id: 2,
        title: 'Admin Account',
        description: 'Create your admin credentials',
        icon: User,
    },
    {
        id: 3,
        title: 'Choose Plan',
        description: 'Select the best plan for you',
        icon: CreditCard,
    },
    {
        id: 4,
        title: 'Payment',
        description: 'Secure checkout process',
        icon: ShieldCheck,
    },
];

export default function RegisterStepper({ currentStep }: RegisterStepperProps) {
    return (
        <div className="w-full text-white">
            <div className="mb-14">
                <h1 className="text-4xl font-bold mb-3 tracking-tight">Start your journey</h1>
                <p className="text-blue-100/90 text-lg font-light leading-relaxed">Join thousands of companies managing their remote workforce efficiently.</p>
            </div>

            <div className="space-y-4 relative">
                {/* Connector Line - Absolute backbone */}
                <div className="absolute left-[24px] top-6 bottom-10 w-0.5 bg-blue-400/20 -z-10" />

                {steps.map((step) => {
                    const isActive = currentStep === step.id;
                    const isCompleted = currentStep > step.id;
                    const isPending = currentStep < step.id;
                    const Icon = isCompleted ? Check : step.icon;

                    return (
                        <div
                            key={step.id}
                            className={`relative flex items-center p-4 rounded-2xl transition-all duration-500 ease-out group ${isActive
                                    ? 'bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl translate-x-4'
                                    : 'hover:bg-white/5 border border-transparent'
                                }`}
                        >
                            <div
                                className={`flex items-center justify-center w-12 h-12 rounded-xl shadow-lg mr-5 transition-all duration-500 relative z-10 ${isActive
                                        ? 'bg-white text-blue-600 scale-110 shadow-blue-900/40'
                                        : isCompleted
                                            ? 'bg-blue-400/20 text-blue-200 ring-1 ring-blue-400/40'
                                            : 'bg-blue-800/30 text-blue-400/60'
                                    }`}
                            >
                                <Icon size={isActive ? 20 : 18} strokeWidth={isCompleted ? 3 : 2} />
                            </div>

                            <div className={`transition-all duration-300 ${isPending ? 'opacity-60' : 'opacity-100'}`}>
                                <div className="flex items-center gap-2 mb-0.5">
                                    <span className={`text-[10px] font-bold uppercase tracking-wider bg-clip-text text-transparent bg-gradient-to-r ${isActive ? 'from-white to-blue-100' : 'from-blue-200 to-blue-400'}`}>Step 0{step.id}</span>
                                </div>
                                <h3 className={`text-lg font-bold leading-tight mb-0.5 ${isActive ? 'text-white' : 'text-blue-100'}`}>
                                    {step.title}
                                </h3>
                                <p className={`text-sm font-medium leading-normal ${isActive ? 'text-blue-100' : 'text-blue-300/80 group-hover:text-blue-200 transition-colors'}`}>
                                    {step.description}
                                </p>
                            </div>

                            {isActive && (
                                <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-blue-300 shadow-glow animate-pulse"></div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
