import { Module } from "@nestjs/common";
import { WatchService } from "./watch.service";
import { WatchController } from "./watch.controller";
import { SharedModule } from "@/shared/shared.module";

@Module({
  imports: [SharedModule],

  controllers: [WatchController],
  providers: [WatchService],
  exports: [WatchService],
})
export class WatchModule {}
