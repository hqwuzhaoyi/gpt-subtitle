import { customFetch } from "@/lib/clientFetch";
import { ProfileFormValues, WhisperValues } from "../data/schema";

export async function updateWhisper(data: WhisperValues) {
  const res = await customFetch("/auth/updateWhisper", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    console.error("getProfile error", res);
    throw new Error("Failed to fetch data");
  }
}

export async function setProfile(data: ProfileFormValues) {
  const res = await customFetch("/auth/updateProfile", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    console.error("getProfile error", res);
    throw new Error("Failed to fetch data");
  }
}

export async function getWhisper(): Promise<WhisperValues> {
    const res = await customFetch("/auth/getWhisper");
    return res.json();
  }
