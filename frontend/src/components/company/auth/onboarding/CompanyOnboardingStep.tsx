"use client";

import React from "react";
import FormInput from "@/components/ui/FormInput";
import FormDropdown from "@/components/ui/FormDropdown";
import { employeeSizeOptionsData } from "@/shared/constants/datas/company-register-employee-size-options";
import { industryOptionsData } from "@/shared/constants/datas/company-register-industry-options";
import { Building2, Mail, Users, Globe, Briefcase } from "lucide-react";

interface CompanyOnboardingStepProps {
    formData: any;
    onChange: (e: any) => void;
    errors: any;
}

const CompanyOnboardingStep: React.FC<CompanyOnboardingStepProps> = ({
    formData,
    onChange,
    errors,
}) => {
    return (
        <div className="space-y-10">
            <div className="text-center mb-4">
                <div className="inline-flex p-4 rounded-3xl bg-accent/10 text-accent mb-6 shadow-sm">
                    <Building2 className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-black text-primary tracking-tight mb-2">Build Your Profile</h2>
                <p className="text-secondary text-lg">Tell us about your organization to personalize your experience</p>
            </div>

            <div className="space-y-6">
                <FormInput
                    label="Company Name"
                    name="name"
                    value={formData.name}
                    onChange={onChange}
                    error={errors.name}
                    required
                    placeholder="e.g. Acme Corporation"
                    icon={<Building2 className="w-4 h-4 text-muted" />}
                />

                <FormInput
                    label="Business Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={onChange}
                    error={errors.email}
                    required
                    placeholder="hello@acme.com"
                    icon={<Mail className="w-4 h-4 text-muted" />}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormDropdown
                        label="Team Size"
                        name="size"
                        value={formData.size}
                        onChange={onChange}
                        options={employeeSizeOptionsData}
                        error={errors.size}
                        required
                    />
                    <FormDropdown
                        label="Industry"
                        name="industry"
                        value={formData.industry}
                        onChange={onChange}
                        options={industryOptionsData}
                        error={errors.industry}
                        required
                    />
                </div>

                <FormInput
                    label="Corporate Website (Optional)"
                    name="website"
                    value={formData.website}
                    onChange={onChange}
                    error={errors.website}
                    placeholder="https://www.acme.com"
                    icon={<Globe className="w-4 h-4 text-muted" />}
                />
            </div>

            <div className="p-4 rounded-2xl bg-bg-subtle/50 border border-dashed border-border-subtle flex items-center justify-center gap-2">
                <Shield className="w-4 h-4 text-accent" />
                <span className="text-[10px] text-muted font-bold uppercase tracking-widest">Enterprise-grade security included</span>
            </div>
        </div>
    );
};

// Simple Shield icon if not imported from lucide
const Shield = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    </svg>
);

export default CompanyOnboardingStep;
