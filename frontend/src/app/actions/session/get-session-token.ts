"use server";

import { getSession } from "@/lib/iron-session/getSession";

export async function getSessionToken() {
  const session = await getSession();
  return session.accessToken || null;
}
