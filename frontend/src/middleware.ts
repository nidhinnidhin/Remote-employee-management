import { getSession } from "@/lib/iron-session/getSession";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const session = await getSession();

  if (!session.accessToken && req.nextUrl.pathname.startsWith("/employees/dashboard")) {
    return NextResponse.redirect(new URL("/company/login", req.url));
  }
}
