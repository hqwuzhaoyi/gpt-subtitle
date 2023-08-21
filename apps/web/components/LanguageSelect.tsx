import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  labels,
  languages,
  priorities,
  statuses,
} from "../app/preview/tasks/data/data";
import { LanguageEnum } from "shared-types";

export const LanguageSelect = ({
  value,
  onChange,
}: {
  value: LanguageEnum;
  onChange: (value: LanguageEnum) => void;
}) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Language</SelectLabel>
          {languages?.map((option) => (
            <SelectItem value={option.value} key={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
