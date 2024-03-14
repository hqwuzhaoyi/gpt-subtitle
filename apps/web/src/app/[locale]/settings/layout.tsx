import { Metadata } from "next";
import Image from "next/image";

import { Separator } from "@/components/ui/separator";
import { SidebarNav } from "./components/sidebar-nav";
import { useTranslations } from "next-intl";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your account settings and set preferences.",
};

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const t = useTranslations("Settings");

  const sidebarNavItems = [
    {
      title: t("General"),
      href: "/settings",
    },

    {
      title: t("Server"),
      href: "/settings/server",
    },

    {
      title: t("Whisper"),
      href: "/settings/whisper",
    },
    {
      title: t("Appearance"),
      href: "/examples/forms/appearance",
      disabled: true,
    },
    {
      title: t("Notifications"),
      href: "/examples/forms/notifications",
      disabled: true,
    },
    {
      title: t("Display"),
      href: "/examples/forms/display",
      disabled: true,
    },
  ];

  return (
    <div className="container relative p-10">
      <section>
        <div className="overflow-hidden rounded-[0.5rem] border bg-background shadow-xl">
          <div className="hidden space-y-6 p-10 pb-16 md:block">
            <div className="space-y-0.5">
              <h2 className="text-2xl font-bold tracking-tight">
                {t("title")}
              </h2>
              <p className="text-muted-foreground">{t("description")}</p>
            </div>
            <Separator className="my-6" />
            <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
              <aside className="-mx-4 lg:w-1/5">
                <SidebarNav items={sidebarNavItems} />
              </aside>
              <div className="flex-1 lg:max-w-2xl">{children}</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
