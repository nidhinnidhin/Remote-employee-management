import type { SessionOptions } from "iron-session";

export interface SessionData {
  accessToken?: string;
  refreshToken?: string;
  userId?: string;
  role?: string;
  email?: string;
  companyId?: string;
  isOnboarded?: boolean;
}

const sessionPassword = process.env.SESSION_SECRET || "";

// LOCAL_DEV=true is set in docker-compose.local.yml for local Docker runs.
// We CANNOT use NODE_ENV here because:
//   1. The frontend Dockerfile sets ENV NODE_ENV=production in the production stage.
//   2. Next.js standalone server.js re-enforces NODE_ENV=production at startup.
// So NODE_ENV is always "production" inside the container regardless of the environment.
// LOCAL_DEV is our safe, explicit local-dev signal that production never has.
const isLocalDev = process.env.LOCAL_DEV === "true";
const isProd = !isLocalDev;

export const sessionOptions: SessionOptions = {
  cookieName: "app_session",
  password: sessionPassword,
  cookieOptions: {
    httpOnly: true,
    // sameSite "none" requires secure:true (HTTPS).
    // On local HTTP (localhost:3000) browsers silently drop cookies with sameSite:none.
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    domain: isProd ? ".nidhintech.site" : undefined,
    path: "/",
  },
};