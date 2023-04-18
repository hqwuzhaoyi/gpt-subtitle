import { Test, TestingModule } from '@nestjs/testing';
import { FileLoaderController } from './file-loader.controller';
import { FileLoaderService } from './file-loader.service';

describe('FileLoaderController', () => {
  let controller: FileLoaderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FileLoaderController],
      providers: [FileLoaderService],
    }).compile();

    controller = module.get<FileLoaderController>(FileLoaderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
