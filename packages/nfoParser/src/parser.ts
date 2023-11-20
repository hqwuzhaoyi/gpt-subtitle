import fs from "fs";
import { parseStringPromise } from "xml2js";
import { MediaInfo } from "shared-types";

export async function parser(filePath: string): Promise<Record<any, any>> {
  const nfoContent = fs.readFileSync(filePath, "utf8");
  const data = await parseStringPromise(nfoContent);

  return Object.values(data)?.[0];
}

export async function extractMediaInfo(filePath: string): Promise<MediaInfo> {
  try {
    const parsedData = await parser(filePath);

    // 假设parsedData直接映射了NFO文件的结构
    const mediaInfo = {
      title: parsedData?.title?.[0],
      originaltitle: parsedData?.originaltitle?.[0],
      plot: parsedData?.plot?.[0],
      poster: parsedData?.art?.[0]?.poster?.[0],
      fanart: parsedData?.art?.[0]?.fanart?.[0],
      actors: parsedData?.actor?.map((actor) => ({
        name: actor?.name?.[0],
        role: actor?.role?.[0],
        thumb: actor?.thumb?.[0],
        type: actor?.type?.[0],
      })),
      dateadded: parsedData?.dateadded?.[0],
    };

    return mediaInfo;
  } catch (error) {
    console.error("Error extracting media info:", error);
    return null;
  }
}
