import { NextRequest, NextResponse } from "next/server";
import { FileListResult, LanguageEnum } from "shared-types";
import { getFetch } from "@/lib/fetch";
const fetchGalleryList = async ({
  page,
  limit,
  request,
  response,
}: {
  page: number;
  limit: number;
  request: NextRequest;
  response: NextResponse;
}): Promise<FileListResult> => {
  const res = await getFetch(`/osrt/list?page=${page}&limit=${limit}`, {
    req: request,
    res: response,
  });

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    console.error("setProfile error", res);
    if (res.status === 401) {
      throw new Error("Unauthorized");
    }
    throw new Error("Network response was not ok");
  }

  const data = await res.json();

  return data;
};

export async function GET(request: NextRequest, response: NextResponse) {
  try {
    let data;
    const { searchParams } = new URL(request?.url);

    const { list, totalCount, page, limit } = await fetchGalleryList({
      page: Number(searchParams.get("page")) || 1,
      limit: Number(searchParams.get("limit")) || 10,
      request,
      response,
    });

    data = list.map((task) => {
      const status = task.isProcessing
        ? "in progress"
        : task.subtitle?.length
          ? "done"
          : "todo";

      return {
        ...task,
        title: task.fileName,
        id: task.id + "",
        label: task.fileName,
        status,
        path: task.path,
        priority: 1,
        language: LanguageEnum.Auto,
        processingJobId: task.processingJobId,
        subtitle: task.subtitle,
        audio: task.audio,
      };
    });

    return NextResponse.json({
      data: {
        list: data,
        totalCount,
        page,
        limit,
      },
    });
  } catch (error: any) {
    console.error(error.message);

    if (error?.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    } else {
      return NextResponse.json({
        data: {
          list: [],
          totalCount: 0,
        },
      });
    }
  }
}
