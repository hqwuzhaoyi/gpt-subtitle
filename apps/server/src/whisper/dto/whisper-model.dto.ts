import { IsNotEmpty } from "class-validator";
import { MakeType, WhisperModel } from "shared-types";

export class WhisperModelDto {
  @IsNotEmpty()
  model: WhisperModel;

  @IsNotEmpty()
  makeType: MakeType;
}
