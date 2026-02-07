import SuperAdminLoginForm from "@/components/super-admin/auth/login";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Super admin login | Employee management tool",
    description: "Login into your super admin portal.",
};


export default function AdminLoginPage() {
  return <SuperAdminLoginForm />;
}