import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ModelType } from "../data/types";

interface ModelSelectProps {
  models?: ModelType[];
  value?: ModelType;
  onChange: (value: ModelType) => void;
}

export const ModelSelect = ({
  models = [],
  value,
  onChange,
}: ModelSelectProps) => {
  return (
    <Select onValueChange={onChange} defaultValue={value}>
      <SelectTrigger>
        <SelectValue placeholder="Select a whisper model to use" />
      </SelectTrigger>
      <SelectContent>
        {models.map((model) => (
          <SelectItem value={model} key={model}>
            {model}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
