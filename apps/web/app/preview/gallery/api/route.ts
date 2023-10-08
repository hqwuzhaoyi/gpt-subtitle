import { NextResponse } from "next/server";
import { LanguageEnum } from "shared-types";
import { outPutSrtList } from "../../tasks/api/osrt";

export async function GET(request: Request) {
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
    return NextResponse.json({
      data: {
        list: [],
        totalCount: 0,
      },
    });
  }
}
