import axios from "axios";
import { getProxyUrl } from "./clientFetch";

export const request = axios.create({
  // .. configure axios baseURL
  baseURL: getProxyUrl(),
});

request.interceptors.request.use(async (request) => {
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

      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
