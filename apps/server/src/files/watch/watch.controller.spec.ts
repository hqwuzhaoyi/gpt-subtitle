import { Test, TestingModule } from "@nestjs/testing";
import { WatchController } from "./watch.controller";
import { WatchService } from "./watch.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { AudioFileEntity, SubtitleFileEntity, VideoFileEntity } from "../entities/file.entity";

describe("WatchController", () => {
  let controller: WatchController;

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

    controller = module.get<WatchController>(WatchController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
