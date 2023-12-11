import { backendURL } from "@/lib/request";
import { getToken } from "@/lib/getToken";
import { originProxy } from "@/lib/origin";
import { getFetch } from "@/lib/fetch";
import { cookies } from "next/headers";
import { getCookies } from "cookies-next";

export async function getProfile() {
  const res = await getFetch("/auth/profile", {
    cookies: getCookies({ cookies }),
  });
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    console.error("getProfile error", res);
    throw new Error("Failed to fetch data");
  }

  return res.json();
}
export async function getConfig() {
  const res = await getFetch("/config", {
    cookies: getCookies({ cookies }),
  });
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    console.error("getProfile error", res);
    throw new Error("Failed to fetch data");
  }

  return res.json();
}
