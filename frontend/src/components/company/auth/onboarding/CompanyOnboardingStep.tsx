"use client";

import React from "react";
import FormInput from "@/components/ui/FormInput";
import FormDropdown from "@/components/ui/FormDropdown";
import { employeeSizeOptionsData } from "@/shared/constants/datas/company-register-employee-size-options";
import { industryOptionsData } from "@/shared/constants/datas/company-register-industry-options";
import { Building2, Mail, Users, Globe } from "lucide-react";

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
        <div className="space-y-5">
            {/* Header */}
            <div className="text-center mb-5">
                <div
                    className="inline-flex p-3 rounded-2xl mb-4"
                    style={{ backgroundColor: "rgb(var(--color-accent-subtle))" }}
                >
                    <Building2
                        className="w-7 h-7"
                        style={{ color: "rgb(var(--color-accent))" }}
                    />
                </div>
                <h2
                    className="text-3xl font-bold mb-2"
                    style={{ color: "rgb(var(--color-text-primary))" }}
                >
                    Build Your Profile
                </h2>
                <p
                    className="text-base leading-relaxed"
                    style={{ color: "rgb(var(--color-text-secondary))" }}
                >
                    Tell us about your organization to personalize your experience.
                </p>
            </div>

            {/* Fields */}
            <div className="space-y-6">
                <FormInput
                    label="Company Name"
                    name="name"
                    value={formData.name}
                    onChange={onChange}
                    error={errors.name}
                    required
                    placeholder="e.g. Acme Corporation"
                    icon={<Building2 className="w-4 h-4" style={{ color: "rgb(var(--color-text-muted))" }} />}
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
                    icon={<Mail className="w-4 h-4" style={{ color: "rgb(var(--color-text-muted))" }} />}
                />

                <div className="grid grid-cols-2 gap-6">
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
                    icon={<Globe className="w-4 h-4" style={{ color: "rgb(var(--color-text-muted))" }} />}
                />
            </div>
        </div>
    );
};

export default CompanyOnboardingStep;
