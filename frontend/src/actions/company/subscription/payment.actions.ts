"use server";

import { getServerApi } from "@/lib/axios/axiosServer";
import { API_ROUTES } from "@/constants/api.routes";

export async function createPaymentOrderAction(planId: string, companyId: string) {
    try {
        const api = await getServerApi();
        const response = await api.post('/subscriptions/create-order', { planId, companyId });
        return { success: true, data: response.data };
    } catch (error: any) {
        return { success: false, error: error.response?.data?.message || "Failed to create order" };
    }
}

export async function verifyPaymentAction(payload: {
    orderId?: string;
    paymentId?: string;
    signature?: string;
    planId: string;
    companyId: string;
    userId: string;
    isFree?: boolean;
}) {
    try {
        const api = await getServerApi();
        const response = await api.post('/subscriptions/verify-payment', payload);
        return { success: true, data: response.data };
    } catch (error: any) {
        return { success: false, error: error.response?.data?.message || "Payment verification failed" };
    }
}
