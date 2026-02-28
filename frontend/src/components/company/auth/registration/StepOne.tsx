"use client";

import { motion } from "framer-motion";
import FormDropdown from "../../../ui/FormDropdown";
import React from "react";

import {
  RegisterFormData,
  Errors,
} from "@/shared/types/company/auth/company-registeration/company-registration.type";
import { StepOneProps } from "@/shared/types/company/auth/company-registeration/step-one-props.type";
import { employeeSizeOptionsData } from "@/shared/constants/datas/company-register-employee-size-options";
import { industryOptionsData } from "@/shared/constants/datas/company-register-industry-options";
import FormInput from "@/components/ui/FormInput";

const StepOne: React.FC<StepOneProps> = ({
  formData,
  setFormData,
  errors,
  setErrors,
}) => {
  const employeeSizeOptions = employeeSizeOptionsData;
  const industryOptions = industryOptionsData;

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | { target: { name: string; value: string } },
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof RegisterFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-bold text-primary mb-2">
        Company Information
      </h2>
      <p className="text-muted mb-8">Tell us about your organization</p>
<div className="space-y-6">
      <FormInput
        label="Company Name"
        name="companyName"
        value={formData.companyName}
        onChange={handleChange}
        error={errors.companyName}
        required
        placeholder="Company Inc."
      />

      <FormInput
        label="Company Email"
        name="companyEmail"
        type="email"
        value={formData.companyEmail}
        onChange={handleChange}
        error={errors.companyEmail}
        required
        placeholder="contact@gmail.com"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormDropdown
          label="Employee Size"
          name="employeeSize"
          value={formData.employeeSize}
          onChange={handleChange}
          options={employeeSizeOptions}
          error={errors.employeeSize}
          required
          placeholder="Select size"
        />

        <FormDropdown
          label="Industry"
          name="industry"
          value={formData.industry}
          onChange={handleChange}
          options={industryOptions}
          error={errors.industry}
          required
          placeholder="Select industry"
        />
      </div>

      <FormInput
        label="Website URL"
        name="websiteUrl"
        type="url"
        value={formData.websiteUrl}
        onChange={handleChange}
        error={errors.websiteUrl}
        placeholder="https://acme.com"
      />
      </div>
    </motion.div>
  );
};

export default StepOne;
