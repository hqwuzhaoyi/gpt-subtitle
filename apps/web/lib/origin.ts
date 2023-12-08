import { headers } from "next/headers";

export const origin = () => {
  const headersList = headers();
  const url = new URL(headersList.get("referer") ?? "");
  return url.origin;
};

export const originProxy = () => {
  return origin() + "/api/proxy";
};
