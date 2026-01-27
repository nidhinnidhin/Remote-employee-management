import type { Metadata } from "next";
import "../globals.css";
import ClientLayout from "./client-layout";

export const metadata: Metadata = {
  title: "Employee Management Tool",
  description: "SaaS Employee Management Application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
