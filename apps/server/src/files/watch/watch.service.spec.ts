import { Test, TestingModule } from '@nestjs/testing';
import { WatchService } from './watch.service';

describe('WatchService', () => {
  let service: WatchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WatchService],
    }).compile();

    service = module.get<WatchService>(WatchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
