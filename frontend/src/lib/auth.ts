import { cookies } from "next/headers";
import axios from "axios";

export async function getMe() {
  const cookieStore = cookies();

  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/users/me`,
    {
      headers: {
        Cookie: cookieStore.toString(),
      },
      withCredentials: true,
    }
  );

  return res.data;
}
