import { promises as fs } from "fs";
import path from "path";
import { Metadata } from "next";
import Image from "next/image";
import { z } from "zod";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { UserNav } from "./components/user-nav";
import { Suspense } from "react";
import { baseURL } from "utils";
import { ModelType } from "./data/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata: Metadata = {
  title: "Tasks",
  description: "A task and issue tracker build using Tanstack Table.",
};

const VideoTable = async () => {
  const models = await getModels();
  return <DataTable columns={columns} models={models} type="video" />;
};
const AudioTable = async () => {
  const models = await getModels();
  return <DataTable columns={columns} models={models} type="audio" />;
};

async function getModels(): Promise<ModelType[]> {
  console.debug("models", `${baseURL}/osrt/models`);
  let res = await fetch(`${baseURL}/osrt/models`);
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return res.json();
}

export default async function TaskPage() {
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
            <UserNav />
          </div>
        </div>

        <Tabs defaultValue="video" className="w-full">
          <TabsList>
            <TabsTrigger value="video">Video</TabsTrigger>
            <TabsTrigger value="audio">Audio</TabsTrigger>
          </TabsList>
          <TabsContent value="video">
            <Suspense fallback={<>Loading...</>}>
              {/* @ts-expect-error Async Server Component */}
              <VideoTable></VideoTable>
            </Suspense>
          </TabsContent>
          <TabsContent value="audio">
            {/* @ts-expect-error Async Server Component */}
            <AudioTable></AudioTable>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
