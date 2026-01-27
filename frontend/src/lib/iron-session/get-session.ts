import { getSession } from "./getSession";

export async function GET() {
  const session = await getSession();
  console.log("SESSION DATA:", session);

  return Response.json({
    accessToken: session.accessToken ?? null,
  });
}
