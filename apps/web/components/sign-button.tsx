"use client";

import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Link } from "lib/navigation";

export const SignButton = async () => {
  const pathname = usePathname();

  if (pathname === "/login") {
    return (
      <Link href="/signup">
        <Button variant="outline">Sign Up</Button>
      </Link>
    );
  } else {
    return (
      <Link href="/login">
        <Button variant="outline">Login</Button>
      </Link>
    );
  }
};
