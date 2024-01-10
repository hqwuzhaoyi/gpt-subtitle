import { Test, TestingModule } from "@nestjs/testing";
import { OsrtController } from "./osrt.controller";
import { OsrtService } from "./osrt.service";
import { CreateOsrtDto } from "./dto/create-osrt.dto";
import { Subject } from "rxjs";

const req = { headers: { host: "localhost" } } as any;

describe("OsrtController", () => {
  let controller: OsrtController;
  let service: OsrtService;
  let mockSubject: Subject<any>;

  beforeEach(async () => {
    const mockService = {
      create: jest.fn(),
      list: jest.fn(),
      findAudios: jest.fn(),
      findAllModels: jest.fn(),
      findOne: jest.fn(),
      stop: jest.fn(),
      autoStart: jest.fn(),
      getActiveJobs: jest.fn(),
      clearAllJobs: jest.fn(),
      terminateAllJobs: jest.fn(),
      translate: jest.fn(),
      createJobs: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };
    mockSubject = new Subject<any>();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OsrtController],
      providers: [
        { provide: OsrtService, useValue: mockService },
        { provide: "EVENT_SUBJECT", useValue: mockSubject },
      ],
    }).compile();

    controller = module.get<OsrtController>(OsrtController);
    service = module.get<OsrtService>(OsrtService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("post", () => {
    it("should create an osrt", async () => {
      const expectedResult = "This action adds a new osrt";

      (service.create as jest.Mock).mockResolvedValue(expectedResult);

      expect(await controller.create(req)).toBe(expectedResult);
    });
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

  describe("findAudios", () => {
    it("should findAudios", async () => {
      const expectedResult = [
        /* some list */
      ];

      (service.findAudios as jest.Mock).mockResolvedValue(expectedResult);

      expect(await controller.findAudios()).toBe(expectedResult);
      expect(service.findAudios).toHaveBeenCalled();
    });
  });

  describe("findOne", () => {
    it("should findOne", async () => {
      const expectedResult = {
        /* some object */
      };

      (service.findOne as jest.Mock).mockResolvedValue(expectedResult);

      expect(await controller.findOne("ln", "file")).toBe(expectedResult);
      expect(service.findOne).toHaveBeenCalled();
    });
  });

  describe("stop", () => {
    it("should stop", async () => {
      const expectedResult = {
        /* some object */
      };

      (service.stop as jest.Mock).mockResolvedValue(expectedResult);

      expect(await controller.stop("processingJobId")).toBe(expectedResult);
      expect(service.stop).toHaveBeenCalled();
    });
  });

  describe("autoStart", () => {
    it("should autoStart", async () => {
      const expectedResult = {
        /* some object */
      };

      (service.autoStart as jest.Mock).mockResolvedValue(expectedResult);

      expect(await controller.autoStart("ln", "model")).toBe(expectedResult);
      expect(service.autoStart).toHaveBeenCalled();
    });
  });

  describe("getActiveJobs", () => {
    it("should getActiveJobs", async () => {
      const expectedResult = [
        /* some list */
      ];

      (service.getActiveJobs as jest.Mock).mockResolvedValue(expectedResult);

      expect(await controller.currentJobs()).toBe(expectedResult);
      expect(service.getActiveJobs).toHaveBeenCalled();
    });
  });

  describe("clearAllJobs", () => {
    it("should clearAllJobs", async () => {
      const expectedResult = [
        /* some list */
      ];

      (service.clearAllJobs as jest.Mock).mockResolvedValue(expectedResult);

      expect(await controller.clearAllJobs()).toBe(expectedResult);
      expect(service.clearAllJobs).toHaveBeenCalled();
    });
  });

  describe("terminateAllJobs", () => {
    it("should terminateAllJobs", async () => {
      const expectedResult = [
        /* some list */
      ];

      (service.terminateAllJobs as jest.Mock).mockResolvedValue(expectedResult);

      expect(await controller.terminateAllJobs()).toBe(expectedResult);
      expect(service.terminateAllJobs).toHaveBeenCalled();
    });
  });

  describe("translate", () => {
    it("should translate", async () => {
      const expectedResult = {
        /* some object */
      };

      (service.translate as jest.Mock).mockResolvedValue(expectedResult);

      expect(await controller.translate("ln", "id", "model", 1, "video")).toBe(
        expectedResult
      );
      expect(service.translate).toHaveBeenCalled();
    });
  });

  describe("translatePost", () => {
    it("should translatePost", async () => {
      const expectedResult = {
        /* some object */
      };

      (service.translate as jest.Mock).mockResolvedValue(expectedResult);

      expect(
        await controller.translatePost("id", "ln", "model", 1, "video")
      ).toBe(expectedResult);
      expect(service.translate).toHaveBeenCalled();
    });
  });
  describe("update", () => {
    it("should update", async () => {
      const expectedResult = {
        /* some object */
      };

      (service.update as jest.Mock).mockResolvedValue(expectedResult);

      expect(await controller.update("id", {})).toBe(expectedResult);
    });
  });
  describe("remove", () => {
    it("should remove", async () => {
      const expectedResult = {
        /* some object */
      };

      (service.remove as jest.Mock).mockResolvedValue(expectedResult);

      expect(await controller.remove("id")).toBe(expectedResult);
    });
  });

  describe("createJobs", () => {
    it("should createJobs", async () => {
      const expectedResult = {
        /* some object */
      };

      (service.createJobs as jest.Mock).mockResolvedValue(expectedResult);
      const jobs = [
        {
          id: "string",
          language: "string",
          model: "string",
        },
      ];

      expect(await controller.createJobs(jobs)).toBe(expectedResult);
      expect(service.createJobs).toHaveBeenCalled();
    });
  });
});
