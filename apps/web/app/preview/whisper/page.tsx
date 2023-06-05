import { promises as fs } from "fs";
import path from "path";
import { Metadata } from "next";
import Image from "next/image";
import { z } from "zod";

import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { UserNav } from "./components/user-nav";
import { taskSchema } from "./data/schema";
import { vi } from "@faker-js/faker";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Tasks",
  description: "A task and issue tracker build using Tanstack Table.",
};

async function getFiles(dirType: string) {
  const taskPath = path.join(process.cwd(), "../../samples", dirType);
  try {
    const files = await fs.readdir(taskPath);
    const visibleFiles = (file: string) => !file.startsWith(".");
    const filePaths = files.filter(visibleFiles).map((file) => {
      return {
        path: path.join(taskPath, file),
        title: path.basename(file),
        id: path.basename(file, path.extname(file)),
        label: path.extname(file),
        status: "in progress",
        priority: "medium",
        language: "auto",
      };
    });
    return z.array(taskSchema).parse(filePaths);
  } catch (err) {
    console.log("Error reading directory: ", err);
  }
}

async function getVideos() {
  const videos = (await getFiles("video")) ?? [];
  return videos;
}

export default async function TaskPage() {
  const videos = (await getVideos()) ?? [];
  const audios = (await getFiles("audio")) ?? [];
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
        <DataTable data={videos} columns={columns} />
        <Separator />
        <h2 className="text-xl  tracking-tight">Audio</h2>
        <DataTable data={audios} columns={columns} />
      </div>
    </>
  );
}
