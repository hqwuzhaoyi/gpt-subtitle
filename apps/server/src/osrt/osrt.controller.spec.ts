import { Test, TestingModule } from "@nestjs/testing";
import { OsrtController } from "./osrt.controller";
import { OsrtService } from "./osrt.service";
import { CreateOsrtDto } from "./dto/create-osrt.dto";

describe("OsrtController", () => {
  let controller: OsrtController;
  let service: OsrtService;

  beforeEach(async () => {
    const mockService = {
      create: jest.fn(),
      list: jest.fn(),
      findAudios: jest.fn(),
      // ...其他方法
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OsrtController],
      providers: [{ provide: OsrtService, useValue: mockService }],
    }).compile();

    controller = module.get<OsrtController>(OsrtController);
    service = module.get<OsrtService>(OsrtService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("create", () => {
    it("should create an osrt", async () => {
      const createOsrtDto: CreateOsrtDto = {
        id: "string",
        language: "string",
        model: "string",
      };
      const expectedResult = "some result";

      (service.create as jest.Mock).mockResolvedValue(expectedResult);

      expect(await controller.create(createOsrtDto)).toBe(expectedResult);
      expect(service.create).toHaveBeenCalledWith(createOsrtDto);
    });
  });

  describe("list", () => {
    it("should list osrts", async () => {
      const expectedResult = [
        /* some list */
      ];

      (service.list as jest.Mock).mockResolvedValue(expectedResult);

      expect(
        await controller.list({ headers: { host: "localhost" } } as any)
      ).toBe(expectedResult);
      expect(service.list).toHaveBeenCalled();
    });
  });

  // ...其他方法的测试
});
