"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { useProxyUrlAtom } from "@/atoms/proxyUrl";

export function MainNav() {
  const pathname = usePathname();
  const proxyUrl = useProxyUrlAtom();


  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <Icons.logo className="h-6 w-6" />
        <span className="hidden font-bold sm:inline-block">
          {siteConfig.name}
        </span>
      </Link>
      <nav className="flex items-center space-x-6 text-sm font-medium">
        <Link
          href="/preview/tasks"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname === "/preview/tasks"
              ? "text-foreground"
              : "text-foreground/60"
          )}
        >
          Whisper Tasks
        </Link>
        <Link
          href="/preview/gallery"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname === "/preview/gallery"
              ? "text-foreground"
              : "text-foreground/60"
          )}
        >
          Gallery
        </Link>
        <Link
          href="/preview/translate"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/preview/translate")
              ? "text-foreground"
              : "text-foreground/60"
          )}
        >
          Subtitle Translate
        </Link>
        <Link
          href={proxyUrl + "/queues"}
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.includes("/queues")
              ? "text-foreground"
              : "text-foreground/60"
          )}
        >
          Queues
        </Link>
      </nav>
    </div>
  );
}
