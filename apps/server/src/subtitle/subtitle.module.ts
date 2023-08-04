import { Module } from "@nestjs/common";
import { SubtitleService } from "./subtitle.service";
import { SubtitleController } from "./subtitle.controller";
import { SharedModule } from "@/shared/shared.module";
import { FilesModule } from "@/files/files.module";

@Module({
  imports: [SharedModule, FilesModule],
  controllers: [SubtitleController],
  providers: [SubtitleService],
})
export class SubtitleModule {}
