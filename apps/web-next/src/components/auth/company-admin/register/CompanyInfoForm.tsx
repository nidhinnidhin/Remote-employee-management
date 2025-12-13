import React from 'react';
import { ArrowRight } from 'lucide-react';

interface CompanyInfoFormProps {
    onNext: (data: any) => void;
    initialData?: any;
}

export default function CompanyInfoForm({ onNext, initialData }: CompanyInfoFormProps) {
    const [formData, setFormData] = React.useState({
        companyName: initialData?.companyName || '',
        companyEmail: initialData?.companyEmail || '',
        companySize: initialData?.companySize || '',
        industry: initialData?.industry || '',
        website: initialData?.website || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Company Details</h2>
                <p className="text-slate-500 mt-2 text-lg">Tell us about your organization to personalize your workspace.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="col-span-1 md:col-span-2">
                        <label htmlFor="companyName" className="block text-sm font-semibold text-slate-700 mb-2">
                            Company Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="companyName"
                            name="companyName"
                            required
                            value={formData.companyName}
                            onChange={handleChange}
                            className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 outline-none transition-all shadow-sm hover:border-slate-300"
                            placeholder="e.g. Acme Corp"
                        />
                    </div>

                    <div className="col-span-1 md:col-span-2">
                        <label htmlFor="companyEmail" className="block text-sm font-semibold text-slate-700 mb-2">
                            Work Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            id="companyEmail"
                            name="companyEmail"
                            required
                            value={formData.companyEmail}
                            onChange={handleChange}
                            className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 outline-none transition-all shadow-sm hover:border-slate-300"
                            placeholder="name@company.com"
                        />
                        <p className="text-xs text-slate-400 mt-1.5">We'll send a verification link to this email.</p>
                    </div>

                    <div>
                        <label htmlFor="companySize" className="block text-sm font-semibold text-slate-700 mb-2">
                            Company Size <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <select
                                id="companySize"
                                name="companySize"
                                required
                                value={formData.companySize}
                                onChange={handleChange}
                                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 outline-none appearance-none transition-all cursor-pointer shadow-sm hover:border-slate-300"
                            >
                                <option value="" disabled>Select size</option>
                                <option value="1-10">1-10 employees</option>
                                <option value="11-50">11-50 employees</option>
                                <option value="51-200">51-200 employees</option>
                                <option value="201-500">201-500 employees</option>
                                <option value="500+">500+ employees</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="industry" className="block text-sm font-semibold text-slate-700 mb-2">
                            Industry
                        </label>
                        <div className="relative">
                            <select
                                id="industry"
                                name="industry"
                                value={formData.industry}
                                onChange={handleChange}
                                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 outline-none appearance-none transition-all cursor-pointer shadow-sm hover:border-slate-300"
                            >
                                <option value="">Select industry</option>
                                <option value="Technology">Technology</option>
                                <option value="Healthcare">Healthcare</option>
                                <option value="Finance">Finance</option>
                                <option value="Retail">Retail</option>
                                <option value="Education">Education</option>
                                <option value="Manufacturing">Manufacturing</option>
                                <option value="Other">Other</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-1 md:col-span-2">
                        <label htmlFor="website" className="block text-sm font-semibold text-slate-700 mb-2">
                            Website <span className="text-slate-400 font-normal ml-1">(Optional)</span>
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">https://</span>
                            <input
                                type="url"
                                id="website"
                                name="website"
                                value={formData.website}
                                onChange={handleChange}
                                className="w-full pl-20 pr-4 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 outline-none transition-all shadow-sm hover:border-slate-300"
                                placeholder="example.com"
                            />
                        </div>
                    </div>
                </div>


                <div className="pt-8 flex justify-end border-t border-slate-100 mt-10">
                    <button
                        type="submit"
                        className="flex items-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/25 transition-all hover:scale-[1.02] active:scale-[0.98] text-base"
                    >
                        Continue to Admin Setup
                        <ArrowRight size={18} />
                    </button>
                </div>
            </form>
        </div>
    );
}
