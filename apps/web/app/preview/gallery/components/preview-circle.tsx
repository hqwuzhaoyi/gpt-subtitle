import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "components/ui/tooltip";
import { Eye, View } from "lucide-react";

export const PreviewCircle = ({
  className,
  url,
}: {
  className?: string;
  url: string;
}) => {
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
          <p>Preview</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
