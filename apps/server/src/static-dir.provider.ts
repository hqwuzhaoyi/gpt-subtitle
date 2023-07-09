import * as path from "path";

export const StaticDirProvider = {
  provide: "STATIC_DIR",
  useValue: path.join(__dirname, "..", "..", "..", "uploads"),
};

import { Module, Global } from "@nestjs/common";

@Global()
@Module({
  providers: [StaticDirProvider],
  exports: [StaticDirProvider],
})
export class StaticDirModule {}
