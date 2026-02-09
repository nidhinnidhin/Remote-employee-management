import LoginForm from "@/components/company/auth/login/LoginForm";
import { checkAuth, getCurrentUser } from "@/lib/auth/unified-auth";
import { getRedirectForRole } from "@/lib/auth/auth-constants";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Login | Employee management tool",
    description: "Sign in to your IssueHub account",
};

const LoginPage = async () => {
    // If already authenticated, redirect to appropriate dashboard
    const isAuthenticated = await checkAuth();

    if (isAuthenticated) {
        const user = await getCurrentUser();
        if (user?.role) {
            const redirectUrl = getRedirectForRole(user.role);
            redirect(redirectUrl);
        }
    }

    return <LoginForm />;
};

export default LoginPage;
