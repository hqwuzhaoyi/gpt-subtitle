import { Module, Provider } from "@nestjs/common";
import { SharedService } from "./shared.service";
import { SharedController } from "./shared.controller";
import { BullModule } from "@nestjs/bull";
import {
  VideoFileEntity,
  AudioFileEntity,
  SubtitleFileEntity,
  NfoFileEntity,
} from "@/files/entities/file.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SharedGateway } from "./shared.gateway";
import { BullBoardModule } from "@bull-board/nestjs";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { eventSubject } from "@/osrt/event.subject";

const EventSubjectProvider = {
  provide: "EVENT_SUBJECT",
  useValue: eventSubject, // 或者 eventSubject，取决于您如何初始化它
};

@Module({
  imports: [
    BullModule.registerQueue(
      ...[
        {
          name: "audio",
        },
        {
          name: "watchFiles",
        },
      ]
    ),
    BullBoardModule.forFeature(
      ...[
        {
          name: "audio",
          adapter: BullMQAdapter,
        },
        {
          name: "watchFiles",
          adapter: BullMQAdapter,
        },
      ]
    ),
    TypeOrmModule.forFeature([
      VideoFileEntity,
      AudioFileEntity,
      SubtitleFileEntity,
      NfoFileEntity,
    ]),
  ],
  exports: [BullModule, TypeOrmModule, SharedGateway, EventSubjectProvider], // 将 BullModule 导出以供其他模块使用
  controllers: [SharedController],
  providers: [SharedGateway, SharedService, EventSubjectProvider],
})
export class SharedModule {}
