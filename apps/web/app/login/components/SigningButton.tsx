import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import React from "react";
import { signOut, signIn } from "next-auth/react";

export const SigningButton = () => {
  const { data: session, status } = useSession();
  if (session?.user) {
    return (
      <div>
        <p>{session.user.name}</p>
        <Button variant="outline" onClick={() => signOut()}>
          Sign Out
        </Button>
      </div>
    );
  }
  return (
    <Button variant="outline" onClick={() => signIn()}>
      Login
    </Button>
  );
};
