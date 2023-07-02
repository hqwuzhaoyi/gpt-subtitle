import { CreateWhisperJobItem } from "shared-types";

export class CreateOsrtDto implements CreateWhisperJobItem {
  file: string;
  language: string;
  model: string;
}
