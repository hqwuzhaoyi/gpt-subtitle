"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DataTablePagination } from "../components/data-table-pagination";
import { DataTableToolbar } from "../components/data-table-toolbar";
import { outPutSrtList, outPutSrtAudios } from "../api/osrt";
import useSWR from "swr";
import { io } from "socket.io-client";
import { ModelSelect } from "@/components/ModelSelect";
import { AutoStartModal } from "../../../../components/Modal/Autostart";
import { TableType } from "../data/types";
import { Task, taskSchema } from "../data/schema";
import { ImagePreviewModal } from "./ImagePreviewModal";
import { LanguageEnum } from "shared-types";
import { useWhisperModel } from "@/atoms/whisperModel";

const socket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000");

socket.on("connection", (message) => {
  console.debug("ws connection", message);
});

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data?: TData[];
  type: TableType;
}

const queryList: (
  type: TableType,
  pagination: PaginationState
) => Promise<{
  list: Task[];
  pageCount: number;
}> = async (type, pagination) => {
  let resultList;
  let pageCount;
  if (type === "video") {
    const { list, totalCount } = await outPutSrtList({
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
    });
    resultList = list.map((task) => {
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

    pageCount = Math.ceil(totalCount / pagination.pageSize);
  } else if (type === "audio") {
    const data = await outPutSrtAudios();
    resultList = data.map((task) => {
      const status = task.isProcessing
        ? "in progress"
        : task.subtitle
        ? "done"
        : "todo";
      return {
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
    pageCount = Math.ceil(data.length / pagination.pageSize);
  } else {
    throw new Error("unknown type" + type);
  }

  return {
    list: resultList.map((item) => taskSchema.parse(item)),
    pageCount,
  };
};

function useList(type: TableType, pagination: PaginationState) {
  const {
    data: { list, pageCount } = {},
    error,
    isLoading,
  } = useSWR(
    `/osrt/list/${type}?page=${pagination.pageIndex}&pageSize=${pagination.pageSize}`,
    () => queryList(type, pagination)
  );
  return {
    list,
    pageCount,
    isLoading,
    error,
  };
}

export function DataTable<TData extends Task, TValue>({
  columns,
  data: initData = [],
  type,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const [{ pageIndex, pageSize }, setPagination] =
    React.useState<PaginationState>({
      pageIndex: 0,
      pageSize: 10,
    });

  const pagination = React.useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  const { list, pageCount } = useList(type, pagination);

  const { model } = useWhisperModel();

  const [data, setData] = React.useState(initData);

  React.useEffect(() => {
    setData((list ?? []) as TData[]);
  }, [list]);

  socket.on("jobUpdate", ({ status, data }) => {
    // 处理任务更新
    // console.log(jobId, status, data);
    if (status === "start") {
      // console.debug("start", jobId, data.file);
      setData((old) =>
        old.map((row, index) => {
          if ((row as any).id === data.id) {
            return {
              ...old[index],
              status: "in progress",
            };
          }
          return row;
        })
      );
    } else if (status === "completed") {
      // console.debug("completed", jobId, data.url);
      setData((old) =>
        old.map((row, index) => {
          if ((row as any).id === data.id) {
            return {
              ...old[index],
              status: "done",
              path: data.url,
            };
          }
          // console.debug("row", row, index);
          return row;
        })
      );
    } else if (status === "failed") {
      setData((old) =>
        old.map((row, index) => {
          if ((row as any).id === data.id) {
            return {
              ...old[index],
              status: "cancel",
              path: data.url,
            };
          }
          // console.debug("row", row, index);
          return row;
        })
      );
    }
  });

  const table = useReactTable({
    data,
    columns,
    manualPagination: type === "video",
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    pageCount,
    onPaginationChange: setPagination,
    enableRowSelection: true,
    enableMultiRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    meta: {
      type,
      model,
      updateData: (rowIndex: string | number, columnId: any, value: any) => {
        setData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex],
                [columnId]: value,
              };
            }
            return row;
          })
        );
      },
    },
  });

  return (
    <div className="space-y-4">
      <div className="h-8 flex">
        <div className="text-base tracking-tight h-auto pr-4 items-center flex">
          Model
        </div>
        <div className="flex-auto pr-4">
          <ModelSelect />
        </div>
        <div className="flex-initial">
          <AutoStartModal />
        </div>
      </div>
      <DataTableToolbar
        table={table}
        rowSelection={rowSelection}
        model={model}
      />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
      <ImagePreviewModal />
    </div>
  );
}
