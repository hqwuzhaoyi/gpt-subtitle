import { request } from "utils";
import { FileListResult } from "shared-types";

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
