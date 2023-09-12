import { Test, TestingModule } from "@nestjs/testing";
import { TranslateController } from "./translate.controller";
import { TranslateService } from "./translate.service";

describe("TranslateController", () => {
  let controller: TranslateController;
  let service: TranslateService;

  beforeEach(async () => {
    const mockTranslateService = {
      translateFile: jest.fn(),
      translateOneWithId: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TranslateController],
      providers: [
        { provide: TranslateService, useValue: mockTranslateService },
      ],
    }).compile();

    controller = module.get<TranslateController>(TranslateController);
    service = module.get<TranslateService>(TranslateService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should call translateFile", async () => {
    const filename = "testfile";
    const dir = "testdir";
    await controller.translateOne(filename, dir);
    expect(service.translateFile).toHaveBeenCalledWith(filename, dir);
  });

  it("should call translateOneWithId", async () => {
    const id = 1;
    const forceTranslate = false;
    await controller.translateOneWithId(id, forceTranslate);
    expect(service.translateOneWithId).toHaveBeenCalledWith(id, {
      forceTranslate,
    });
  });

  it("should call findAll", () => {
    controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
  });

  // ... more tests
});
