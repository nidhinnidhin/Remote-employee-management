"use server";

import { cookies } from "next/headers";
import { getSession } from "@/lib/iron-session/getSession";
import {
    setRefreshTokenCookie,
    setAccessTokenCookie,
} from "@/lib/auth/cookies";
import axios from "axios";

export async function setEmployeePasswordAction(password: string) {
    // Read the invite session cookie to forward it to the backend
    const cookieStore = await cookies();
    const cookieHeader = cookieStore
        .getAll()
        .map((c) => `${c.name}=${c.value}`)
        .join("; ");

    const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/company/employees/set-password`,
        { password },
        {
            headers: {
                Cookie: cookieHeader,
            },
        }
    );

    const { accessToken, user } = response.data;

    // Forward HTTP-only cookies set by the backend (access_token, refresh_token)
    const setCookieHeader = response.headers["set-cookie"];
    if (setCookieHeader) {
        for (const cookieStr of setCookieHeader) {
            const [nameValue] = cookieStr.split(";");
            const [name, value] = nameValue.split("=");
            const trimmedName = name.trim();

            if (trimmedName === "refresh_token") {
                await setRefreshTokenCookie(value);
            } else if (trimmedName === "access_token") {
                await setAccessTokenCookie(value);
            }
        }
    }

    // Save user info to iron-session so middleware & requireAuth work
    if (accessToken && user) {
        const session = await getSession();
        session.accessToken = accessToken;
        session.userId = user.id;
        session.role = user.role;
        session.email = user.email;
        await session.save();
    }

    return { success: true, user };
}
