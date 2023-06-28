import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ModelSelectProps {
  models?: string[];
  value?: string;
  onChange: (value?: string) => void;
}

export const ModelSelect = ({
  models = [],
  value,
  onChange,
}: ModelSelectProps) => {
  return (
    <Select onValueChange={onChange} defaultValue={value}>
      <SelectTrigger>
        <SelectValue placeholder="Select a verified model to use" />
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
