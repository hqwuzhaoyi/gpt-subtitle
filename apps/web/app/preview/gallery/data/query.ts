import { FileList } from "shared-types";
import { isNil, ifElse } from "ramda";
import { Album, AlbumSchema } from "./schema";

export const queryGallery: ({
  pagination,
}: {
  pagination: { pageIndex?: number; pageSize?: number };
}) => Promise<{
  list: Album[];
  totalCount: number;
}> = async ({ pagination: { pageIndex = 1, pageSize = 10 } = {} }) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_WEB_URL}/preview/gallery/api?page=${pageIndex}&limit=${pageSize}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        const window = globalThis.window;
        if (window) {
          window.location.href = "/login";
        }
      }
      throw new Error("Network response was not ok");
    }

    const jsonResponse = await response.json(); // 等待JSON解析
    const {
      data: { list: data, totalCount },
    } = jsonResponse; // 从解析后的JSON中解构data
    return {
      list: (data as FileList).map((item) => {
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
      }),
      totalCount,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching data");
  }
};
