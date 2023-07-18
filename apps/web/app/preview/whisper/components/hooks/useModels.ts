import { baseURL } from "utils";
import { ModelType } from "../../data/types";
import useSWR from "swr";

export function useModels() {
  async function getModels(): Promise<ModelType[]> {
    console.debug("models", `${baseURL}/osrt/models`);
    let res = await fetch(`${baseURL}/osrt/models`);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return res.json();
  }

  const { data, error, isLoading } = useSWR(`/osrt/models`, () => getModels());
  return { data, error, isLoading };
}
