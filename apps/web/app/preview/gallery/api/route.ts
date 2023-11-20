import { NextRequest, NextResponse } from "next/server";
import { FileListResult, LanguageEnum } from "shared-types";
import { backendURL, getToken } from "@/lib/request";

const fetchGalleryList = async ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}): Promise<FileListResult> => {
  const token = await getToken();
  const res = await fetch(
    backendURL + `/osrt/list?page=${page}&limit=${limit}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token && `Bearer ${token.accessToken}`,
      },
    }
  );

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
