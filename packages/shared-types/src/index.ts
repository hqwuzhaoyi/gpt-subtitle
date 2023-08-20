type FileItem = {
  id: number;
  fileName: string;
  baseName: string;
  extName: string;
  filePath: string;
  path: string;
  status: string;
};

type AudioFileItem = FileItem & {
  subtitleFiles: FileItem[];
};

type VideoFileItem = FileItem & {
  audio: FileItem;
  subtitle: FileItem[];
  isProcessing: boolean;
  processingJobId?: string;
  poster?: string;
  fanart?: string;
};

type AudioListItem = FileItem & {
  subtitle: FileItem[];
  isProcessing: boolean;
  processingJobId?: string;
};

export type FileListResult = VideoFileItem[];
export type AudioListResult = AudioListItem[];

export type CreateWhisperJobItem = {
  id: string;
  file?: string;
  language: string;
  model: string;
};

export type TranslateResult = {
  url: string;
  filename: string;
  path: string;
};

export enum LanguageEnum {
  English = "en",
  Japanese = "ja",
  Chinese = "cn",
  Auto = "auto",
}
