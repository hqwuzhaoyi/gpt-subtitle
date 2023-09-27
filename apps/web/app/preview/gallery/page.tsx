import { Metadata } from "next";
import { Separator } from "@/components/ui/separator";

import { GalleryList } from "./components/gallery-list";
import { queryGallery } from "./data/query";

export const metadata: Metadata = {
  title: "Whisper Tasks",
  description: "A task and issue tracker build using Tanstack Table.",
};

export default async function TaskPage() {
  try {
    const data = await queryGallery();

    return (
      <>
        <div className=" h-full flex-1 flex-col space-y-8 p-8 md:flex">
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Whisper</h2>
              <p className="text-muted-foreground">
                Use Whisper to output srt files for your videos.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {/* <UserNav /> */}
            </div>
          </div>

          <Separator className="my-4" />

          <div className="relative">
            <GalleryList initialData={data} />
          </div>
        </div>
      </>
    );
  } catch (error) {
    console.debug(error);
    return <div>error</div>;
  }
}
