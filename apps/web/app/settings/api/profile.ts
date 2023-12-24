import { customServerGet } from "@/lib/serverFetch";

export async function getConfig() {
  const res = await customServerGet("/config");
  return res.json();
}
