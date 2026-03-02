"use server";

import { getServerApi } from "@/lib/axios/axiosServer";
import { getSession } from "@/lib/iron-session/getSession";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { COOKIE_KEYS } from "@/shared/constants/temp/cookie-keys";
import { API_ROUTES } from "@/constants/api.routes";
import { FRONTEND_ROUTES } from "@/constants/frontend.routes";

export async function logoutAction() {
    const session = await getSession();
    const role = session.role;

    try {
        // 1️⃣ Call backend logout to clear server cookies if possible
        const api = await getServerApi();
        await api.post(API_ROUTES.AUTH.LOGOUT);
    } catch (error) {
        console.warn("Backend logout failed or was already unauthorized:", error);
    }

    // 2️⃣ Clear iron session
    session.destroy();

    // 3️⃣ Clear access and refresh cookies from client-side if they still exist
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_KEYS.ACCESS_TOKEN);
    cookieStore.delete(COOKIE_KEYS.REFRESH_TOKEN);

    // 4️⃣ Redirect based on role
    if (role === "SUPER_ADMIN") {
        redirect(FRONTEND_ROUTES.SUPER_ADMIN.LOGIN);
    } else {
        redirect(FRONTEND_ROUTES.AUTH.LOGIN);
    }
}
