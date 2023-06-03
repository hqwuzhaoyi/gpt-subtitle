import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import { HomeNav } from "@/components/home-nav";
import { siteConfig } from "@/config/site";
import { Icons } from "@/components/icons";

export const metadata: Metadata = {
  title: "Examples",
  description: "Check out some examples app built using the components.",
};

interface ExamplesLayoutProps {
  children: React.ReactNode;
}

export default function ExamplesLayout({ children }: ExamplesLayoutProps) {
  return (
    <>
      <div className="container relative pb-10">
        <PageHeader>
          <PageHeaderHeading>Translate your subtitles.</PageHeaderHeading>
          <PageHeaderDescription>
            Implemented online subtitle translation function, supporting
            multiple language translations. It can easily translate English
            subtitles into subtitles of other languages.
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
        <section>
          <HomeNav />
          <div className="overflow-hidden rounded-[0.5rem] border bg-background shadow-xl">
            {children}
          </div>
        </section>
      </div>
    </>
  );
}
