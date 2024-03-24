import { request } from "@/lib/request";
import {
  AudioListResult,
  CreateWhisperJobItem,
  FileListResult,
  FileType,
  LanguageEnum,
} from "shared-types";
import { ModelType } from "@/types/index";
export const outPutSrt = async ({
  language,
  id,
  model,
  priority,
  fileType,
  prompt,
  threads,
  maxContent,
  entropyThold,
}: {
  language: string;
  id?: string;
  model?: string;
  priority?: number;
  fileType?: FileType;
  prompt?: string;
  threads?: number;
  maxContent?: number;
  entropyThold?: number;
}): Promise<void> => {
  try {
    const response = await request.post(`/osrt/${id}/translate`, {
      ln: language,
      model,
      priority,
      fileType,
      prompt,
      threads,
      maxContent,
      entropyThold,
    });
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
export const terminateAllJobs = async (): Promise<void> => {
  try {
    const response = await request.get(`/osrt/terminateAllJobs`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Error uploading file");
  }
};
export const outPutSrtList = async ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}): Promise<FileListResult> => {
  try {
    const response = await request.get(
      `/osrt/list?page=${page}&limit=${limit}`
    );
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
    const response = await request.get(`/osrt/autoStart/${language}/${model}`);
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
