import { Test, TestingModule } from "@nestjs/testing";
import { UploadService } from "./upload.service";

describe("UploadService", () => {
  let service: UploadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UploadService],
    }).compile();

    service = module.get<UploadService>(UploadService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("create", () => {
    it("should return a create upload message", () => {
      expect(service.create({})).toEqual("This action adds a new upload");
    });
  });

  describe("getAllFiles", () => {
    it("should return all files", async () => {
      const result = await service.getAllFiles();
      expect(result).toEqual([]);
    });
  });

  describe("uploadFile", () => {
    it("should upload a file and return its details", async () => {
      const mockFile = {
        originalname: "test.jpg",
        filename: "test.jpg",
      };

      const result = await service.uploadFile(mockFile as Express.Multer.File);
      expect(result).toEqual({
        originalname: "test.jpg",
        filename: "test.jpg",
        url: expect.stringContaining("test.jpg"),
      });

      const allFiles = await service.getAllFiles();
      expect(allFiles).toEqual([mockFile]);
    });
  });

  // ...你可以添加更多测试来涵盖其他方法
});
