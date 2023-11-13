import { Test, TestingModule } from "@nestjs/testing";
import { DatabaseConfigService } from "./config.service";
import { Config } from "./config.entity";
import { getRepositoryToken } from "@nestjs/typeorm";

describe("ConfigService", () => {
  let service: DatabaseConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DatabaseConfigService,
        {
          provide: getRepositoryToken(Config),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<DatabaseConfigService>(DatabaseConfigService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
