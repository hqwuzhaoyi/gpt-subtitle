export type FileListResult = {
  name: string;
  exist: {
    audio: boolean;
    subtitle: boolean;
    subtitlePath?: string;
  };
  isProcessing: boolean;
  processingJobId?: string;
};

export type CreateWhisperJobItem = {
  file: string;
  language: string;
  model: string;
};
