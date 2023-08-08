import { promises as fs } from "fs";
import path from "path";
import { Metadata } from "next";
import { z } from "zod";
import { Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata: Metadata = {
  title: "Whisper Tasks",
  description: "A task and issue tracker build using Tanstack Table.",
};

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
          <div className="flex items-center space-x-2">{/* <UserNav /> */}</div>
        </div>
        123
      </div>
    </>
  );
}
