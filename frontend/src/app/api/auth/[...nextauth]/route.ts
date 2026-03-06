import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import GitHubProvider from "next-auth/providers/github";
import { getSession } from "@/lib/iron-session/getSession";
import { setAccessTokenCookie, setRefreshTokenCookie } from "@/lib/auth/cookies";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "email public_profile",
        },
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user, account }: any) {
      console.log("SignIn callback triggered for:", user.email);
      const email = user.email?.toLowerCase();
      const res = await fetch("http://localhost:4000/api/auth/social-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          firstName: user.name?.split(" ")[0] || user.name || "User",
          lastName: user.name?.split(" ").slice(1).join(" ") || "",
          provider: account?.provider,
          providerId: account?.providerAccountId,
        }),
      });

      console.log("Backend response status:", res.status);

      if (!res.ok) {
        const data = await res.json();
        console.log("Login failed, redirecting with error:", data.message);
        return `/auth/login?error=${encodeURIComponent(data.message || "Login failed")}`;
      }

      const data = await res.json().catch(() => null);

      console.log("-----------------------------------------");
      console.log(" NEXTAUTH SIGNIN CALLBACK");
      console.log(" Email:", user.email);
      console.log(" DATA FULL JSON:", JSON.stringify(data, null, 2));
      console.log(" IsOnboarded from Backend:", data?.user?.isOnboarded);
      console.log(" AccessToken Present:", !!data?.accessToken);
      console.log("-----------------------------------------");

      if (!data) {
        return "/auth/login?error=Backend Error";
      }

      // Sync with Iron Session
      const session = await getSession();
      session.accessToken = data.accessToken;
      session.userId = data.user.id;
      session.role = data.user.role;
      session.email = data.user.email;
      session.companyId = data.user.companyId;
      session.isOnboarded = data.user.isOnboarded;
      await session.save();

      // Set backend cookies
      if (data.accessToken) await setAccessTokenCookie(data.accessToken);
      if (data.refreshToken) await setRefreshTokenCookie(data.refreshToken);

      console.log("Login successful & Session saved:", data.user.email, "isOnboarded:", data.user.isOnboarded);

      if (!data.user.isOnboarded && data.user.role === "COMPANY_ADMIN") {
        console.log(" Redirecting to ONBOARDING for userId:", data.user.id);
        return `/auth/onboarding?userId=${data.user.id}`;
      }

      // Redirect to correct dashboard based on role
      const ROLE_REDIRECTS: Record<string, string> = {
        SUPER_ADMIN: "/super-admin/companies",
        COMPANY_ADMIN: "/admin/dashboard", // Using dashboard as per user's preference
        EMPLOYEE: "/employee/dashboard",
      };

      return ROLE_REDIRECTS[data.user.role] || "/admin/dashboard";
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
});

export { handler as GET, handler as POST };
