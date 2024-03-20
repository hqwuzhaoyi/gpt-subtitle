"use client";

import clsx from "clsx";
import { ChangeEvent, ReactNode, useTransition } from "react";
import { useRouter, usePathname } from "lib/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GlobeIcon } from "lucide-react";

type Props = {
  children: ReactNode;
  defaultValue: string;
  label: string;
};

export default function LocaleSwitcherSelect({
  children,
  defaultValue,
  label,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();

  function onSelectChange(nextLocale: string) {
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  }

  // return (
  //   <label
  //     className={clsx(
  //       "relative text-gray-400",
  //       isPending && "transition-opacity [&:disabled]:opacity-30"
  //     )}
  //   >
  //     <p className="sr-only">{label}</p>
  //     <select
  //       className="inline-flex appearance-none bg-transparent py-3 pl-2 pr-6"
  //       defaultValue={defaultValue}
  //       disabled={isPending}
  //       onChange={onSelectChange}
  //     >
  //       {children}
  //     </select>
  //     <span className="pointer-events-none absolute right-2 top-[8px]">⌄</span>
  //   </label>
  // );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={isPending}>
        <Button
          className={clsx(
            isPending && "transition-opacity [&:disabled]:opacity-30",
            "w-9 px-0"
          )}
          variant="ghost"
          size="sm"
        >
          <GlobeIcon className="h-5 w-5" />
          <span className="sr-only">Language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel className="sr-only">{label}</DropdownMenuLabel>
        <DropdownMenuSeparator className="sr-only" />

        <DropdownMenuRadioGroup
          defaultValue={defaultValue}
          onValueChange={onSelectChange}
        >
          {children}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
