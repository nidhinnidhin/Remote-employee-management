"use client";

import AuthLayout from "@/components/auth/company-admin/login/AuthLayout";
import AuthLeftPanel from "@/components/auth/company-admin/login/AuthLeftPanel";
import AuthRightPanel from "@/components/auth/company-admin/login/AuthRightPanel";
import LoginForm from "@/components/auth/company-admin/login/LoginForm";


export default function CompanyAdminLoginPage() {
//   const handleLogin = (data: any) => {
//     console.log("Login Attempt:", data);
//     alert("Login functionality to be implemented.");
//   };

  return (
    <AuthLayout>
      <AuthLeftPanel />
      <AuthRightPanel>
        <LoginForm /*onSubmit={handleLogin}*/ />
      </AuthRightPanel>
    </AuthLayout>
  );
}