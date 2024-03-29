import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useModels } from "@/hooks/useModels";
import { Loader2 } from "lucide-react";
import { setWhisperModel, useWhisperModel } from "@/atoms/whisperModel";
import { useTranslations } from "next-intl";

export const ModelSelect = ({
  value,
  onChange,
}: {
  value?: string;
  onChange?: (value: string) => void;
}) => {
  const { data: models = [], isLoading: modelsLoading } = useModels();

  const { model: globalValue } = useWhisperModel();
  const t = useTranslations("Whisper");
  return (
    <Select
      onValueChange={onChange ?? setWhisperModel}
      defaultValue={value ?? globalValue}
    >
      <SelectTrigger className={"h-8"}>
        {modelsLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <SelectValue placeholder={t("Select a whisper model to use")} />
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
