import { customFetch } from "@/lib/clientFetch";
import { ProfileFormValues, WhisperValues } from "../data/schema";
import { WhisperModel } from "shared-types";

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

export async function downloadWhisper({
  force = false,
  makeType,
}: {
  force?: boolean;
  makeType: string;
}) {
  const res = await customFetch("/whisper/firstSetUp", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    // body: JSON.stringify({ force, makeType }),
    body: JSON.stringify({ force, makeType }),
  });
}

export type WhisperModelDto = {
  model: WhisperModel;
  makeType: string;
};
export async function downloadModel({ model, makeType }: WhisperModelDto) {
  const res = await customFetch("/whisper/downloadModel", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    // body: JSON.stringify({ force, makeType }),
    body: JSON.stringify({
      model,
      makeType,
    }),
  });
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

export async function getConfig(): Promise<Record<string, string>> {
  const res = await customFetch<Record<string, string>>("/config");
  return res?.data;
}
