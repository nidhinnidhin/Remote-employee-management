"use server";

import { getSession } from "@/lib/iron-session/getSession";
import { redirect } from "next/navigation";
import { getRedirectForRole } from "./auth-constants";

/**
 * Check if user is authenticated (any role)
 * Returns session if authenticated, redirects to login if not
 */
export async function requireAuth() {
    const session = await getSession();

    if (!session.accessToken || !session.role) {
        redirect("/auth/login");
    }

    return session;
}

/**
 * Check if user has a specific role
 * Redirects to login if not authenticated
 * Redirects to appropriate dashboard if wrong role
 */
export async function requireRole(requiredRole: string) {
    const session = await getSession();

    // Not authenticated
    if (!session.accessToken || !session.role) {
        redirect("/auth/login");
    }

    // Wrong role - redirect to their own dashboard
    if (session.role !== requiredRole) {
        const correctRedirect = getRedirectForRole(session.role);
        redirect(correctRedirect);
    }

    return session;
}

/**
 * Check if user is authenticated without redirecting
 */
export async function checkAuth(): Promise<boolean> {
    const session = await getSession();
    return !!(session.accessToken && session.role);
}

/**
 * Get current user session
 */
export async function getCurrentUser() {
    const session = await getSession();

    if (!session.accessToken) {
        return null;
    }

    return {
        userId: session.userId,
        role: session.role,
        email: session.email,
    };
}

/**
 * Logout user by clearing session
 */
export async function logout() {
    const session = await getSession();
    session.destroy();
    redirect("/auth/login");
}
