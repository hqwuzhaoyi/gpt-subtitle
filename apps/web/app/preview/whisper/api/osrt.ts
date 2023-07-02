import { request } from "utils";
import { FileListResult } from "shared-types";
export const outPutSrt = async (
  language: string,
  filename: string,
  model: string
): Promise<void> => {
  try {
    const response = await request.get(
      `/osrt/${language}/${filename}/${model}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Error uploading file");
  }
};
export const outPutSrtStop = async (
  processingJobId?: string
): Promise<void> => {
  try {
    const response = await request.get(`/osrt/stop/${processingJobId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Error uploading file");
  }
};
export const outPutSrtList = async (): Promise<FileListResult[]> => {
  try {
    const response = await request.get(`/osrt/list`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Error uploading file");
  }
};
