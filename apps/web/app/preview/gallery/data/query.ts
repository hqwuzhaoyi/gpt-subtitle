import { FileList } from "shared-types";
import { isNil, ifElse } from "ramda";
import { Album, AlbumSchema } from "./schema";
import { customGet } from "@/lib/clientFetch";

export const queryGallery: ({
  pagination,
  searchKey,
}: {
  pagination: { pageIndex?: number; pageSize?: number };
  searchKey?: string;
}) => Promise<{
  list: Album[];
  totalCount: number;
}> = async ({
  pagination: { pageIndex = 1, pageSize = 10 } = {},
  searchKey,
}) => {
  try {
    const response = await customGet(
      `/osrt/list?page=${pageIndex}&limit=${pageSize}&searchKey=${searchKey}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        // signOut({ redirect: false }).then(() => {
        //   window.location.href = "/login";
        // });
      }
      throw new Error("Network response was not ok");
    }

    const jsonResponse = await response.json(); // 等待JSON解析
    const { list: data, totalCount } = jsonResponse; // 从解析后的JSON中解构data
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
          title: item.title,
          originaltitle: item.originaltitle,
          plot: item.plot,
          actors: item.actors,
          dateadded: item.dateadded,
          poster: item.poster,
          fanart: item.fanart,
          audio: item.audio,
          subtitle: item.subtitle,
          videoPath: item.path,
        });
      }),
      totalCount,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching data");
  }
};
