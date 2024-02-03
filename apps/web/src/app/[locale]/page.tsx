import { StyleSwitcher } from "@/components/style-switcher";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import UploadPage from "./preview/tasks/page";
import { unstable_setRequestLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "Gpt Subtitle",
};

type Props = {
  params: { locale: string };
};

export default function AppRootPage({ params: { locale } }: Props) {
  unstable_setRequestLocale(locale);
  const cookieStore = cookies();
  const proxyUrlHasBeenSet = cookieStore.get("proxyUrlHasBeenSet");

  if (!proxyUrlHasBeenSet) {
    redirect("/initial-setup");
  }

  return (
    <div className="container relative p-10">
      <StyleSwitcher />
      <section className="hidden md:block">
        <div className="overflow-hidden rounded-lg border bg-background shadow-xl">
          <UploadPage />
        </div>
      </section>
    </div>
  );
}
