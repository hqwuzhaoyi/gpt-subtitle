import axios from "axios";
import { getSession } from "next-auth/react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const backendURL =
  process.env.NEXT_PUBLIC_API_URL ||
  `http://localhost:3001`;

export const getToken = async () => {
  const session: any = await getServerSession(authOptions);

  return session;
};

export const request = axios.create({
  // .. configure axios baseURL
  baseURL: backendURL,
});

request.interceptors.request.use(async (request) => {
  const window = globalThis.window;

  const session = window ? await getSession() : await getToken();
  if (session) {
    request.headers.Authorization = `Bearer ${session.accessToken}`;
  }
  return request;
});

// 增加401的處理
request.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      // redirect to login page
      // 這裡可以用next/router
      const window = globalThis.window;
      if (window) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
