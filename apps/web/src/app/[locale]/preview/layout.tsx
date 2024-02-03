import { Metadata } from "next";
import { unstable_setRequestLocale } from "next-intl/server";
// import { Link } from "lib/navigation";
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
};

interface ExamplesLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default function ExamplesLayout({
  children,
  params: { locale },
}: ExamplesLayoutProps) {
  unstable_setRequestLocale(locale);
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
