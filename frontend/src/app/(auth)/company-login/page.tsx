import LoginForm from "@/components/auth/company-login/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Login | IssueHub",
    description: "Sign in to your IssueHub account",
};

const LoginPage = () => {
    return <LoginForm />;
};

export default LoginPage;
