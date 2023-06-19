export type FileListResult = {
  name: string;
  exist: {
    audio: boolean;
    subtitle: boolean;
    subtitlePath?: string;
  };
  isProcessing: boolean;
};
