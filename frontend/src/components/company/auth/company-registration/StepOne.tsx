"use client";

import { motion } from "framer-motion";
import FormInput from "./FormInput";
import FormDropdown from "./FormDropdown";
import React from "react";

import {
  FormData,
  Errors,
} from "@/types/company/auth/company-registeration/company-registration.type";
import { StepOneProps } from "@/types/company/auth/company-registeration/step-one-props.type";

const StepOne: React.FC<StepOneProps> = ({
  formData,
  setFormData,
  errors,
  setErrors,
}) => {
  const employeeSizeOptions = ["1–10", "11–50", "51–200", "201–500", "500+"];
  const industryOptions = [
    "Technology",
    "Healthcare",
    "Finance",
    "Education",
    "Manufacturing",
    "Other",
  ];

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

    if (errors[name as keyof FormData]) {
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
      className="bg-neutral-800 p-8"
    >
      <h2 className="text-2xl font-bold text-white mb-2">
        Company Information
      </h2>
      <p className="text-neutral-400 mb-8">Tell us about your organization</p>

      <FormInput
        label="Company Name"
        name="companyName"
        value={formData.companyName}
        onChange={handleChange}
        error={errors.companyName}
        required
        placeholder="Acme Inc."
      />

      <FormInput
        label="Company Email"
        name="companyEmail"
        type="email"
        value={formData.companyEmail}
        onChange={handleChange}
        error={errors.companyEmail}
        required
        placeholder="contact@acme.com"
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
    </motion.div>
  );
};

export default StepOne;
