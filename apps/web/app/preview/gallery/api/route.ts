import { request } from "@/lib/request";
import { NextResponse } from "next/server";
import { FileListResult, LanguageEnum } from "shared-types";

const outPutSrtList = async (): Promise<FileListResult> => {
  try {
    const response = await request.get(`/osrt/list`);
    return response.data;
  } catch (error: any) {
    console.error(error.message);
  }
  return [];
};

export async function GET(request: Request) {
  try {
    let data;

    const list = await outPutSrtList();
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

    return NextResponse.json({ data });
  } catch (error: any) {
    console.error(error.message);
  }
}
