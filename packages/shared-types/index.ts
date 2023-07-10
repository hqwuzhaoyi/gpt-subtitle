type FileItem = {
  id: number;
  fileName: string;
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
