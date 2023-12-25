import React from "react";
// import { UserNav } from "./user-nav";
// import { User, getServerSession } from "next-auth";
import { SignButton } from "./sign-button";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const UserSession = async () => {
  // const session = await getServerSession(authOptions);

  // if (session?.user) {
  //   return <UserNav user={session?.user as User}></UserNav>;
  // }
  return <SignButton />;
};
