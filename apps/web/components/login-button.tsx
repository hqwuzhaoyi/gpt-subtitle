"use client";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import React from "react";
import Link from "next/link";
import { UserNav } from "./user-nav";
import { User } from "next-auth";

export const SigningButton = () => {
  const { data: session, status } = useSession();
  if (status === "loading") return null;

  if (session?.user) {
    return <UserNav user={session?.user as User}></UserNav>;
  }
  return (
    <Link href="/login">
      <Button variant="outline">Login</Button>
    </Link>
  );
};
