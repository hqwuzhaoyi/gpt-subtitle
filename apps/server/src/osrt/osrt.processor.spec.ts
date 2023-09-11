import { Test, TestingModule } from "@nestjs/testing";
import { QueueProcessor } from "./osrt.processor";
import { OsrtService } from "./osrt.service";
import { SharedGateway } from "../shared/shared.gateway";
import { FilesService } from "@/files/files.service";
import { WatchService } from "@/files/watch/watch.service";
import { Job } from "bull";

describe("QueueProcessor", () => {
  let processor: QueueProcessor;
  let osrtService: OsrtService;
  let sharedGateway: SharedGateway;
  let filesService: FilesService;
  let watchService: WatchService;

  const subtitlePath = "subtitlePath";
  const audioPath = "audioPath";
  const videoPath = "videoPath";
  const fileBaseName = "fileBaseName";
  const translateLanguage = "translateLanguage";
  const translateModel = "translateModel";
  const translateResult = "translateResult";

  beforeEach(async () => {
    const mockOsrtService = {
      // mock your methods
      findFileThenTranslate: jest
        .fn()
        .mockResolvedValue([{ path: translateResult }]),
    };
    const mockSharedGateway = {
      // mock your methods
      notifyClient: jest.fn(),
    };
    const mockFilesService = {
      // mock your methods
      findVideoFile: jest.fn().mockResolvedValue({
        filePath: videoPath,
        audioFile: {
          filePath: audioPath,
          subtitleFiles: [
            {
              filePath: subtitlePath,
            },
          ],
        },
        baseName: fileBaseName,
      }),
      findAudioFile: jest.fn(),
    };
    const mockWatchService = {
      // mock your methods
      addFileToDB: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QueueProcessor,
        { provide: OsrtService, useValue: mockOsrtService },
        { provide: SharedGateway, useValue: mockSharedGateway },
        { provide: FilesService, useValue: mockFilesService },
        { provide: WatchService, useValue: mockWatchService },
      ],
    }).compile();

    processor = module.get<QueueProcessor>(QueueProcessor);
    osrtService = module.get<OsrtService>(OsrtService);
    sharedGateway = module.get<SharedGateway>(SharedGateway);
    filesService = module.get<FilesService>(FilesService);
    watchService = module.get<WatchService>(WatchService);
  });

  it("should be defined", () => {
    expect(processor).toBeDefined();
  });

  describe("handleTranslationJob", () => {
    it("should handle translation job", async () => {
      const jobId = "some_id";
      const jobData = {
        // your job data
        fileType: "video",
        language: translateLanguage,
        model: translateModel,
      };
      const job: Job = {
        // mock your job
        id: jobId,
        data: jobData,
      } as any;

      // Mock your services methods and set expectations

      await processor.handleTranslationJob(job);

      // Expect your services methods have been called with correct arguments
      expect(osrtService.findFileThenTranslate).toHaveBeenCalledWith(
        {
          audioPath,
          fileName: fileBaseName,
          language: translateLanguage,
          model: translateModel,
          srtFile: fileBaseName + ".srt",
          srtPath: subtitlePath,
          videoPath: videoPath,
        },
        {
          data: jobData,
          id: jobId,
        }
      );
      expect(sharedGateway.notifyClient).toHaveBeenCalledWith(
        job.id,
        "start",
        job.data
      );
      expect(watchService.addFileToDB).toHaveBeenCalledWith([translateResult]);

      expect(sharedGateway.notifyClient).toHaveBeenLastCalledWith(
        job.id,
        "completed" /* your expected data */,
        {
          ...jobData,
          subTitle: [
            {
              path: translateResult,
            },
          ],
        }
      );

      // ... other expects
    });

    it("should handle translation job with error", async () => {
      const job: Job = {
        id: "some_id",
        data: {},
      } as any;

      await processor.handleTranslationJob(job);

      expect(sharedGateway.notifyClient).toHaveBeenCalledWith(
        job.id,
        "failed",
        "Unsupported file type undefined"
      );
    });
  });

  // Add more tests
});
