import { Module } from "@nestjs/common";
import { SubtitleService } from "./subtitle.service";
import { SubtitleController } from "./subtitle.controller";
import { SharedModule } from "@/shared/shared.module";
import { FilesModule } from "@/files/files.module";
import { WatchModule } from "@/files/watch/watch.module";

@Module({
  imports: [SharedModule, FilesModule, WatchModule],
  controllers: [SubtitleController],
  providers: [SubtitleService],
})
export class SubtitleModule {}
