import { customFetch } from "@/lib/clientFetch";
import { ProfileFormValues, WhisperValues } from "../data/schema";
import { ApiResponse } from "shared-types";

export async function updateWhisper(data: WhisperValues) {
  const res = await customFetch("/auth/updateWhisper", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

export async function downloadWhisper({ force = false }) {
  const res = await customFetch(
    "/whisper/firstSetUp" + (force ? "?force=true" : ""),
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );
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
}

export async function getWhisper(): Promise<WhisperValues> {
  const res = await customFetch<WhisperValues>("/auth/getWhisper");
  return res?.data;
}
