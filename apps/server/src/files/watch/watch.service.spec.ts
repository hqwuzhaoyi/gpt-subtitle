import { Test, TestingModule } from "@nestjs/testing";
import { WatchController } from "./watch.controller";
import { getRepositoryToken } from "@nestjs/typeorm";
import {
  AudioFileEntity,
  SubtitleFileEntity,
  VideoFileEntity,
} from "../entities/file.entity";

import { WatchService } from "./watch.service";

describe("WatchService", () => {
  let service: WatchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WatchController],
      providers: [
        WatchService,
        {
          provide: getRepositoryToken(VideoFileEntity), // Replace 'VideoFileEntity' with your actual entity name
          useValue: {}, // Mock the repository methods you need
        },
        {
          provide: getRepositoryToken(AudioFileEntity), // Replace 'AudioFileEntity' with your actual entity name
          useValue: {}, // Mock the repository methods you need
        },
        {
          provide: getRepositoryToken(SubtitleFileEntity), // Replace 'SubtitleFileEntity' with your actual entity name
          useValue: {}, // Mock the repository methods you need
        },
        {
          provide: "BullQueue_audio",
          useValue: {}, // Mock the queue methods you need
        },
      ],
    }).compile();

    service = module.get<WatchService>(WatchService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
