import { Module } from "@nestjs/common";
import { SharedService } from "./shared.service";
import { SharedController } from "./shared.controller";
import { BullModule } from "@nestjs/bull";
import { FileEntity } from "../files/entities/file.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SharedGateway } from "./shared.gateway";

@Module({
  imports: [
    BullModule.registerQueue({
      name: "audio",
    }),
    TypeOrmModule.forFeature([FileEntity]),
  ],
  exports: [BullModule, TypeOrmModule, SharedGateway], // 将 BullModule 导出以供其他模块使用
  controllers: [SharedController],
  providers: [SharedGateway, SharedService],
})
export class SharedModule {}
