"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BaseLoginForm from "@/components/ui/BaseLoginForm";

import { AUTH_MESSAGES } from "@/shared/constants/messages/auth.messages";
import {
  AdminLoginErrors,
  AdminLoginFormData,
} from "@/shared/types/superadmin/auth/login-form-data.type";
import { loginAction } from "@/actions/auth/login.action";
import { validateAdminLogin } from "@/lib/validations/client/auth/login-validation";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const validationErrors = validateAdminLogin(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }

    try {
      const result = await loginAction(formData.email, formData.password);

      if (result && !result.success) {
        setErrors({ form: result.error || AUTH_MESSAGES.LOGIN_FAILED });
        return;
      }

      // Role-based redirect is handled by loginAction
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
