import { CreateWhisperJobItem } from "shared-types";
import { FileType } from "shared-types";

type WhisperConfig = {
  prompt?: string;
  threads?: number;
  maxContent?: number;
  entropyThold?: number;
};

export class CreateOsrtDto implements CreateWhisperJobItem {
  id: string;
  file?: string;
  language: string;
  model: string;
  priority?: number;
  fileType?: FileType;
  whisperConfig?: WhisperConfig;
}

export { FileType, WhisperConfig };
