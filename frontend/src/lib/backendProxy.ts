// src/lib/backendProxy.ts
import axios from "axios";
import { NextResponse } from "next/server";

export async function proxyToBackend(
  req: Request,
  path: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "POST"
) {
  const body = method !== "GET" ? await req.json() : undefined;
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const backendRes = await axios({
    url: `${BACKEND_URL}${path}`,
    method,
    data: body,
    withCredentials: true,
    headers: {
      Cookie: req.headers.get("cookie") || "",
    },
  });

  const response = NextResponse.json(backendRes.data, {
    status: backendRes.status,
  });

  const setCookie = backendRes.headers["set-cookie"];

  if (setCookie) {
    // Axios returns array → browser expects a single header string
    response.headers.set("set-cookie", setCookie.join(", "));
  }

  return response;
}
