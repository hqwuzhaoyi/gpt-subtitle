import { Module } from "@nestjs/common";
import { TranslateService } from "./translate.service";
import { TranslateController } from "./translate.controller";
import { FilesModule } from "@/files/files.module";
import { SharedModule } from "@/shared/shared.module";

@Module({
  imports: [FilesModule, SharedModule],
  controllers: [TranslateController],
  providers: [TranslateService],
  exports: [TranslateService],
})
export class TranslateModule {}
