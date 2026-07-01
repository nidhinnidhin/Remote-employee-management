import SuperAdminLoginForm from "@/components/super-admin/auth/login";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Super Admin Login | Employee Management Tool",
  description: "Sign in to the Super Admin portal",
};

export default function SuperAdminLoginPage() {
  return (
    <div className="relative min-h-screen portal-page flex items-center justify-center">
      <div className="relative z-10 w-full max-w-md px-4">
        <SuperAdminLoginForm />
      </div>
    </div>
  );
}