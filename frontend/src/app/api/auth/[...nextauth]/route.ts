import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import GitHubProvider from "next-auth/providers/github";
import { getSession } from "@/lib/iron-session/getSession";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      console.log("SignIn callback triggered");
      const res = await fetch(
        "http://localhost:4000/api/auth/social-login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: user.email,
            firstName: user.name?.split(" ")[0] || "",
            lastName: user.name?.split(" ")[1] || "",
            provider: account?.provider,
            providerId: account?.providerAccountId,
          }),
        }
      );

      console.log("Backend response status:", res.status);

      if (!res.ok) {
        const data = await res.json();
        console.log("Login failed, redirecting with error:", data.message);
        return `/company/login?error=${encodeURIComponent(data.message || "Login failed")}`;
      }

      const data = await res.json();

      // Sync with Iron Session
      const session = await getSession();
      session.accessToken = data.accessToken;
      session.userId = data.user.id;
      session.role = data.user.role;
      session.email = data.user.email;
      await session.save();

      console.log("Login successful & Session saved");
      return true;
    },
  },
  pages: {
    signIn: "/company/login",
    error: "/company/login",
  },
});

export { handler as GET, handler as POST };
