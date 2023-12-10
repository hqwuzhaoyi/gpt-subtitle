import { backendURL } from "@/lib/request";
import { getToken } from "@/lib/getToken";

export async function getProfile() {
  const token = await getToken();
  const res = await fetch(backendURL + "/auth/profile", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token.accessToken}`,
    },
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
  const token = await getToken();
  const res = await fetch(backendURL + "/config", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token.accessToken}`,
    },
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
