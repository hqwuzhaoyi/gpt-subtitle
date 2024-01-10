import { Module } from '@nestjs/common';
import { WhisperService } from './whisper.service';
import { WhisperController } from './whisper.controller';

@Module({
  controllers: [WhisperController],
  providers: [WhisperService],
})
export class WhisperModule {}
