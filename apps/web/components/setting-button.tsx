import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "lib/navigation";
import { Cog } from "lucide-react";

export const SettingButton = async () => {
  return (
    <Link href="/settings">
      <div
        className={cn(
          buttonVariants({
            size: "sm",
            variant: "ghost",
          }),
          "w-9 px-0"
        )}
      >
        <Cog className="h-5 w-5" />
        <span className="sr-only">Setting</span>
      </div>
    </Link>
  );
};
