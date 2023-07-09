import { request } from "utils";
import {
  AudioListResult,
  CreateWhisperJobItem,
  FileListResult,
} from "shared-types";
import { LanguageEnum, ModelType } from "../data/types";
export const outPutSrt = async (
  language: string,
  id?: string,
  model?: string,
  priority?: number,
  fileType?: string
): Promise<void> => {
  try {
    const response = await request.get(
      `/osrt/${language}/${id}/${model}/${priority}/${fileType}`
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
export const outPutSrtList = async (): Promise<FileListResult> => {
  try {
    const response = await request.get(`/osrt/list`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Error uploading file");
  }
};
export const outPutSrtAudios = async (): Promise<AudioListResult> => {
  try {
    const response = await request.get(`/osrt/audios`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Error uploading file");
  }
};

export const autoStart = async (
  language: LanguageEnum,
  model: ModelType
): Promise<FileListResult[]> => {
  try {
    const response = await request.get(`/osrt/autoStart/ja/${model}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Error uploading file");
  }
};

export const createJobs = async (
  jobs: CreateWhisperJobItem[]
): Promise<FileListResult[]> => {
  try {
    const response = await request.post(`/osrt/createJobs`, jobs);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Error uploading file");
  }
};
