import { PartialType } from '@nestjs/mapped-types';
import { CreateWhisperDto } from './create-whisper.dto';

export class UpdateWhisperDto extends PartialType(CreateWhisperDto) {}
