"use client";

import React, { useEffect } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { AlbumArtwork } from "./album-artwork";
import { Album } from "../data/schema";
import { queryGallery } from "../data/query";
import useSWR from "swr";

export const GalleryList = ({ initialData }: { initialData: Album[] }) => {
  const { data, error } = useSWR(["/api/gallery"], ([url]) => queryGallery(), {
    initialData,
    revalidateOnMount: true, // 如果你想在组件挂载时重新验证数据，可以设置该选项为 true
  });

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;

  return (
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
  );
};
