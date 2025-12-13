import React from 'react';
import { ArrowLeft, Lock, CreditCard, ShieldCheck } from 'lucide-react';

interface PaymentFormProps {
    onComplete: (data: any) => void;
    onBack: () => void;
    planData: {
        planName: string;
        price: number;
        billingCycle: 'monthly' | 'yearly';
    };
}

export default function PaymentForm({ onComplete, onBack, planData }: PaymentFormProps) {
    const [formData, setFormData] = React.useState({
        cardNumber: '',
        cardHolder: '',
        expiry: '',
        cvv: '',
        agreeTerms: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/[^0-9\s]/g, '');
        e.target.value = val;
        handleChange(e);
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.agreeTerms) {
            onComplete(formData);
        }
    };

    return (
        <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
            <div className="mb-10">
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Payment Method</h2>
                <p className="text-slate-500 mt-2 text-lg">Complete your secure checkout.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start">

                {/* Form Column */}
                <div className="flex-1 w-full order-2 lg:order-1">
                    {/* Trial Alert */}
                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 mb-6 flex items-start gap-4">
                        <div className="bg-emerald-100/50 p-2 rounded-lg text-emerald-600 mt-0.5">
                            <ShieldCheck size={20} />
                        </div>
                        <div>
                            <h4 className="font-bold text-emerald-900 text-sm">You won&apos;t be charged today</h4>
                            <p className="text-emerald-700/80 text-sm mt-1 leading-relaxed">
                                Enjoy your <strong>14-day free trial</strong>. We'll email you a reminder 3 days before your trial ends.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="cardNumber" className="block text-sm font-semibold text-slate-700 mb-2">
                                Card Number
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    id="cardNumber"
                                    name="cardNumber"
                                    required
                                    placeholder="0000 0000 0000 0000"
                                    value={formData.cardNumber}
                                    onChange={handleCardNumberChange}
                                    maxLength={19}
                                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 outline-none transition-all font-mono tracking-wide shadow-sm"
                                />
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    <CreditCard size={20} />
                                </div>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2 opacity-50 grayscale">
                                    {/* Icons for Visa/Mastercard could go here */}
                                    <div className="w-8 h-5 bg-slate-200 rounded-sm"></div>
                                    <div className="w-8 h-5 bg-slate-200 rounded-sm"></div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="cardHolder" className="block text-sm font-semibold text-slate-700 mb-2">
                                Cardholder Name
                            </label>
                            <input
                                type="text"
                                id="cardHolder"
                                name="cardHolder"
                                required
                                placeholder="NAME ON CARD"
                                value={formData.cardHolder}
                                onChange={handleChange}
                                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 outline-none transition-all uppercase placeholder:normal-case shadow-sm"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="expiry" className="block text-sm font-semibold text-slate-700 mb-2">
                                    Expiry Date
                                </label>
                                <input
                                    type="text"
                                    id="expiry"
                                    name="expiry"
                                    required
                                    placeholder="MM/YY"
                                    maxLength={5}
                                    value={formData.expiry}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 outline-none transition-all text-center shadow-sm"
                                />
                            </div>
                            <div>
                                <label htmlFor="cvv" className="block text-sm font-semibold text-slate-700 mb-2">
                                    CVC / CVV
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        id="cvv"
                                        name="cvv"
                                        required
                                        placeholder="123"
                                        maxLength={4}
                                        value={formData.cvv}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 outline-none transition-all text-center shadow-sm"
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                                        <Lock size={16} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-1">
                            <input
                                type="checkbox"
                                id="agreeTerms"
                                name="agreeTerms"
                                checked={formData.agreeTerms}
                                onChange={handleChange}
                                className="mt-1 w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
                            />
                            <label htmlFor="agreeTerms" className="text-xs text-slate-500 leading-relaxed cursor-pointer select-none font-medium">
                                I confirm that I have read and agree to the <a href="#" className="text-blue-600 hover:underline hover:text-blue-700">Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline hover:text-blue-700">Privacy Policy</a>.
                            </label>
                        </div>

                        <div className="pt-4 flex justify-between items-center border-t border-slate-100 mt-6">
                            <button
                                type="button"
                                onClick={onBack}
                                className="flex items-center gap-2 px-6 py-3 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-800 font-semibold rounded-xl transition-all"
                            >
                                <ArrowLeft size={18} />
                                Back
                            </button>

                            <button
                                type="submit"
                                disabled={!formData.agreeTerms}
                                className="flex items-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg shadow-blue-600/25 transition-all hover:scale-[1.02] active:scale-[0.98] text-base"
                            >
                                Start My Free Trial
                            </button>
                        </div>

                    </form>
                </div>

                {/* Summary Column */}
                <div className="w-full lg:w-[320px] order-1 lg:order-2">
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm sticky top-6">
                        <h3 className="font-bold text-slate-900 mb-6 text-base border-b border-slate-200/60 pb-4">Order Summary</h3>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between text-sm text-slate-600">
                                <span>Plan</span>
                                <span className="font-bold text-slate-900">{planData.planName}</span>
                            </div>
                            <div className="flex justify-between text-sm text-slate-600">
                                <span>Billing</span>
                                <span className="font-medium text-slate-900 capitalize">{planData.billingCycle}</span>
                            </div>
                            <div className="flex justify-between text-sm text-slate-600">
                                <span>Base Price</span>
                                <span className="font-medium text-slate-900">${planData.price}/mo</span>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-4 border border-slate-100 mb-4">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Due Today</span>
                                <span className="text-2xl font-bold text-slate-900">$0.00</span>
                            </div>
                            <p className="text-[11px] text-emerald-600 font-medium text-right">Includes 14-day free trial</p>
                        </div>

                        <div className="flex items-center justify-center gap-2 text-slate-400 text-xs mt-4">
                            <Lock size={12} />
                            <span>Secure 256-bit SSL Encrypted</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
