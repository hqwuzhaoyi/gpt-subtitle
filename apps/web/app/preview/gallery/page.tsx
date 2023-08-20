import { promises as fs } from "fs";
import path from "path";
import { Metadata } from "next";
import { z } from "zod";
import { Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import { listenNowAlbums, madeForYouAlbums } from "./data/albums";
import { AlbumArtwork } from "./components/album-artwork";
import { FileListResult } from "shared-types";
import { isEmpty, ifElse } from "ramda";
import { ModelSelect } from "@/components/ModelSelect";
import { ActionBar } from "./components/action-bar";

export const metadata: Metadata = {
  title: "Whisper Tasks",
  description: "A task and issue tracker build using Tanstack Table.",
};

export default async function TaskPage() {
  const queryData = async () => {
    const response = await fetch("http://localhost:3000/preview/gallery/api", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const jsonResponse = await response.json(); // 等待JSON解析
    const { data } = jsonResponse; // 从解析后的JSON中解构data

    return (data as FileListResult).map((item) => {
      return {
        name: item.fileName,
        cover: ifElse(
          isEmpty,
          () => item.poster,
          () => item.fanart
        )(item.fanart),
      };
    });
  };

  const data = await queryData();

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

        <Separator className="my-4" />

        <ActionBar />

        <div className="relative">
          <ScrollArea className="h-[600px] w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-14">
              {data.map((album) => (
                <AlbumArtwork
                  key={album.name}
                  album={album}
                  className="w-[220px] h-[120px]"
                  aspectRatio="portrait"
                  width={220}
                  height={120}
                />
              ))}
            </div>
            <ScrollBar />
          </ScrollArea>
        </div>
      </div>
    </>
  );
}
