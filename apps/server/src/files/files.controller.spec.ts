import { Test, TestingModule } from "@nestjs/testing";
import { FilesController } from "./files.controller";
import { FilesService } from "./files.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import {
  AudioFileEntity,
  SubtitleFileEntity,
  VideoFileEntity,
} from "./entities/file.entity";

describe("FilesController", () => {
  let controller: FilesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilesController],
      providers: [
        FilesService,
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

    controller = module.get<FilesController>(FilesController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
