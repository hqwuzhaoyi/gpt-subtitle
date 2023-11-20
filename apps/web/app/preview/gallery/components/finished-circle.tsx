import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "components/ui/tooltip";
import { CheckCircle2 } from "lucide-react";

export const FinishedCircle = ({ className }: { className?: string }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <CheckCircle2
            className={cn(
              "opacity-80 rounded-full shadow-md text-green-600",
              className
            )}
          ></CheckCircle2>
        </TooltipTrigger>
        <TooltipContent>
          <p>Status: Finished</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
