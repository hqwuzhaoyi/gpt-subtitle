import { Test, TestingModule } from "@nestjs/testing";
import { WhisperController } from "./whisper.controller";
import { WhisperService } from "./whisper.service";

describe("WhisperController", () => {
  let controller: WhisperController;
  let service: WhisperService;

  beforeEach(async () => {
    const mockWhisperService = {};

    const module: TestingModule = await Test.createTestingModule({
      controllers: [WhisperController],
      providers: [{ provide: WhisperService, useValue: mockWhisperService }],
    }).compile();

    controller = module.get<WhisperController>(WhisperController);
    service = module.get<WhisperService>(WhisperService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
