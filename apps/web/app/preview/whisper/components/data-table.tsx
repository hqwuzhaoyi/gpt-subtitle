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
import { outPutSrtList } from "../../upload/file";
import useSWR from "swr";
import { io } from "socket.io-client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ModelSelect } from "./ModelSelect";

const socket = io("http://localhost:3002");

socket.on("connection", (message) => {
  console.debug("ws connection", message);
});

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data?: TData[];
  models?: string[];
}

const queryList = async () => {
  const list = await outPutSrtList();
  const result = list.map((task) => {
    const status = task.isProcessing
      ? "in progress"
      : task.exist.subtitle
      ? "done"
      : "todo";
    return {
      title: task.name,
      id: task.name,
      label: task.name,
      status,
      path: task.exist.subtitlePath,
      priority: "medium",
      language: "auto",
      processingJobId: task.processingJobId,
    };
  });
  return result;
};

function useList() {
  const { data, error, isLoading } = useSWR("/osrt/list", queryList);
  return {
    list: data,
    isLoading,
    error,
  };
}

export function DataTable<TData, TValue>({
  columns,
  data: initData = [],
  models,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const { list } = useList();
  const [model, setModel] = React.useState<string | undefined>(models?.[0]);

  const [data, setData] = React.useState(initData);

  React.useEffect(() => {
    setData((list ?? []) as TData[]);
  }, [list]);

  socket.on("jobUpdate", ({ jobId, status, data }) => {
    // 处理任务更新
    console.log(jobId, status, data);
    if (status === "start") {
      console.debug("start", jobId, data.file);
      setData((old) =>
        old.map((row, index) => {
          if ((row as any).title === data.file) {
            return {
              ...old[index],
              status: "in progress",
            };
          }
          return row;
        })
      );
    } else if (status === "completed") {
      console.debug("completed", jobId, data.url);
      setData((old) =>
        old.map((row, index) => {
          if ((row as any).title === data.file) {
            return {
              ...old[index],
              status: "done",
              path: data.url,
            };
          }
          console.debug("row", row, index);
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
        <div className="text-base tracking-tight h-auto pr-4 items-center flex">Model</div>
        <div className="flex-auto">
          <ModelSelect models={models} value={model} onChange={setModel} />
        </div>
      </div>
      <DataTableToolbar table={table} />
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
    </div>
  );
}
