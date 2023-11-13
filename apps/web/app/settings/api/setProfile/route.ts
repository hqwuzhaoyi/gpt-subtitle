import { backendURL, getToken } from "@/lib/request";

export async function POST(request: Request) {
  const token = await getToken();
  const body = await request.json();
  console.log(body);
  const res = await fetch(backendURL + "/auth/updateProfile", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token.accessToken}`,
    },
    body: JSON.stringify(body),
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
