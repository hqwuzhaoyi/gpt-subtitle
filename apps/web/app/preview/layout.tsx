import { Metadata } from "next";
// import Link from "next/link";
// import { ChevronRight } from "lucide-react";

// import { cn } from "@/lib/utils";
// import { buttonVariants } from "@/components/ui/button";
// import {
//   PageHeader,
//   PageHeaderDescription,
//   PageHeaderHeading,
// } from "@/components/page-header";
// import { HomeNav } from "@/components/home-nav";
// import { siteConfig } from "@/config/site";
// import { Icons } from "@/components/icons";

export const metadata: Metadata = {
  title: "Subtitles",
  description: "Check out some examples app built using the components.",
};

interface ExamplesLayoutProps {
  children: React.ReactNode;
}

export default function ExamplesLayout({ children }: ExamplesLayoutProps) {
  return (
    <>
      <div className="container relative p-10">
        <section>
          {/* <HomeNav /> */}
          <div className="overflow-hidden rounded-[0.5rem] border bg-background shadow-xl">
            {children}
          </div>
        </section>
      </div>
    </>
  );
}
