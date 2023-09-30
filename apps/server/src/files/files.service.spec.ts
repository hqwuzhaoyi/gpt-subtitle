import { Test, TestingModule } from "@nestjs/testing";
import { FilesService } from "./files.service";
import {
  AudioFileEntity,
  SubtitleFileEntity,
  VideoFileEntity,
} from "./entities/file.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { promises as fsPromises } from "fs";
import { Repository } from "typeorm";
import { describe } from "node:test";

const videoFile1: any = {
  id: 1,
  fileName: "file1.mp4",
  baseName: "file1",
  extName: ".mp4",
  filePath: "/path/to/file1.mp4",
  status: "active",
  fanart: "/path/to/fanart1.jpg",
  poster: "/path/to/poster1.jpg",
};

const videoFile2 = {
  id: 2,
  fileName: "file2.avi",
  baseName: "file2",
  extName: ".avi",
  filePath: "/path/to/file2.avi",
  status: "active",
  fanart: "/path/to/fanart2.jpg",
  poster: "/path/to/poster2.jpg",
};

const expectedVideoFiles: any = [videoFile1, videoFile2];

describe("FilesService", () => {
  let service: FilesService;
  let mockVideoFileRepo: Partial<jest.Mocked<Repository<VideoFileEntity>>>;
  let mockAudioFileRepo: jest.Mocked<Repository<AudioFileEntity>>;
  let mockSubtitleFileRepo: Partial<
    jest.Mocked<Repository<SubtitleFileEntity>>
  >;

  beforeEach(async () => {
    mockSubtitleFileRepo = {
      delete: jest.fn().mockResolvedValue({ raw: { affectedRows: 1 } }),
      find: jest.fn(),
    };

    mockVideoFileRepo = {
      find: jest.fn(),
      findOne: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilesService,
        {
          provide: getRepositoryToken(VideoFileEntity), // Replace 'VideoFileEntity' with your actual entity name
          useValue: mockVideoFileRepo, // Mock the repository methods you need
        },
        {
          provide: getRepositoryToken(AudioFileEntity), // Replace 'AudioFileEntity' with your actual entity name
          useValue: {}, // Mock the repository methods you need
        },
        {
          provide: getRepositoryToken(SubtitleFileEntity), // Replace 'SubtitleFileEntity' with your actual entity name
          useValue: mockSubtitleFileRepo, // Mock the repository methods you need
        },
      ],
    }).compile();

    service = module.get<FilesService>(FilesService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("removeWithPath", () => {
    it("should remove the file and delete the subtitle successfully", async () => {
      // Arrange
      const filePath = "somePath";
      const mockResult = {
        raw: { affectedRows: 1 },
      };
      jest.spyOn(fsPromises, "unlink").mockResolvedValue(undefined);
      mockSubtitleFileRepo.delete.mockResolvedValue(mockResult); // 假设删除成功会返回 { affected: 1 }F

      // Act
      const result = await service.removeWithPath(filePath);

      // Assert
      expect(fsPromises.unlink).toHaveBeenCalledWith(filePath);
      expect(mockSubtitleFileRepo.delete).toHaveBeenCalledWith({
        filePath,
      });
      expect(result).toBe(mockResult);
    });

    it("should throw an error if unlink fails", async () => {
      // Arrange
      const filePath = "somePath";
      jest
        .spyOn(fsPromises, "unlink")
        .mockRejectedValue(new Error("unlink failed"));

      // Act & Assert
      await expect(service.removeWithPath(filePath)).rejects.toThrow(
        "unlink failed"
      );
    });

    it("should throw an error if deleting the subtitle fails", async () => {
      // Arrange
      const filePath = "somePath";
      jest.spyOn(fsPromises, "unlink").mockResolvedValue(undefined);
      mockSubtitleFileRepo.delete.mockRejectedValue(new Error("delete failed"));

      // Act & Assert
      await expect(service.removeWithPath(filePath)).rejects.toThrow(
        "delete failed"
      );
    });
  });

  describe("findVideoFiles", () => {
    it("should find video files", async () => {
      // Arrange

      mockVideoFileRepo.find.mockResolvedValue(expectedVideoFiles);

      // Act
      const result = await service.findVideoFiles();

      // Assert
      expect(result).toBe(expectedVideoFiles);
    });

    it("should find video file by id", async () => {
      mockVideoFileRepo.findOne.mockResolvedValue(videoFile1);

      // Act
      const result = await service.findVideoFile(1);

      // Assert
      expect(result).toBe(videoFile1);
    });

    it("should return related files for video", async () => {
      // Arrange
      const skip = 0;
      const take = 10;

      mockVideoFileRepo.find.mockResolvedValue(expectedVideoFiles);

      // Act
      const result = await service.findRelatedFilesForVideo({ skip, take });

      // Assert
      expect(mockVideoFileRepo.find).toHaveBeenCalledWith({
        relations: ["audioFile", "audioFile.subtitleFiles"],
        skip,
        take,
      });
      expect(result).toEqual(expectedVideoFiles);
    });
  });
});
