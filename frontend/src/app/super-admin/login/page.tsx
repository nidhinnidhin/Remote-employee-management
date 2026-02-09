import { redirect } from "next/navigation";

export default async function SuperAdminLoginPage() {
  redirect("/company/login");
}