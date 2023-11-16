import { Module } from "@nestjs/common";
import { FilesService } from "./files.service";
import { FilesController } from "./files.controller";
import { WatchModule } from "./watch/watch.module";
import { SharedModule } from "@/shared/shared.module";

@Module({
  imports: [SharedModule, WatchModule],
  controllers: [FilesController],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
