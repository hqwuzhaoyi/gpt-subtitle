import { FileListResult } from "shared-types";
import { isNil, ifElse } from "ramda";
import { Album, AlbumSchema } from "./schema";

export const queryGallery: () => Promise<Album[]> = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_WEB_URL}/preview/gallery/api`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const jsonResponse = await response.json(); // 等待JSON解析
  const { data } = jsonResponse; // 从解析后的JSON中解构data
  return (data as FileListResult).map((item) => {
    return AlbumSchema.parse({
      id: item.id + "",
      name: item.fileName,
      processingJobId: item.processingJobId,
      cover: ifElse(
        isNil,
        () => item.poster,
        () => item.fanart
      )(item.fanart),
      path: item.subtitle?.[0]?.path,
      status: item.status,
    });
  });
};
