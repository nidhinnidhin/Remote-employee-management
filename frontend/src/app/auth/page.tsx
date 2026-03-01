import Landing from "@/components/company/landing/landing";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Employee management tool",
};

const LoginPage = () => {
    return <Landing />;
};

export default LoginPage;
