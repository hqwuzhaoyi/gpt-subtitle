export const getProxyUrl = () => {
  const proxyUrl = localStorage.getItem("proxyUrl") || "";

  if (!proxyUrl) {
    console.error("proxyUrl not found");
    throw new Error("proxyUrl not found");
  }
  return proxyUrl;
};

export function customFetch(url: string, options = {}) {
  // 获取proxyUrl
  const proxyUrl = getProxyUrl();
  // 将proxyUrl与原始URL结合
  const fullUrl = proxyUrl ? `${proxyUrl}${url}` : url;

  // 调用原生fetch函数
  return fetch(fullUrl, options);
}

export const customGet = (url: string, options = {}) => {
  return customFetch(url, {
    ...options,
    method: "GET",
  });
};

export const customPost = (url: string, body: any, options = {}) => {
  return customFetch(url, {
    ...options,
    method: "POST",
    body,
  });
};
