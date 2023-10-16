"use client";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import React from "react";
import { signOut, signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const SigningButton = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  if (session?.user) {
    return (
      <div className="flex flex-row items-center gap-2">
        <p className="text-sm font-medium leading-none">{session.user.name}</p>

        <Button
          variant="outline"
          onClick={() => {
            signOut({ redirect: false }).then(() => {
              router.push("/"); // Redirect to the home page after signing out
            });
          }}
        >
          Sign Out
        </Button>
      </div>
    );
  }
  return (
    <Link href="/login">
      <Button variant="outline">Login</Button>
    </Link>
  );
};
