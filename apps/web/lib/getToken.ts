import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export const getToken = async () => {
  const session: any = await getServerSession(authOptions);

  return session;
};
