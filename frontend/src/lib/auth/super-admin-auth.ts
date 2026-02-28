"use server";

import { getSession } from "@/lib/iron-session/getSession";
import { redirect } from "next/navigation";

/**
 * Check if user is authenticated as Super Admin
 * Redirects to login page if not authenticated
 */
export async function requireSuperAdminAuth() {
    const session = await getSession();

    if (!session.accessToken) {
        redirect("/super-admin/login");
    }

    return session;
}

/**
 * Check if user is authenticated (returns boolean, no redirect)
 */
export async function checkSuperAdminAuth(): Promise<boolean> {
    const session = await getSession();
    return !!session.accessToken;
}
