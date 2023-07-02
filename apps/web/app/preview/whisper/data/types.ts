import { RowData } from "@tanstack/react-table";

export enum LanguageEnum {
  English = "en",
  Japanese = "ja",
  Chinese = "cn",
  Auto = "auto",
}

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    model?: string;
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
  }
}

export type ModelType = string;

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
