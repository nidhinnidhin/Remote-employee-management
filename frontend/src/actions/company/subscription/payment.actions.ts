"use server";

import { getServerApi } from "@/lib/axios/axiosServer";
import { API_ROUTES } from "@/constants/api.routes";

export async function createPaymentOrderAction(planId: string, companyId: string) {
    try {
        const api = await getServerApi();
        const response = await api.post('/subscriptions/create-order', { planId, companyId });
        return { success: true, data: response.data };
    } catch (error: unknown) {
        const err = error as any;
        const errorMessage = err?.response?.data?.message || err?.message || "Failed to create order";
        return { success: false, error: errorMessage };
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
    } catch (error: unknown) {
        const err = error as any;
        const errorMessage = err?.response?.data?.message || err?.message || "Payment verification failed";
        return { success: false, error: errorMessage };
    }
}

export async function getSubscriptionPlansAction(activeOnly: boolean = true) {
    try {
        const api = await getServerApi();
        const response = await api.get(`/subscription-plans?activeOnly=${activeOnly}`);
        return { success: true, data: response.data };
    } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string } }; message?: string };
        return { success: false, error: err.response?.data?.message || "Failed to load subscription plans" };
    }
}

export async function getCurrentSubscriptionAction(companyId: string) {
    try {
        const api = await getServerApi();
        const response = await api.get(`/subscriptions/current/${companyId}`);
        return { success: true, data: response.data };
    } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string } }; message?: string };
        return { success: false, error: err.response?.data?.message || "Failed to load current subscription" };
    }
}
