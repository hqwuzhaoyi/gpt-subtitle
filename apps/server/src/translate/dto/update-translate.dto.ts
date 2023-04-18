import { PartialType } from '@nestjs/mapped-types';
import { CreateTranslateDto } from './create-translate.dto';

export class UpdateTranslateDto extends PartialType(CreateTranslateDto) {}
