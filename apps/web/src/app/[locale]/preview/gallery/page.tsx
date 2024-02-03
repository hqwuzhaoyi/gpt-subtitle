import { Metadata } from "next";
import { GalleryList } from "./components/gallery-list";
import { useTranslations } from "next-intl";

export const metadata: Metadata = {
  title: "Gallery",
};

export default function TaskPage() {
  const t = useTranslations("Whisper");
  try {
    return (
      <>
        <div className=" h-full flex-1 flex-col space-y-8 p-8 md:flex">
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Whisper</h2>
              <p className="text-muted-foreground">{t("description")}</p>
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
