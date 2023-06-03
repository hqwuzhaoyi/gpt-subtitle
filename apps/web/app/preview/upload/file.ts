import axios from "axios";

const baseURL = process.env.API_URL || "http://localhost:3001";

const instance = axios.create({
  // .. congigure axios baseURL
  baseURL: `${baseURL}`,
});

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
    const response = await instance.post("/upload", formData, {
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
    const response = await instance.post("/translate", postData);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Error uploading file");
  }
};
export const outPutSrt = async (
  language: string,
  filename: string
): Promise<FileUploadResponse> => {
  try {
    const response = await instance.get(`/osrt/${language}/${filename}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Error uploading file");
  }
};
export const outPutSrtStop = async (): Promise<FileUploadResponse> => {
  try {
    const response = await instance.get(`/osrt/stop`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Error uploading file");
  }
};
