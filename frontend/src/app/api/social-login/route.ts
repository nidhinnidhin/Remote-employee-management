import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/iron-session/session";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const backendRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/social-login`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  if (!backendRes.ok) {
    return NextResponse.json(
      { error: "Backend social login failed" },
      { status: 401 }
    );
  }

  const data = await backendRes.json();

  const response = NextResponse.json({ success: true });

  const session = await getIronSession<SessionData>(
    req,
    response,
    sessionOptions
  );

  session.accessToken = data.accessToken;
  session.refreshToken = data.refreshToken;
  session.user = data.user;
  session.isLoggedIn = true;

  await session.save();

  return response;
}
