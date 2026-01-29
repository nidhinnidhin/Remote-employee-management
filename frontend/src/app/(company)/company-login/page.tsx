import LoginForm from "@/components/company/auth/company-login/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Login | Employee management tool",
    description: "Sign in to your IssueHub account",
};

const LoginPage = () => {
    return <LoginForm />;
};

export default LoginPage;
