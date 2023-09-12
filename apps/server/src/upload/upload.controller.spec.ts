import { Test, TestingModule } from "@nestjs/testing";
import { UploadController } from "./upload.controller";
import { UploadService } from "./upload.service";

describe("UploadController", () => {
  let controller: UploadController;
  let service: UploadService;

  beforeEach(async () => {
    const mockService = {
      getAllFiles: jest.fn().mockResolvedValue(["file1", "file2"]),
      uploadFile: jest.fn().mockResolvedValue("success"),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadController],
      providers: [
        {
          provide: UploadService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<UploadController>(UploadController);
    service = module.get<UploadService>(UploadService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("getAllFiles", () => {
    it("should get all files", async () => {
      const result = await controller.getAllFiles();
      expect(result).toEqual(["file1", "file2"]);
    });
  });

  describe("uploadFile", () => {
    it("should upload a file", async () => {
      const mockFile = {
        originalname: "test.jpg",
        filename: "test.jpg",
      };

      const result = await controller.uploadFile(mockFile);
      expect(result).toEqual("success");
    });
  });
});
