import { ApiResponse } from "shared-types";

export const getProxyUrl = () => {
  if (typeof window !== "undefined") {
    const proxyUrl = localStorage.getItem("proxyUrl") || "";

    if (!proxyUrl) {
      console.error("proxyUrl not found");
      throw new Error("proxyUrl not found");
    }
    return proxyUrl;
  } else {
    console.error("getProxyUrl should not be called on client side");
  }
};

export async function customFetch<T>(
  url: string,
  options = {}
): Promise<ApiResponse<T>> {
  // 获取proxyUrl
  const proxyUrl = getProxyUrl();
  // 将proxyUrl与原始URL结合
  const fullUrl = proxyUrl ? `${proxyUrl}${url}` : url;

  // 调用原生fetch函数
  const response = await fetch(fullUrl, options);
  if (!response.ok) {
    if (response.status === 401) {
      // signOut({ redirect: false }).then(() => {
      //   window.location.href = "/login";
      // });
    }
    throw new Error("Network response was not ok");
  }
  const jsonResponse = (await response.json()) as ApiResponse<T>;
  if (!jsonResponse.success) {
    throw new Error(jsonResponse.message);
  }
  return jsonResponse;
}

export const customGet = <T>(url: string, options = {}) => {
  return customFetch<T>(url, {
    ...options,
    method: "GET",
  });
};

export const customPost = <T>(url: string, body: any, options = {}) => {
  return customFetch<T>(url, {
    ...options,
    method: "POST",
    body,
  });
};
