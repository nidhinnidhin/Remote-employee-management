"use server";

import { getSession } from "@/lib/iron-session/getSession";

export async function getSessionData() {
  const session = await getSession();
  return {
    token: session.accessToken || null,
    userId: session.userId || null,
    isOnboarded: session.isOnboarded || false,
  };
}
