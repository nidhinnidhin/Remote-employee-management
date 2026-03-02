"use server";

import { getServerApi } from "@/lib/axios/axiosServer";

export async function resendInvitationAction(employeeId: string) {
    try {
        const api = await getServerApi();
        await api.post(`/company/employees/${employeeId}/resend-invite`);
        return { success: true };
    } catch (error: any) {
        console.error("Resend invitation error:", error.response?.data || error.message);
        return {
            success: false,
            error: error.response?.status === 401
                ? "You are not authorized to perform this action."
                : "Failed to resend invitation. Please try again."
        };
    }
}
