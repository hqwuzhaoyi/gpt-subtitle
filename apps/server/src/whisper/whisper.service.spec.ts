import { Test, TestingModule } from '@nestjs/testing';
import { WhisperService } from './whisper.service';

describe('WhisperService', () => {
  let service: WhisperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WhisperService],
    }).compile();

    service = module.get<WhisperService>(WhisperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
