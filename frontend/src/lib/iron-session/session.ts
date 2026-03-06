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

const sessionPassword = process.env.SESSION_SECRET;

if (!sessionPassword || sessionPassword.length < 32) {
  throw new Error(
    'SESSION_SECRET env variable is missing or less than 32 characters'
  );
}

export const sessionOptions: SessionOptions = {
  cookieName: "app_session",
  password: sessionPassword,
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  },
};