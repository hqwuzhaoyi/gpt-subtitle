import { Test, TestingModule } from '@nestjs/testing';
import { SubtitleController } from './subtitle.controller';
import { SubtitleService } from './subtitle.service';

describe('SubtitleController', () => {
  let controller: SubtitleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubtitleController],
      providers: [SubtitleService],
    }).compile();

    controller = module.get<SubtitleController>(SubtitleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
