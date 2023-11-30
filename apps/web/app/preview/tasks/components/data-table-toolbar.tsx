"use client";

import { Table } from "@tanstack/react-table";
import { Ban, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./data-table-view-options";

import { priorities, statuses } from "../data/data";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { Task } from "../data/schema";
import { ModelType } from "@/types/index";
import { createJobs, terminateAllJobs } from "../api/osrt";
import { toast } from "@/components/ui/use-toast";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  rowSelection: Record<string, boolean>;
  model?: ModelType;
  fileType: string;
}

export function DataTableToolbar<TData extends Task>({
  table,
  rowSelection,
  model,
  fileType,
}: DataTableToolbarProps<TData>) {
  const isFiltered =
    table.getPreFilteredRowModel().rows.length >
    table.getFilteredRowModel().rows.length;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter tasks..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={statuses}
          />
        )}
        {table.getColumn("priority") && (
          <DataTableFacetedFilter
            column={table.getColumn("priority")}
            title="Priority"
            options={priorities as any}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
        {Object.keys(rowSelection).length ? (
          <Button
            onClick={() => {
              const jobs = table.getSelectedRowModel().flatRows.map((row) => {
                return {
                  file: row.original.id,
                  language: row.original.language,
                  model: model ?? "",
                  priority: row.original.priority,
                  id: row.original.id,
                  fileType,
                };
              });
              createJobs(jobs);
            }}
            className="h-8 px-2 lg:px-3"
          >
            Translate Selected
          </Button>
        ) : null}
      </div>
      <div className="flex items-center space-x-2">
        <Button
          onClick={async () => {
            await terminateAllJobs();
            toast({
              title: "Stop all jobs success.",
              description: "All tasks have been cleared.",
            });
          }}
          variant="outline"
          size="sm"
          className="h-8 "
        >
          <Ban className="mr-2 h-4 w-4"></Ban>
          Stop
        </Button>
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
