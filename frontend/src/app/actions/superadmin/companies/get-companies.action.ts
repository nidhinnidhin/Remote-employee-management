"use server";

import { getSession } from "@/lib/iron-session/getSession";
import { CompanyApi } from "@/shared/types/superadmin/companies/company.type";

// Backend API URL - hardcoded since NEXT_PUBLIC_ vars might not be available in server actions
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export async function getCompaniesAction(): Promise<CompanyApi[]> {
    try {
        // Get access token from iron-session
        const session = await getSession();

        console.log("[getCompaniesAction] Session data:", {
            hasAccessToken: !!session.accessToken,
            tokenLength: session.accessToken?.length,
            tokenPreview: session.accessToken?.substring(0, 20) + "..."
        });

        if (!session.accessToken) {
            throw new Error("No access token found. Please login again.");
        }

        // Make authenticated request to backend
        const res = await fetch(`${BACKEND_URL}/super-admin/companies`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session.accessToken}`,
            },
            cache: "no-store", // Disable caching for fresh data
        });

        console.log("[getCompaniesAction] Response status:", res.status);

        if (!res.ok) {
            const error = await res.text();
            console.error("Backend error:", error);
            if (res.status === 401) {
                throw new Error("Unauthorized. Please login again.");
            }
            throw new Error(`Failed to fetch companies: ${res.status}`);
        }

        const data = await res.json();
        return data.data;
    } catch (error) {
        console.error("Error in getCompaniesAction:", error);
        throw error;
    }
}
