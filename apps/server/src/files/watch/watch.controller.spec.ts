import { Test, TestingModule } from "@nestjs/testing";
import { WatchController } from "./watch.controller";
import { WatchService } from "./watch.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import {
  AudioFileEntity,
  SubtitleFileEntity,
  VideoFileEntity,
} from "../entities/file.entity";
import { CreateWatchDto } from "./dto/create-watch.dto";

describe("WatchController", () => {
  let controller: WatchController;
  let service: jest.Mocked<WatchService>;

  beforeEach(async () => {
    const mockService = {
      create: jest.fn().mockResolvedValue("someValue"),
      findAll: jest.fn().mockResolvedValue(["someValue"]),
      findOne: jest.fn().mockResolvedValue("someValue"),
      update: jest.fn().mockResolvedValue("someValue"),
      remove: jest.fn().mockResolvedValue("someValue"),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [WatchController],
      providers: [
        {
          provide: WatchService,
          useValue: mockService,
        },
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

    controller = module.get<WatchController>(WatchController);
    service = module.get<WatchService>(
      WatchService
    ) as jest.Mocked<WatchService>;
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should create a watch", async () => {
    const createWatchDto: CreateWatchDto = {
      /* fill this object */
    };
    (service.create as jest.Mock).mockResolvedValue("someValue");
    expect(await controller.create(createWatchDto)).toBe("someValue");
  });

  it("should find all watches", async () => {
    (service.findAll as jest.Mock).mockResolvedValue(["someValue"]);
    expect(await controller.findAll()).toEqual(["someValue"]);
  });

  it("should find one watch", async () => {
    (service.findOne as jest.Mock).mockResolvedValue("someValue");
    expect(await controller.findOne("1")).toBe("someValue");
  });

  it("should update a watch", async () => {
    const updateWatchDto = {};
    (service.update as jest.Mock).mockResolvedValue("someValue");
    expect(await controller.update("1", updateWatchDto)).toBe("someValue");
  });

  it("should remove a watch", async () => {
    (service.remove as jest.Mock).mockResolvedValue("someValue");
    expect(await controller.remove("1")).toBe("someValue");
  });
});
