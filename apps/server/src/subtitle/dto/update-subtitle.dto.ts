import { PartialType } from '@nestjs/mapped-types';
import { CreateSubtitleDto } from './create-subtitle.dto';

export class UpdateSubtitleDto extends PartialType(CreateSubtitleDto) {}
