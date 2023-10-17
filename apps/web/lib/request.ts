import axios from "axios";
import { getSession } from "next-auth/react";

export const request = axios.create({
  // .. configure axios baseURL
  baseURL: process.env.NEXT_PUBLIC_API_URL || `http://localhost:3001`,
});

request.interceptors.request.use(async (request) => {
  const session = await getSession();
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
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
