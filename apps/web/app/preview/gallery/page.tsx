import { GalleryList } from "./components/gallery-list";

export default function TaskPage() {
  try {
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

          <GalleryList />
        </div>
      </>
    );
  } catch (error) {
    console.debug(error);
    return <div>error</div>;
  }
}
