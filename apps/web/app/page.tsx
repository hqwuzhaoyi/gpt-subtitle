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
import UploadPage from "./preview/translate/page";
import { HomeNav } from "@/components/home-nav";
console.debug("server port ", process.env.SERVER_PORT);
export default function Example() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="container relative p-10">
      <StyleSwitcher />
      {/* <HomeNav className="[&>a:first-child]:text-primary" /> */}
      <section className="hidden md:block">
        <div className="overflow-hidden rounded-lg border bg-background shadow-xl">
          <UploadPage />
        </div>
      </section>
    </div>
  );
}
