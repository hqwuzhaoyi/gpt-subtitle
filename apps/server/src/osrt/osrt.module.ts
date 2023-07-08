import { Module } from "@nestjs/common";
import { OsrtService } from "./osrt.service";
import { OsrtController } from "./osrt.controller";
import { SharedGateway } from "../shared/shared.gateway";
import { SharedModule } from "@/shared/shared.module";
import { QueueProcessor } from "./osrt.processor";
import { FilesModule } from "@/files/files.module";

@Module({
  imports: [SharedModule, FilesModule],
  controllers: [OsrtController],

  providers: [OsrtService, QueueProcessor],
})
export class OsrtModule {}
