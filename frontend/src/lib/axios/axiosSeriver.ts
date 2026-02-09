import axios from "axios";
import { getSession } from "@/lib/iron-session/getSession";

export async function getServerApi() {
  const session = await getSession();

  if (!session.accessToken) {
    throw new Error("Unauthorized");
  }

  return axios.create({
    baseURL: process.env.BACKEND_API_URL,
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
  });
}
