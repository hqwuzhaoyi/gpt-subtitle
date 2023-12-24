import { cookies } from "next/headers";

export function customServerFetch(url: string, options = {}) {
  const cookieStore = cookies();
  const proxyUrl = cookieStore.get("proxyUrl")?.value;

  if (!proxyUrl) {
    console.error("proxyUrl not found");
    throw new Error("proxyUrl not found");
  }

  // 获取proxyUrl

  // 将proxyUrl与原始URL结合
  const fullUrl = proxyUrl ? `${proxyUrl}${url}` : url;

  console.log("fullUrl", fullUrl);

  // 调用原生fetch函数
  return fetch(fullUrl, options);
}

export const customServerGet = (url: string, options = {}) => {
  return customServerFetch(url, {
    ...options,
    method: "GET",
  });
};

export const customServerPost = (url: string, body: any, options = {}) => {
  return customServerFetch(url, {
    ...options,
    method: "POST",
    body,
  });
};
