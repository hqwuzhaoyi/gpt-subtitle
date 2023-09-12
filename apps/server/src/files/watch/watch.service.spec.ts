import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Queue } from "bull";
import { WatchService } from "./watch.service";
import {
  VideoFileEntity,
  AudioFileEntity,
  SubtitleFileEntity,
} from "../entities/file.entity";
import { CreateWatchDto } from "./dto/create-watch.dto";
import * as fs from "fs";
import * as fg from "fast-glob";
import * as path from "path";

jest.mock("fs");
// jest.mock("cheerio");

describe("WatchService", () => {
  let service: WatchService;
  let mockQueue: Partial<Queue>;
  let mockVideoFileRepo: Partial<Repository<VideoFileEntity>>;
  let mockAudioFileRepo: Partial<Repository<AudioFileEntity>>;
  let mockSubtitleFileRepo: Partial<Repository<SubtitleFileEntity>>;

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
          provide: "BullQueue_audio",
          useValue: mockQueue,
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
      const findAndClassifyFilesSpy = jest
        .spyOn(service, "findAndClassifyFiles")
        .mockResolvedValue({
          videoFiles: [],
          audioFiles: [],
          subtitleFiles: [],
        });
      const saveFilesToDBSpy = jest
        .spyOn(service as any, "saveFilesToDB")
        .mockImplementation(() => null);
      const checkNfoFileSpy = jest
        .spyOn(service, "checkNfoFile")
        .mockReturnValue(true);
      const updateVideoImageSpy = jest
        .spyOn(service, "updateVideoImage")
        .mockImplementation(() => null);
      // Act
      await service.onModuleInit();

      // Assert
      expect(watchFilesSpy).toHaveBeenCalled();
      expect(findAndClassifyFilesSpy).toHaveBeenCalled();
      expect(saveFilesToDBSpy).toHaveBeenCalledWith({
        videoFiles: [],
        audioFiles: [],
        subtitleFiles: [],
      });
      expect(checkNfoFileSpy).toHaveBeenCalledTimes(0);
      expect(updateVideoImageSpy).toHaveBeenCalledTimes(0);

      // Cleanup
      watchFilesSpy.mockRestore();
      findAndClassifyFilesSpy.mockRestore();
      saveFilesToDBSpy.mockRestore();
      checkNfoFileSpy.mockRestore();
      updateVideoImageSpy.mockRestore();
    });

    it("should call dependent methods with files", async () => {
      // Arrange
      const watchFilesSpy = jest
        .spyOn(service as any, "watchFiles")
        .mockImplementation(() => null);
      const saveFilesToDBSpy = jest
        .spyOn(service as any, "saveFilesToDB")
        .mockImplementation(() => null);
      const checkNfoFileSpy = jest
        .spyOn(service, "checkNfoFile")
        .mockReturnValue(true);
      const updateVideoImageSpy = jest
        .spyOn(service, "updateVideoImage")
        .mockImplementation(() => null);
      const findAndClassifyFilesSpy = jest
        .spyOn(service, "findAndClassifyFiles")
        .mockResolvedValue({
          videoFiles: ["test1.mp4"],
          audioFiles: [],
          subtitleFiles: [],
        });

      // Act
      await service.onModuleInit();

      // Assert
      expect(watchFilesSpy).toHaveBeenCalled();
      expect(findAndClassifyFilesSpy).toHaveBeenCalled();
      expect(saveFilesToDBSpy).toHaveBeenCalledWith({
        videoFiles: ["test1.mp4"],
        audioFiles: [],
        subtitleFiles: [],
      });
      expect(checkNfoFileSpy).toHaveBeenCalledTimes(1);
      expect(updateVideoImageSpy).toHaveBeenCalledTimes(1);

      // Cleanup
      watchFilesSpy.mockRestore();
      findAndClassifyFilesSpy.mockRestore();
      saveFilesToDBSpy.mockRestore();
      checkNfoFileSpy.mockRestore();
      updateVideoImageSpy.mockRestore();
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

  describe("getNfoImage", () => {
    it("should return image paths if nfo file contains them", () => {
      // Arrange
      const filePath = "path/to/video.mp4";
      const nfoPath = "path/to/video.nfo";
      const mockNfoContent =
        "<poster>poster.jpg</poster><fanart>fanart.jpg</fanart>";
      (fs.readFileSync as jest.Mock).mockReturnValue(mockNfoContent);
      (fs.existsSync as jest.Mock).mockReturnValue(true);

      // Act
      const result = service.getNfoImage(filePath);

      // Assert
      expect(fs.readFileSync).toHaveBeenCalledWith(nfoPath, "utf-8");
      expect(fs.existsSync).toBeCalled(); // Or the exact number of times it should be called
      expect(result).toEqual({
        poster: "poster.jpg",
        fanart: "fanart.jpg",
      });
    });

    it("should return null if nfo file does not contain image paths", () => {
      // Arrange
      const filePath = "path/to/video.mp4";
      const nfoPath = "path/to/video.nfo";
      const mockNfoContent = "<noimage></noimage>";
      (fs.readFileSync as jest.Mock).mockReturnValue(mockNfoContent);
      // Act
      const result = service.getNfoImage(filePath);

      // Assert
      expect(fs.readFileSync).toHaveBeenCalledWith(nfoPath, "utf-8");
      expect(result).toEqual({
        poster: null,
        fanart: null,
      });
    });

    // Add more test cases for different scenarios
  });

  describe("updateVideoImage", () => {
    beforeEach(() => {
      jest
        .spyOn(service, "getNfoImage")
        .mockReturnValue({ poster: "poster.jpg", fanart: "fanart.jpg" });
    });

    it("should update video image if file exists", async () => {
      // Arrange
      const filePath = "path/to/video.mp4";
      const poster = "path/to/poster.jpg";
      const fanart = "path/to/fanart.jpg";
      jest.spyOn(service, "getNfoImage").mockReturnValue({ poster, fanart });

      // Act
      const result = await service.updateVideoImage(filePath);

      // Assert
      expect(service.getNfoImage).toHaveBeenCalledWith(filePath);
      expect(mockVideoFileRepo.update).toHaveBeenCalledWith(
        { filePath },
        { poster, fanart }
      );
    });
  });

  describe("findAndClassifyFiles", () => {
    it("should classify files correctly", async () => {
      // Arrange
      const fakeStream = [
        "path/to/video.mp4",
        "path/to/audio.mp3",
        "path/to/subtitle.srt",
        "path/to/other.xyz",
      ][Symbol.iterator]();
      jest.spyOn(fg, "stream").mockReturnValue(fakeStream as any);
      jest.spyOn(path, "join").mockReturnValue("path/join/result");

      // Act
      const result = await service.findAndClassifyFiles();

      // Assert
      expect(result).toEqual({
        videoFiles: ["path/to/video.mp4"],
        audioFiles: ["path/to/audio.mp3"],
        subtitleFiles: ["path/to/subtitle.srt"],
      });
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
