import { Metadata } from "next";
import Image from "next/image";

import { Separator } from "@/components/ui/separator";
import { SidebarNav } from "./components/sidebar-nav";

export const metadata: Metadata = {
  title: "Forms",
  description: "Advanced form example using react-hook-form and Zod.",
};

const sidebarNavItems = [
  {
    title: "General",
    href: "/settings",
  },
  {
    title: "Account",
    href: "/examples/forms/account",
    disabled: true,
  },
  {
    title: "Appearance",
    href: "/examples/forms/appearance",
    disabled: true,
  },
  {
    title: "Notifications",
    href: "/examples/forms/notifications",
    disabled: true,
  },
  {
    title: "Display",
    href: "/examples/forms/display",
    disabled: true,
  },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className="container relative p-10">
      <section>
        <div className="overflow-hidden rounded-[0.5rem] border bg-background shadow-xl">
          <div className="hidden space-y-6 p-10 pb-16 md:block">
            <div className="space-y-0.5">
              <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
              <p className="text-muted-foreground">
                Manage your account settings and set e-mail preferences.
              </p>
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
