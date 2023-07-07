import { Test, TestingModule } from '@nestjs/testing';
import { SharedController } from './shared.controller';
import { SharedService } from './shared.service';

describe('SharedController', () => {
  let controller: SharedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SharedController],
      providers: [SharedService],
    }).compile();

    controller = module.get<SharedController>(SharedController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
