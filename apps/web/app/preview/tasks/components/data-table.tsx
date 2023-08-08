"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
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
import { outPutSrtList, autoStart, outPutSrtAudios } from "../api/osrt";
import useSWR from "swr";
import { io } from "socket.io-client";
import { ModelSelect } from "./ModelSelect";
import { Autostart } from "./Autostart";
import { LanguageEnum, ModelType, TableType } from "../data/types";
import { Task } from "../data/schema";
import { useModels } from "./hooks/useModels";
import { useImagePreview } from "@/atoms/imagePreview";
import { ImagePreviewModal } from "./ImagePreviewModal";

const socket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000");

socket.on("connection", (message) => {
  console.debug("ws connection", message);
});

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data?: TData[];
  type: TableType;
}

const queryList: (type: TableType) => Promise<Task[]> = async (type) => {
  let result;
  if (type === "video") {
    const list = await outPutSrtList();
    result = list.map((task) => {
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
  } else if (type === "audio") {
    const list = await outPutSrtAudios();
    result = list.map((task) => {
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
  } else {
    throw new Error("unknown type" + type);
  }

  return result;
};

function useList(type: TableType) {
  const { data, error, isLoading } = useSWR(`/osrt/list/${type}`, () =>
    queryList(type)
  );
  return {
    list: data,
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
  const { list } = useList(type);
  const { data: models = [], isLoading: modelsLoading } = useModels();
  const [model, setModel] = React.useState<ModelType | undefined>(models?.[0]);

  const [data, setData] = React.useState(initData);

  React.useEffect(() => {
    setData((list ?? []) as TData[]);
  }, [list]);

  socket.on("jobUpdate", ({ jobId, status, data }) => {
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
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
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
          <ModelSelect value={model} onChange={setModel} />
        </div>
        <div className="flex-initial">
          <Autostart models={models} />
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
