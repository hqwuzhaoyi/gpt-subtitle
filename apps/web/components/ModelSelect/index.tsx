import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useModels } from "./useModels";
import { Loader2 } from "lucide-react";
import { setWhisperModel, useWhisperModel } from "@/atoms/whisperModel";

export const ModelSelect = () => {
  const { data: models = [], isLoading: modelsLoading } = useModels();

  const { model: value } = useWhisperModel();
  return (
    <Select onValueChange={setWhisperModel} defaultValue={value}>
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
