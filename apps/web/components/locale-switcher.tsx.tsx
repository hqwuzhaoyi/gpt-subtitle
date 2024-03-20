import { useLocale, useTranslations } from "next-intl";
import { locales } from "lib/navigation";
import LocaleSwitcherSelect from "./locale-switcher-select";
import { DropdownMenuRadioItem } from "@/components/ui/dropdown-menu";

export default function LocaleSwitcher() {
  const t = useTranslations("LocaleSwitcher");
  const locale = useLocale();

  return (
    <LocaleSwitcherSelect defaultValue={locale} label={t("label")}>
      {locales.map((cur) => (
        <DropdownMenuRadioItem key={cur} value={cur}>
          {t("locale", { locale: cur })}
        </DropdownMenuRadioItem>
      ))}
    </LocaleSwitcherSelect>
  );
}
