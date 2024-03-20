import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "components/ui/tooltip";
import { Eye, View } from "lucide-react";
import { useTranslations } from "next-intl";

export const PreviewCircle = ({
  className,
  url,
}: {
  className?: string;
  url: string;
}) => {
  const t = useTranslations("Gallery");
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Eye
            className={cn("", className)}
            onClick={() => {
              window.open(url);
            }}
          ></Eye>
        </TooltipTrigger>
        <TooltipContent>
          <p>{t("Preview")}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
