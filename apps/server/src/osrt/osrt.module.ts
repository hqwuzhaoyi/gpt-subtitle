import { Module } from "@nestjs/common";
import { OsrtService } from "./osrt.service";
import { OsrtController } from "./osrt.controller";
import { SharedGateway } from "../shared/shared.gateway";
import { SharedModule } from "@/shared/shared.module";
import { QueueProcessor } from "./osrt.processor";

@Module({
  imports: [SharedModule],
  controllers: [OsrtController],

  providers: [OsrtService, QueueProcessor],
})
export class OsrtModule {}
