import { request } from "@/lib/request";
import { FileList } from "shared-types";
import { SubtitleItem } from "./types";

export interface FileUploadResponse {
  url: string;
  filename: string;
  originalname: string;
}
export interface TranslateResponse {
  url: string;
  filename: string;
}

export interface FileUploadRequest {
  file: File;
}

export const uploadFile = async ({
  file,
}: FileUploadRequest): Promise<FileUploadResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  try {
    const response = await request.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Error uploading file");
  }
};
export const uploadSubtitle = async ({
  file,
}: FileUploadRequest): Promise<FileUploadResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  try {
    const response = await request.post("/subtitle/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Error uploading file");
  }
};

export const translateFile = async (
  filename: string
): Promise<FileUploadResponse> => {
  const postData = {
    filename,
  };
  try {
    const response = await request.post("/translate", postData);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Error uploading file");
  }
};
export const translateFileWithId = async (
  id: number
): Promise<FileList> => {
  const postData = {
    id,
    forceTranslate: true,
  };
  try {
    const response = await request.post("/translate/useId", postData);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Error uploading file");
  }
};
export const querySubtitles = async (): Promise<SubtitleItem[]> => {
  try {
    const response = await request.get("/subtitle");
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Error uploading file");
  }
};
export const deleteSubtitle = async (id: number): Promise<FileList> => {
  console.debug("deleteSubtitle", id);
  try {
    const response = await request.delete(`/subtitle/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Error uploading file");
  }
};
