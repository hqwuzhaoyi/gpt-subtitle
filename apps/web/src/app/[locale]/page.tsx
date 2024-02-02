import { useTranslations } from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";

import { StyleSwitcher } from "@/components/style-switcher";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import UploadPage from "./preview/tasks/page";

export const metadata: Metadata = {
  title: "Gpt Subtitle",
};

type Props = {
  params: { locale: string };
};

export default function AppRootPage({ params: { locale } }: Props) {
  const cookieStore = cookies();
  const proxyUrlHasBeenSet = cookieStore.get("proxyUrlHasBeenSet");

  if (!proxyUrlHasBeenSet) {
    redirect("/initial-setup");
  }

  const t = useTranslations("Index");

  return (
    <div className="container relative p-10">
      <StyleSwitcher />
      {/* <HomeNav className="[&>a:first-child]:text-primary" /> */}
      <section className="hidden md:block">
        <div className="overflow-hidden rounded-lg border bg-background shadow-xl">
          <h1>{t("title")}</h1>
          <UploadPage />
        </div>
      </section>
    </div>
  );
}
