import {
  ArrowDownToLine,
  ArrowRightToLine,
  ArrowUpCircle,
  ArrowUpToLine,
  CheckCircle2,
  Circle,
  HelpCircle,
  XCircle,
  Globe2,
} from "lucide-react";
import { LanguageEnum } from "shared-types";

export const labels = [
  {
    value: "bug",
    label: "Bug",
  },
  {
    value: "feature",
    label: "Feature",
  },
  {
    value: "documentation",
    label: "Documentation",
  },
];

export const statuses = [
  {
    value: "backlog",
    label: "Backlog",
    icon: HelpCircle,
  },
  {
    value: "todo",
    label: "Todo",
    icon: Circle,
  },
  {
    value: "in progress",
    label: "In Progress",
    icon: ArrowUpCircle,
  },
  {
    value: "done",
    label: "Done",
    icon: CheckCircle2,
  },
  {
    value: "canceled",
    label: "Canceled",
    icon: XCircle,
  },
];

export const priorities = [
  {
    label: "Low",
    value: 1,
    icon: ArrowDownToLine,
  },
  {
    label: "Medium",
    value: 2,
    icon: ArrowRightToLine,
  },
  {
    label: "High",
    value: 3,
    icon: ArrowUpToLine,
  },
];

export const languages = Object.keys(LanguageEnum)
  .map((key) => ({
    value: LanguageEnum[key as keyof typeof LanguageEnum],
    label: key,
    icon: Globe2,
  }));
