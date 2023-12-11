import { postFetch } from "@/lib/fetch";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, response: NextResponse) {
  const body = await request.json();
  console.log(body);
  const res = await postFetch("/auth/updateProfile", JSON.stringify(body), {
    req: request,
    res: response,
  });
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    console.error("setProfile error", res);
    throw new Error("Failed to fetch data");
  }

  const data = await res.json();

  return Response.json(data);
}
