import { Module } from "@nestjs/common";
import { WatchService } from "./watch.service";
import { WatchController } from "./watch.controller";
import { SharedModule } from "@/shared/shared.module";
import { WatchProcessor } from "./watch.processor";

@Module({
  imports: [SharedModule],

  controllers: [WatchController],
  providers: [WatchService, WatchProcessor],
  exports: [WatchService, WatchProcessor],
})

export class WatchModule {}
