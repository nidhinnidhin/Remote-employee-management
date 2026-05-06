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

    // Parse set-cookie headers in a single pass — forward cookies AND extract for session
    let parsedRefreshToken: string | undefined;
    const setCookieHeaders = response.headers["set-cookie"];
    if (setCookieHeaders) {
        for (const cookieStr of setCookieHeaders) {
            const [nameValue] = cookieStr.split(";");
            const eqIdx = nameValue.indexOf("=");
            const name = nameValue.substring(0, eqIdx).trim();
            const value = nameValue.substring(eqIdx + 1).trim();

            if (name === "refresh_token") {
                parsedRefreshToken = value;
                await setRefreshTokenCookie(value);
            } else if (name === "access_token") {
                await setAccessTokenCookie(value);
            }
        }
    }

    // Save user info to iron-session so middleware & requireAuth work
    if (accessToken && user) {
        const session = await getSession();
        session.accessToken = accessToken;
        session.refreshToken = parsedRefreshToken;
        session.userId = user.id;
        session.role = user.role;
        session.email = user.email;
        await session.save();
    }

    return { success: true, user };
}
