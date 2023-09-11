import { Test, TestingModule } from "@nestjs/testing";
import { SubtitleController } from "./subtitle.controller";
import { SubtitleService } from "./subtitle.service";

describe("SubtitleController", () => {
  let controller: SubtitleController;
  let service: SubtitleService;

  beforeEach(async () => {
    const mockSubtitleService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      uploadFile: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubtitleController],
      providers: [{ provide: SubtitleService, useValue: mockSubtitleService }],
    }).compile();

    controller = module.get<SubtitleController>(SubtitleController);
    service = module.get<SubtitleService>(SubtitleService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  // Add more test cases

  // Continue from the previous code block...

  it("should create subtitle", async () => {
    const createSubtitleDto = {
      /* your DTO here */
    };
    (service.create as jest.Mock).mockResolvedValue("someValue");

    expect(await controller.create(createSubtitleDto)).toBe("someValue");
  });

  it("should find all subtitles", async () => {
    (service.findAll as jest.Mock).mockResolvedValue([
      "someValue1",
      "someValue2",
    ]);

    expect(await controller.findAll()).toEqual(["someValue1", "someValue2"]);
  });

  it("should find one subtitle", async () => {
    const id = "1";
    (service.findOne as jest.Mock).mockResolvedValue("someValue");

    expect(await controller.findOne(id)).toBe("someValue");
  });

  it("should update subtitle", async () => {
    const id = "1";
    const updateSubtitleDto = {
      /* your DTO here */
    };
    (service.update as jest.Mock).mockResolvedValue("someValue");

    expect(await controller.update(id, updateSubtitleDto)).toBe("someValue");
  });

  it("should remove subtitle", async () => {
    const id = "1";
    (service.remove as jest.Mock).mockResolvedValue("someValue");

    expect(await controller.remove(id)).toBe("someValue");
  });

  it("should upload subtitle file", async () => {
    const file = {
      /* your file mock here */
    };
    (service.uploadFile as jest.Mock).mockResolvedValue("someValue");

    expect(await controller.uploadFile(file)).toBe("someValue");
  });
});
