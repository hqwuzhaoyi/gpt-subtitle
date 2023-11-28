import { Test, TestingModule } from "@nestjs/testing";
import { TranslateService } from "./translate.service";
import { FilesService } from "@/files/files.service";
import * as fs from "fs";
import * as path from "path";
import { CustomConfigService } from "@/config/custom-config.service";

// Mocking fs and path modules

// jest.mock("path");

jest.mock("fs", () => ({
  existsSync: jest.fn((filePath, dir) => {
    if (filePath.includes("exist-dir")) {
      return true;
    }
    return false;
  }),
}));

jest.mock("translator", () => {
  return {
    TranslateModel: jest.fn().mockImplementation(() => {
      return {
        translateSrtStreamGroup: jest.fn().mockResolvedValue(true),
        // 其他方法也可以在这里模拟
      };
    }),
    TranslateType: {
      GOOGLE: "google",
      GPT3: "gpt3",
    },
  };
});

describe("TranslateService", () => {
  let service: TranslateService;
  let mockFilesService;

  beforeEach(async () => {
    mockFilesService = {
      findSubtitleFile: jest.fn().mockReturnValue({
        filePath: "/some-file.txt",
        fileName: "some-file.txt",
      }),
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TranslateService,
        { provide: "STATIC_DIR", useValue: "/static" },
        { provide: FilesService, useValue: mockFilesService },
        {
          provide: CustomConfigService,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TranslateService>(TranslateService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("existFile", () => {
    const fileName = "some-file.txt";
    const existDir = "/exist-dir";
    const notExistDir = "/not-exist--dir";

    it("should return file URL if file exists", () => {
      const result = service.existFile(fileName, existDir);

      expect(result).toBe(
        process.env.NEXT_PUBLIC_API_URL + "/static/exist-dir/some-file.txt"
      );
    });

    it("should return false if file does not exist", () => {
      const result = service.existFile(fileName, notExistDir);
      expect(result).toBe(false);
    });
  });

  // describe("translateFileName", () => {
  //   it("should return translated file name", () => {
  //     path.parse = jest.fn().mockReturnValue({ name: "file", ext: ".txt" });
  //     const result = service.translateFileName("file.txt");
  //     expect(result).toEqual(expect.stringContaining("file."));
  //   });
  // });

  // ... add more tests

  describe("translateFile", () => {
    it("should translate the file and return url", async () => {
      const result = await service.translateFile("filename.txt");
      expect(result).toBeDefined();
      // add more specific expectations here
    });
  });

  describe("translateOneWithId", () => {
    it("should translate the file with ID and return url", async () => {
      const result = await service.translateOneWithId(1);
      expect(result).toBeDefined();
    });
  });
});
