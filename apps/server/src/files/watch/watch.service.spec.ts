import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Queue } from "bull";
import { WatchService } from "./watch.service";
import {
  VideoFileEntity,
  AudioFileEntity,
  SubtitleFileEntity,
  NfoFileEntity,
} from "../entities/file.entity";
import { CreateWatchDto } from "./dto/create-watch.dto";
import * as fs from "fs";
import * as fg from "fast-glob";
import * as path from "path";
import { getQueueToken } from "@nestjs/bull";

jest.mock("fs");
// jest.mock("cheerio");

describe("WatchService", () => {
  let service: WatchService;
  let mockQueue: Partial<Queue>;
  let watchFilesQueue: Partial<Queue>;
  let mockVideoFileRepo: Partial<Repository<VideoFileEntity>>;
  let mockAudioFileRepo: Partial<Repository<AudioFileEntity>>;
  let mockSubtitleFileRepo: Partial<Repository<SubtitleFileEntity>>;
  let mockNfoFileRepo: Partial<Repository<NfoFileEntity>>;

  beforeEach(async () => {
    mockQueue = {
      add: jest.fn(),
    };

    mockVideoFileRepo = {
      save: jest.fn(),
      update: jest.fn(),
      findOne: jest.fn(),
    };

    mockAudioFileRepo = {
      save: jest.fn(),
      findOne: jest.fn(),
    };

    mockSubtitleFileRepo = {
      save: jest.fn(),
      findOne: jest.fn(),
    };

    watchFilesQueue = {
      add: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WatchService,
        {
          provide: getRepositoryToken(VideoFileEntity),
          useValue: mockVideoFileRepo,
        },
        {
          provide: getRepositoryToken(AudioFileEntity),
          useValue: mockAudioFileRepo,
        },
        {
          provide: getRepositoryToken(SubtitleFileEntity),
          useValue: mockSubtitleFileRepo,
        },
        {
          provide: getRepositoryToken(NfoFileEntity),
          useValue: mockNfoFileRepo,
        },
        {
          provide: "BullQueue_audio",
          useValue: mockQueue,
        },
        {
          provide: getQueueToken("watchFiles"), // This is to mock @InjectQueue('audio')
          useValue: watchFilesQueue,
        },
      ],
    }).compile();

    service = module.get<WatchService>(WatchService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("onModuleInit", () => {
    it("should call dependent methods with no files", async () => {
      // Arrange
      const watchFilesSpy = jest
        .spyOn(service as any, "watchFiles")
        .mockImplementation(() => null);
      const enqueueFileProcessingJobSpy = jest
        .spyOn(service, "enqueueFileProcessingJob")
        .mockResolvedValue(Promise.resolve());
      const fileProcessingQueueSpy = jest
        .spyOn(watchFilesQueue, "add")
        .mockImplementation(() => null);
      const checkNfoFileSpy = jest
        .spyOn(service, "checkNfoFile")
        .mockReturnValue(true);

      // Act
      await service.onModuleInit();

      // Assert
      expect(watchFilesSpy).toHaveBeenCalled();
      expect(enqueueFileProcessingJobSpy).toHaveBeenCalled();
      expect(checkNfoFileSpy).toHaveBeenCalledTimes(0);

      // Cleanup
      watchFilesSpy.mockRestore();
      enqueueFileProcessingJobSpy.mockRestore();
      checkNfoFileSpy.mockRestore();
      fileProcessingQueueSpy.mockRestore();
    });

    it("should call dependent methods with files", async () => {
      // Arrange
      const watchFilesSpy = jest
        .spyOn(service as any, "watchFiles")
        .mockImplementation(() => null);
      const checkNfoFileSpy = jest
        .spyOn(service, "checkNfoFile")
        .mockReturnValue(true);
      const enqueueFileProcessingJobSpy = jest
        .spyOn(service, "enqueueFileProcessingJob")
        .mockResolvedValue(Promise.resolve());

      // Act
      await service.onModuleInit();

      // Assert
      expect(watchFilesSpy).toHaveBeenCalled();
      expect(enqueueFileProcessingJobSpy).toHaveBeenCalled();

      // Cleanup
      watchFilesSpy.mockRestore();
      enqueueFileProcessingJobSpy.mockRestore();
      checkNfoFileSpy.mockRestore();
    });
  });

  describe("addFileToDB", () => {
    it("should classify files and call saveFilesToDB correctly", async () => {
      // Arrange
      const filePaths = [
        "path/to/video.mp4",
        "path/to/audio.mp3",
        "path/to/subtitle.srt",
      ];
      const saveFilesToDBSpy = jest
        .spyOn(service as any, "saveFilesToDB")
        .mockImplementation(async () => {});

      // Act
      await service.addFileToDB(filePaths);

      // Assert
      expect(saveFilesToDBSpy).toHaveBeenCalled();
      expect(saveFilesToDBSpy).toHaveBeenCalledWith({
        videoFiles: ["path/to/video.mp4"],
        audioFiles: ["path/to/audio.mp3"],
        subtitleFiles: ["path/to/subtitle.srt"],
      });
    });
  });

  describe("checkNfoFile", () => {
    it("should return true if nfo file exists", () => {
      // Arrange
      const filePath = "path/to/video.mp4";
      const nfoPath = "path/to/video.nfo";
      (fs.existsSync as jest.Mock).mockReturnValue(true);

      // Act
      const result = service.checkNfoFile(filePath);

      // Assert
      expect(fs.existsSync).toHaveBeenCalledWith(nfoPath);
      expect(result).toBe(true);
    });

    it("should return false if nfo file does not exist", () => {
      // Arrange
      const filePath = "path/to/video.mp4";
      const nfoPath = "path/to/video.nfo";
      (fs.existsSync as jest.Mock).mockReturnValue(false);

      // Act
      const result = service.checkNfoFile(filePath);

      // Assert
      expect(fs.existsSync).toHaveBeenCalledWith(nfoPath);
      expect(result).toBe(false);
    });
  });

  describe("create", () => {
    it("should create a new watch", async () => {
      const createWatchDto: CreateWatchDto = {
        // Initialize your DTO here
      };
      (mockVideoFileRepo.save as jest.Mock).mockResolvedValue("someVideoValue");

      const result = await service.create(createWatchDto);
      expect(result).toBeDefined();
      // 添加其他断言来检查结果
    });
  });

  describe("findAll", () => {
    it("should return an array of watches", async () => {
      const result = await service.findAll();
      expect(typeof result === "string").toBe(true);
      // 添加其他断言来检查结果
    });
  });

  describe("findOne", () => {
    it("should return a single watch", async () => {
      (mockVideoFileRepo.findOne as jest.Mock).mockResolvedValue(
        "someVideoValue"
      );

      const result = await service.findOne(1);
      expect(result).toBeDefined();
      // 添加其他断言来检查结果
    });
  });

  describe("update", () => {
    it("should update and return the updated watch", async () => {
      const updateWatchDto = {
        // Initialize your DTO here
      };
      (mockVideoFileRepo.findOne as jest.Mock).mockResolvedValue(
        "existingValue"
      );

      const result = await service.update(1, updateWatchDto);
      expect(result).toBeDefined();
      // 添加其他断言来检查结果
    });
  });

  describe("remove", () => {
    it("should remove a watch", async () => {
      (mockVideoFileRepo.findOne as jest.Mock).mockResolvedValue("someValue");

      const result = await service.remove(1);
      expect(result).toBeDefined();
      // 添加其他断言来检查结果
    });
  });

  // Add more test cases here
});
