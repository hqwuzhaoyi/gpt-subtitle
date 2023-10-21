import { request } from "@/lib/request";
import { NextRequest, NextResponse } from "next/server";
import { FileListResult, LanguageEnum } from "shared-types";

const outPutSrtList = async ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}): Promise<FileListResult> => {
  const response = await request.get(`/osrt/list?page=${page}&limit=${limit}`);
  return response.data;
};

export async function GET(request: NextRequest, response: NextResponse) {
  try {
    let data;
    const { searchParams } = new URL(request?.url);

    const { list, totalCount, page, limit } = await outPutSrtList({
      page: Number(searchParams.get("page")) || 1,
      limit: Number(searchParams.get("limit")) || 10,
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
        path: task.subtitle?.[0]?.path,
        priority: 1,
        language: LanguageEnum.Auto,
        processingJobId: task.processingJobId,
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

    if (error?.response?.status === 401) {
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
