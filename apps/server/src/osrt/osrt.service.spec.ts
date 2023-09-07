import { Test, TestingModule } from "@nestjs/testing";
import { OsrtService } from "./osrt.service";

describe("OsrtService", () => {
  let service: OsrtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OsrtService],
    }).compile();

    service = module.get<OsrtService>(OsrtService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
