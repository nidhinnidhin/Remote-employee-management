import SuperAdminLoginForm from "@/components/super-admin/auth/login";
import { checkSuperAdminAuth } from "@/lib/auth/super-admin-auth";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Super admin login | Employee management tool",
  description: "Login into your super admin portal.",
};


export default async function SuperAdminLoginPage() {
  // If already authenticated, redirect to companies page
  const isAuthenticated = await checkSuperAdminAuth();

  if (isAuthenticated) {
    redirect("/super-admin/companies");
  }

  return <SuperAdminLoginForm />;
}