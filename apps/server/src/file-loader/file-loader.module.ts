import { Module } from '@nestjs/common';
import { FileLoaderService } from './file-loader.service';
import { FileLoaderController } from './file-loader.controller';

@Module({
  controllers: [FileLoaderController],
  providers: [FileLoaderService]
})
export class FileLoaderModule {}
