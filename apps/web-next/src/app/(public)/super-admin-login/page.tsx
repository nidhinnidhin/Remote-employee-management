import LoginShell from "@/components/features/auth/loginShell";
import LoginForm from "@/components/features/auth/loginForm";
// import { loginSuperAdmin } from "@/server/actions/auth/login-super-admin";

export default function SuperAdminLoginPage() {
  return (
    <LoginShell
      title="Super Admin Login"
      subtitle="Access platform administration"
    >
      <LoginForm /* onSubmit={loginSuperAdmin}*/ />
    </LoginShell>
  );
}
