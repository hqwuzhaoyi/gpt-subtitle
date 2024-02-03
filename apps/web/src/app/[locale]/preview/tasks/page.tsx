import { Metadata } from "next";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  title: "Tasks",
  description: "A task and issue tracker build using Tanstack Table.",
};

const VideoTable = async () => {
  return <DataTable columns={columns} type="video" />;
};
const AudioTable = async () => {
  return <DataTable columns={columns} type="audio" />;
};

export default async function TaskPage() {
  // const t = useTranslations("Whisper");

  const t = await getTranslations("Whisper");
  const tIndex = await getTranslations("Index");
  return (
    <>
      <div className=" h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Whisper</h2>
            <p className="text-muted-foreground">{t("description")}</p>
          </div>
          <div className="flex items-center space-x-2"></div>
        </div>

        <Tabs defaultValue="video" className="w-full space-y-4">
          <TabsList>
            <TabsTrigger value="video">{t("video")}</TabsTrigger>
            <TabsTrigger value="audio">{t("audio")}</TabsTrigger>
          </TabsList>
          <TabsContent value="video">
            <Suspense fallback={<>{tIndex("loading")}</>}>
              <VideoTable></VideoTable>
            </Suspense>
          </TabsContent>
          <TabsContent value="audio">
            <AudioTable></AudioTable>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
