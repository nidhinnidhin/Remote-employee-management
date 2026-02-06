"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BaseLoginForm from "@/components/ui/BaseLoginForm";

import { AUTH_MESSAGES } from "@/shared/constants/messages/auth.messages";
import { superAdminLoginAction } from "@/app/actions/superadmin/auth/login.action";
import {
  AdminLoginErrors,
  AdminLoginFormData,
} from "@/shared/types/superadmin/auth/login-form-data.type";

export default function SuperAdminLoginForm() {
  const [formData, setFormData] = useState<AdminLoginFormData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<AdminLoginErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof AdminLoginErrors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors: AdminLoginErrors = {};

    if (!formData.email) {
      newErrors.email = AUTH_MESSAGES.EMAIL_MISSING;
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = AUTH_MESSAGES.INVALID_EMAIL;
    }

    if (!formData.password) {
      newErrors.password = AUTH_MESSAGES.PASSWORD_REQUIRED;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }

    try {
      const result = await superAdminLoginAction(formData);

      if (!result?.success) {
        setErrors({ form: result?.error || AUTH_MESSAGES.LOGIN_FAILED });
        return;
      }

      router.replace("/super-admin/dashboard");
    } catch (err: any) {
      setErrors({ form: err.message || AUTH_MESSAGES.LOGIN_FAILED });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BaseLoginForm
      title="Super Admin Login"
      formData={formData}
      errors={errors}
      isLoading={isLoading}
      onChange={handleChange}
      onSubmit={handleSubmit}
    />
  );
}
