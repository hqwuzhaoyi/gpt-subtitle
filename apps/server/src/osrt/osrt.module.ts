import { Module } from "@nestjs/common";
import { OsrtService } from "./osrt.service";
import { FileWatcherService } from "./osrtFileWatch.service";
import { OsrtController } from "./osrt.controller";
import { BullModule } from "@nestjs/bull";
import { QueueProcessor } from "./osrt.processor";
import { OsrtGateway } from "./osrt.gateway";
import { FileEntity } from "./entities/file.entity";
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [
    TypeOrmModule.forFeature([FileEntity]),
    BullModule.registerQueue({
      name: "audio",
    }),
  ],
  controllers: [OsrtController],

  providers: [QueueProcessor, OsrtService, FileWatcherService, OsrtGateway],
})
export class OsrtModule {}
