import { RowData } from "@tanstack/react-table";
import { LanguageEnum } from "shared-types";


export type TableType = "video" | "audio";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line unused-imports/no-unused-vars
  interface TableMeta<TData extends RowData> {
    model?: string;
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
    type: TableType;
  }
}



export interface TaskListItem {
  title: string;
  id: string;
  label: string;
  status: string;
  path?: string;
  priority: string;
  language: LanguageEnum;
  processingJobId?: string;
}
