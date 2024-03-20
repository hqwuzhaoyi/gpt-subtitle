"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { useProxyUrlAtom } from "@/atoms/proxyUrl";
import { Link } from "lib/navigation";
import { useTranslations } from "next-intl";

export function MainNav() {
  const pathname = usePathname();
  const proxyUrl = useProxyUrlAtom();
  const t = useTranslations("Nav");

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
          {t("Whisper Tasks")}
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
          {t("Gallery")}
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
          {t("Subtitle Translate")}
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
          {t("Queues")}
        </Link>
      </nav>
    </div>
  );
}
