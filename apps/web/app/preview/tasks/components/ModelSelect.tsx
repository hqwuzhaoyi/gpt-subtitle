import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ModelType } from "../data/types";
import { useModels } from "./hooks/useModels";
import { Loader2 } from "lucide-react";

interface ModelSelectProps {
  value?: ModelType;
  onChange: (value: ModelType) => void;
}

export const ModelSelect = ({ value, onChange }: ModelSelectProps) => {
  const { data: models = [], isLoading: modelsLoading } = useModels();
  return (
    <Select onValueChange={onChange} defaultValue={value}>
      <SelectTrigger>
        {modelsLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <SelectValue placeholder="Select a whisper model to use" />
        )}
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
