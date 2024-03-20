import { createSharedPathnamesNavigation } from "next-intl/navigation";

export const locales = ["cn", "en"] as const;
export const defaultLocale = "cn" as const;
export const localePrefix = "always"; // Default



export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation({ locales, localePrefix });
