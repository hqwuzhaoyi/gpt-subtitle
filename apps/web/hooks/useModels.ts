import { getModels } from "app/api/models";
import useSWR from "swr";

export function useModels() {
  const { data, error, isLoading } = useSWR(`/whisper/models`, () => getModels());
  return { data, error, isLoading };
}
