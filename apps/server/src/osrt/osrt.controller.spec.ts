import { Test, TestingModule } from "@nestjs/testing";
import { OsrtController } from "./osrt.controller";
import { OsrtService } from "./osrt.service";

describe("OsrtController", () => {
  let controller: OsrtController;
  let service: OsrtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OsrtController],
      providers: [
        {
          provide: OsrtService,
          useValue: {
            create: jest.fn(),
            list: jest.fn(),
            // 添加其他方法的模拟实现
          },
        },
      ],
    }).compile();

    controller = module.get<OsrtController>(OsrtController);
    service = module.get<OsrtService>(OsrtService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("create", () => {
    it("should create a task", async () => {
      const result = "some result";
      jest.spyOn(service, "create").mockImplementation(() => result);

      expect(await controller.create({} as any)).toBe(result);
    });
  });

  // 其他测试
});
