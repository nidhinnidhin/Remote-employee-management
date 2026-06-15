import axios from "axios";
import { cookies } from "next/headers";
import { getSession } from "@/lib/iron-session/getSession";
import { COOKIE_KEYS } from "@/shared/constants/temp/cookie-keys";

const BASE_URL = process.env.API_URL_INTERNAL || "http://localhost:4000/api";

export async function getServerApi() {
  const session = await getSession();

  if (!session.accessToken) {
    throw new Error("Unauthorized");
  }

  const api = axios.create({
    baseURL: BASE_URL,
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
  });

  api.interceptors.response.use(
    (res) => {
      if (
        res.data &&
        typeof res.data === 'object' &&
        res.data.success === true &&
        'data' in res.data &&
        'message' in res.data
      ) {
        res.data = res.data.data;
      }
      return res;
    },
    async (error) => {
      if (error.response?.status === 403) {
        error.isSuspended = true;
        return Promise.reject(error);
      }

      if (error.response?.status === 401) {
        return Promise.reject(error);
      }

      return Promise.reject(error);
    }
  );

  return api;
}