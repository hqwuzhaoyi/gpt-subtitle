import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "components/ui/tooltip";
import { Check } from "lucide-react";

export const FinishedCircle = ({ className }: { className?: string }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Check
            className={cn(
              "",
              className
            )}
          ></Check>
        </TooltipTrigger>
        <TooltipContent>
          <p>Status: Finished</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
