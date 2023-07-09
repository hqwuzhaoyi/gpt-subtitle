import { CreateWhisperJobItem } from "shared-types";

export class CreateOsrtDto implements CreateWhisperJobItem {
  id: string;
  file?: string;
  language: string;
  model: string;
  priority?: number;
}
