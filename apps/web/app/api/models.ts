import { request } from "@/lib/request";
import { ModelType } from "@/types";

export const getModels = async (): Promise<ModelType[]> => {
  try {
    const response = await request.get(`/whisper/models`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Error login");
  }
};
