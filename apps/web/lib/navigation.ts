import { createSharedPathnamesNavigation } from "next-intl/navigation";

export const locales = ["en", "de"] as const;
export const defaultLocale = "en" as const;
export const localePrefix = "always"; // Default

export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation({ locales, localePrefix });
