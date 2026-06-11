"use server";

import { getServerApi } from "@/lib/axios/axiosServer";
import { API_ROUTES } from "@/constants/api.routes";

export async function resendInvitationAction(employeeId: string) {
    try {
        const api = await getServerApi();
        await api.post(API_ROUTES.COMPANY.EMPLOYEES.RESEND_INVITE(employeeId));
        return { success: true };
    } catch (error: unknown) {
        const err = error as { response?: { status?: number; data?: { message?: string } }; message?: string };
        console.error("Resend invitation error:", err.response?.data || err.message);
        return {
            success: false,
            error: err.response?.status === 401
                ? "You are not authorized to perform this action."
                : "Failed to resend invitation. Please try again."
        };
    }
}
