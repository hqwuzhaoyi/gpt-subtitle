"use client";
import { StyleSwitcher } from "@/components/style-switcher";
import { useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import UploadPage from "./preview/upload/page";
import { HomeNav } from "@/components/home-nav";
console.debug('server port ',process.env.SERVER_PORT)
export default function Example() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="container relative pb-10">
      <StyleSwitcher />
      <PageHeader>
        <PageHeaderHeading>Translate your subtitles.</PageHeaderHeading>
        <PageHeaderDescription>
          Implemented online subtitle translation function, supporting multiple
          language translations. It can easily translate English subtitles into
          subtitles of other languages.
        </PageHeaderDescription>
        <div className="flex w-full items-center space-x-4 pb-8 pt-4 md:pb-10">
          <Link href="/docs" className={cn(buttonVariants())}>
            Get Started
          </Link>
          <Link
            target="_blank"
            rel="noreferrer"
            href={siteConfig.links.github}
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            <Icons.gitHub className="mr-2 h-4 w-4" />
            GitHub
          </Link>
        </div>
      </PageHeader>
      <HomeNav className="[&>a:first-child]:text-primary" />
      <section className="hidden md:block">
        <div className="overflow-hidden rounded-lg border bg-background shadow-xl">
          <UploadPage />
        </div>
      </section>
    </div>
  );
}
