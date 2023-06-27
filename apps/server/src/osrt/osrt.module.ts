import { Module } from "@nestjs/common";
import { OsrtService } from "./osrt.service";
import { OsrtController } from "./osrt.controller";
import { BullModule } from "@nestjs/bull";
import { QueueProcessor } from "./osrt.processor";
import { OsrtGateway } from "./osrt.gateway";
@Module({
  imports: [
    BullModule.registerQueue({
      name: "audio",
    }),
  ],
  controllers: [OsrtController],
  providers: [OsrtService, OsrtGateway, QueueProcessor],
})
export class OsrtModule {}
