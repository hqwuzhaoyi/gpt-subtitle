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

export const metadata: Metadata = {
  title: "Tasks",
  description: "A task and issue tracker build using Tanstack Table.",
};

const VideoTable = async () => {
  const models = await getModels();
  return <DataTable columns={columns} models={models} />;
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
      <div className="md:hidden">
        <Image
          src="/examples/tasks-light.png"
          width={1280}
          height={998}
          alt="Playground"
          className="block dark:hidden"
        />
        <Image
          src="/examples/tasks-dark.png"
          width={1280}
          height={998}
          alt="Playground"
          className="hidden dark:block"
        />
      </div>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
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
        <h2 className="text-xl tracking-tight">Video</h2>

        <Suspense fallback={<>Loading...</>}>
          <VideoTable></VideoTable>
        </Suspense>
      </div>
    </>
  );
}
