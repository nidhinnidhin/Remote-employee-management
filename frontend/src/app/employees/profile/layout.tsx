import { getServerApi } from "@/lib/axios/axiosSeriver";
import AuthHydrator from "@/store/AuthHydrator";
import { redirect } from "next/navigation";

export default async function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user = null;

  try {
    const api = await getServerApi();
    const res = await api.get("/auth/me");
    user = res.data;
  } catch (err: any) {
    redirect("/company/login");
  }

  return <AuthHydrator user={user}>{children}</AuthHydrator>;
}