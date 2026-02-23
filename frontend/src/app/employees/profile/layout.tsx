import AuthHydrator from "@/store/AuthHydrator";

export default async function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthHydrator>{children}</AuthHydrator>;
}