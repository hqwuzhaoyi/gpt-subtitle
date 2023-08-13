import { setImagePreviewVisible, useImagePreview } from "@/atoms/imagePreview";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import Image from "next/image";

export function ImagePreviewModal() {
  const imagePreview = useImagePreview();

  console.debug("imagePreview", imagePreview);
  return (
    <Dialog open={imagePreview.visible} onOpenChange={setImagePreviewVisible}>
      <DialogContent className="box-content">
        <DialogHeader>
          <DialogTitle>{imagePreview.image?.title}</DialogTitle>
          <DialogDescription>
            {/* Make changes to your profile here. Click save when you're done. */}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="overflow-hidden rounded-md w-full mx-auto">
            {imagePreview.image && (
              <Image
                src={imagePreview.image?.src}
                alt={imagePreview.image?.title}
                width={500}
                height={300}
                className={cn(
                  "h-auto w-full object-cover transition-all hover:scale-105"
                  // aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square"
                )}
              />
            )}
          </div>
        </div>
        <DialogFooter>
          {/* <Button type="submit">Save changes</Button> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
