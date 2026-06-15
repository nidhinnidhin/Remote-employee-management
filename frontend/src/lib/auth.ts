import { cookies } from "next/headers";
import axios from "axios";

export async function getMe() {
  const cookieStore = cookies();

  const res = await axios.get(
    `${process.env.API_URL_INTERNAL || "http://localhost:4000/api"}/users/me`,
    {
      headers: {
        Cookie: cookieStore.toString(),
      },
      withCredentials: true,
    }
  );

  return res.data;
}
