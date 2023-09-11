import { Test, TestingModule } from "@nestjs/testing";
import { SubtitleService } from "./subtitle.service";
import { FilesService } from "@/files/files.service";
import { WatchService } from "@/files/watch/watch.service";

describe("SubtitleService", () => {
  let service: SubtitleService;
  let filesService: FilesService;
  let watchService: WatchService;

  beforeEach(async () => {
    const mockFilesService = {
      findSubtitleFiles: jest.fn(),
      findSubtitleFile: jest.fn(),
      removeWithPath: jest.fn(),
    };

    const mockWatchService = {
      addFileToDB: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubtitleService,
        { provide: FilesService, useValue: mockFilesService },
        { provide: WatchService, useValue: mockWatchService },
        { provide: "STATIC_DIR", useValue: "/static" },
      ],
    }).compile();

    service = module.get<SubtitleService>(SubtitleService);
    filesService = module.get<FilesService>(FilesService);
    watchService = module.get<WatchService>(WatchService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should create a subtitle", () => {
    const result = service.create({
      /* createSubtitleDto */
    });
    expect(result).toEqual("This action adds a new subtitle");
  });

  it("should find all subtitles", async () => {
    (filesService.findSubtitleFiles as jest.Mock).mockResolvedValue([
      { filePath: "file1" },
      { filePath: "file2" },
    ]);
    const result = await service.findAll();
    expect(result).toHaveLength(2);
  });

  // ... More tests for other methods
});
