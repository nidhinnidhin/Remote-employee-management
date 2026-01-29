import RegistrationStepper from "@/components/company/auth/company-registration/RegistrationStepper";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Register Your Company | Employee management tool",
    description: "Register in to your Employee management tool account",
};

export default function Home() {
  return <RegistrationStepper />;
}