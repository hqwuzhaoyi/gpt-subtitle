"use client";

import { Row, Table } from "@tanstack/react-table";
import { MoreHorizontal, Play, Ban, DownloadCloud } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Task, taskSchema } from "../data/schema";
import { outPutSrt, outPutSrtStop } from "../api/osrt";
import { useSWRConfig } from "swr";
import { useToast } from "@/components/ui/use-toast";

interface DataTableRowActionsProps<TData extends Task> {
  row: Row<TData>;
  table: Table<TData>;
}

export function DataTableRowActions<TData extends Task>({
  row,
  table,
}: DataTableRowActionsProps<TData>) {
  const task = taskSchema.parse(row.original);
  const { mutate } = useSWRConfig();
  const { toast } = useToast();
  const startWhisper = async () => {
    if (
      row.getValue("language") &&
      row.getValue("id") &&
      table.options.meta?.model &&
      row.getValue("priority")
    ) {
      await outPutSrt(
        row.getValue("language"),
        row.getValue("id"),
        table.options.meta?.model,
        row.getValue("priority"),
        table.options.meta?.type
      );
      mutate(`/osrt/list/${table.options.meta?.type}`);
    } else {
      toast({
        title: "Please select language, model and priority",
      });
    }
  };
  const stopWhisper = async () => {
    await outPutSrtStop(task.processingJobId);
    mutate(`/osrt/list/${table.options.meta?.type}`);
  };
  const downLoad = async () => {
    console.debug("downLoad", task.path);
    window.open(task.path);
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem onClick={startWhisper}>
          <Play className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
          Start
        </DropdownMenuItem>
        <DropdownMenuItem onClick={stopWhisper}>
          <Ban className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
          Stop
        </DropdownMenuItem>
        <DropdownMenuItem onClick={downLoad}>
          <DownloadCloud className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
          Download
        </DropdownMenuItem>
        {/* <DropdownMenuItem>
          <Pen className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Copy className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
          Make a copy
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Star className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
          Favorite
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Tags className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Labels
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup value={task.label}>
              {labels.map((label) => (
                <DropdownMenuRadioItem key={label.value} value={label.value}>
                  {label.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Trash className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
          Delete
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
