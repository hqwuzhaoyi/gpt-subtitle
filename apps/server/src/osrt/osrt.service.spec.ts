import { Test, TestingModule } from "@nestjs/testing";
import { QueueProcessor } from "./osrt.processor";
import { OsrtService } from "./osrt.service";
import { SharedGateway } from "../shared/shared.gateway";
import { FilesService } from "@/files/files.service";
import { WatchService } from "@/files/watch/watch.service";
// import { Job } from "bull";
import { TranslateService } from "@/translate/translate.service";
import Bull, { JobStatusClean, Queue } from "bull";
import { getQueueToken } from "@nestjs/bull";
import { Subject } from "rxjs";
describe("OsrtService", () => {
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
  let mockSubject: Subject<any>;
  beforeEach(async () => {
    mockSubject = new Subject<any>();
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

    const mockAudioQueue = {};

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OsrtService,
        {
          provide: getQueueToken("audio"), // This is to mock @InjectQueue('audio')
          useValue: mockAudioQueue,
        },
        { provide: FilesService, useValue: mockFilesService },
        { provide: TranslateService, useValue: mockWatchService },
        {
          provide: "STATIC_DIR",
          useValue: "/static",
        },
        { provide: "EVENT_SUBJECT", useValue: mockSubject },
      ],
    }).compile();

    osrtService = module.get<OsrtService>(OsrtService);
  });

  it("should be defined", () => {
    expect(osrtService).toBeDefined();
  });

  // Add more tests
});
