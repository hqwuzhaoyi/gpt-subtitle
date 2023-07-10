import { Test, TestingModule } from '@nestjs/testing';
import { WatchController } from './watch.controller';
import { WatchService } from './watch.service';

describe('WatchController', () => {
  let controller: WatchController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WatchController],
      providers: [WatchService],
    }).compile();

    controller = module.get<WatchController>(WatchController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
