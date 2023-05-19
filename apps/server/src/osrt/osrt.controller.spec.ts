import { Test, TestingModule } from '@nestjs/testing';
import { OsrtController } from './osrt.controller';
import { OsrtService } from './osrt.service';

describe('OsrtController', () => {
  let controller: OsrtController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OsrtController],
      providers: [OsrtService],
    }).compile();

    controller = module.get<OsrtController>(OsrtController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
