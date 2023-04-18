import { Test, TestingModule } from '@nestjs/testing';
import { TranslateController } from './translate.controller';
import { TranslateService } from './translate.service';

describe('TranslateController', () => {
  let controller: TranslateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TranslateController],
      providers: [TranslateService],
    }).compile();

    controller = module.get<TranslateController>(TranslateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
