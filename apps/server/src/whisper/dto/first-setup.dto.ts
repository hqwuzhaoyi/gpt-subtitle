import { MakeType } from "shared-types";

export class FirstSetupDto {
  // 强制重新下载
  force: boolean;

  // 选择的模型
  makeType: MakeType
}
