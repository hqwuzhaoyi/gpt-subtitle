import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "components/ui/tooltip";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";

export const FinishedCircle = ({ className }: { className?: string }) => {
  const t = useTranslations("Gallery");
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Check className={cn("", className)}></Check>
        </TooltipTrigger>
        <TooltipContent>
          <p>{t("Finished")}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
