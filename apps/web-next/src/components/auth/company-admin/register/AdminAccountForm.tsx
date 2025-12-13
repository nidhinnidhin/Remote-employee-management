import React from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';

interface AdminAccountFormProps {
    onNext: (data: any) => void;
    onBack: () => void;
    initialData?: any;
}

export default function AdminAccountForm({ onNext, onBack, initialData }: AdminAccountFormProps) {
    const [formData, setFormData] = React.useState({
        firstName: initialData?.firstName || '',
        lastName: initialData?.lastName || '',
        email: initialData?.email || '',
        phone: initialData?.phone || '',
        password: '',
        confirmPassword: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onNext(formData);
    };

    return (
        <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
            <div className="mb-10">
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Setup Admin Account</h2>
                <p className="text-slate-500 mt-2 text-lg">Create credentials for the primary administrator.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div>
                        <label htmlFor="firstName" className="block text-sm font-semibold text-slate-700 mb-2">
                            First Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            required
                            value={formData.firstName}
                            onChange={handleChange}
                            className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 outline-none transition-all shadow-sm hover:border-slate-300"
                            placeholder="John"
                        />
                    </div>
                    <div>
                        <label htmlFor="lastName" className="block text-sm font-semibold text-slate-700 mb-2">
                            Last Name
                        </label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 outline-none transition-all shadow-sm hover:border-slate-300"
                            placeholder="Doe"
                        />
                    </div>

                    <div className="col-span-1 md:col-span-2">
                        <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                            Work Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 outline-none transition-all shadow-sm hover:border-slate-300"
                        />
                    </div>

                    <div className="col-span-1 md:col-span-2">
                        <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-2">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 outline-none transition-all shadow-sm hover:border-slate-300"
                            placeholder="+1 (555) 000-0000"
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                                Password <span className="text-red-500">*</span>
                            </label>
                        </div>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            required
                            minLength={8}
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 outline-none transition-all tracking-widest"
                            placeholder="••••••••"
                        />
                        <p className="text-xs text-slate-400 mt-1.5 ">Min. 8 chars with 1 number & 1 special</p>
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700 mb-2">
                            Confirm Password <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            required
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 outline-none transition-all tracking-widest"
                            placeholder="••••••••"
                        />
                    </div>
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
                        type="submit"
                        className="flex items-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/25 transition-all hover:scale-[1.02] active:scale-[0.98] text-base"
                    >
                        View Plans
                        <ArrowRight size={18} />
                    </button>
                </div>
            </form>
        </div>
    );
}
