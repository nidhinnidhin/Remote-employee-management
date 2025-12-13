import React from 'react';
import { ArrowRight, ArrowLeft, Check, Zap, Star, Crown } from 'lucide-react';

interface PlanSelectionProps {
    onNext: (data: any) => void;
    onBack: () => void;
    initialData?: any;
}

const plans = [
    {
        id: 'starter',
        name: 'Starter',
        priceMonth: 23,
        priceYear: 19,
        features: ['Up to 10 employees', 'Basic features', '5GB Storage', 'Email Support'],
        icon: Zap,
        color: 'text-blue-500 bg-blue-50',
        borderColor: 'hover:border-blue-200'
    },
    {
        id: 'professional',
        name: 'Professional',
        priceMonth: 63,
        priceYear: 49,
        features: ['Up to 50 employees', 'Advanced features', '50GB Storage', 'Priority Support'],
        icon: Star,
        isPopular: true,
        color: 'text-violet-600 bg-violet-50',
        borderColor: 'border-violet-500 bg-violet-50/10'
    },
    {
        id: 'enterprise',
        name: 'Enterprise',
        priceMonth: 159,
        priceYear: 129,
        features: ['Unlimited employees', 'All features', 'Unlimited Storage', 'Dedicated Support'],
        icon: Crown,
        color: 'text-amber-500 bg-amber-50',
        borderColor: 'hover:border-amber-200'
    },
];

export default function PlanSelection({ onNext, onBack, initialData }: PlanSelectionProps) {
    const [billingCycle, setBillingCycle] = React.useState<'monthly' | 'yearly'>(initialData?.billingCycle || 'monthly');
    const [selectedPlanId, setSelectedPlanId] = React.useState(initialData?.planId || 'professional');

    const handleSelectPlan = (planId: string) => {
        setSelectedPlanId(planId);
    };

    const handleNext = () => {
        const selectedPlan = plans.find(p => p.id === selectedPlanId);
        onNext({
            planId: selectedPlanId,
            billingCycle,
            planName: selectedPlan?.name,
            price: billingCycle === 'monthly' ? selectedPlan?.priceMonth : selectedPlan?.priceYear,
        });
    };

    return (
        <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
            <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Choose Your Plan</h2>
                <p className="text-slate-500 mt-2 text-lg">Scalable pricing for teams of all sizes.</p>
            </div>

            {/* Billing Toggle */}
            <div className="flex justify-center mb-10">
                <div className="bg-slate-100 p-1.5 rounded-2xl flex relative shadow-inner border border-slate-200/50">
                    <button
                        type="button"
                        onClick={() => setBillingCycle('monthly')}
                        className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 relative z-10 ${billingCycle === 'monthly' ? 'text-blue-900 shadow-sm bg-white' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                        Monthly
                    </button>
                    <button
                        type="button"
                        onClick={() => setBillingCycle('yearly')}
                        className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 relative z-10 ${billingCycle === 'yearly' ? 'text-blue-900 shadow-sm bg-white' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                        Yearly
                    </button>

                    {/* Discount Badge */}
                    <div className="absolute -top-3 -right-8 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm animate-bounce">
                        SAVE 20%
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {plans.map((plan) => {
                    const isSelected = selectedPlanId === plan.id;
                    const price = billingCycle === 'monthly' ? plan.priceMonth : plan.priceYear;

                    return (
                        <div
                            key={plan.id}
                            onClick={() => handleSelectPlan(plan.id)}
                            className={`relative border-2 rounded-2xl p-6 cursor-pointer transition-all duration-300 group ${isSelected ? plan.borderColor + ' bg-opacity-30 shadow-md scale-[1.01]' : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50'}`}
                        >
                            {plan.isPopular && (
                                <div className="absolute -top-3 left-6 bg-violet-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg shadow-violet-600/30 uppercase tracking-wider">
                                    Most Popular
                                </div>
                            )}

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-5">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300 shadow-sm ${plan.color}`}>
                                        <plan.icon size={26} strokeWidth={2.5} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-lg leading-tight">{plan.name}</h3>
                                        <div className="flex items-baseline gap-1 mt-0.5">
                                            <span className="text-2xl font-bold text-slate-800">${price}</span>
                                            <span className="text-sm text-slate-500 font-medium">/mo</span>
                                        </div>
                                    </div>
                                </div>

                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${isSelected ? 'border-blue-600 bg-blue-600 scale-110' : 'border-slate-300 bg-white'}`}>
                                    {isSelected && <Check size={14} className="text-white" strokeWidth={3} />}
                                </div>
                            </div>

                            <div className="mt-5 pt-5 border-t border-slate-200/60 flex flex-wrap gap-x-6 gap-y-2">
                                {plan.features.map((feature, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-600 font-semibold">
                                        <Check size={14} className={`stroke-[3px] ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                                        {feature}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className="pt-8 flex justify-between items-center border-t border-slate-100 mt-10">
                <button
                    type="button"
                    onClick={onBack}
                    className="flex items-center gap-2 px-8 py-3.5 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-800 font-semibold rounded-xl transition-all"
                >
                    <ArrowLeft size={18} />
                    Back
                </button>

                <button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/25 transition-all hover:scale-[1.02] active:scale-[0.98] text-base"
                >
                    Go to Payment
                    <ArrowRight size={18} />
                </button>
            </div>
        </div>
    );
}
