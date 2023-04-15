import { PartialType } from '@nestjs/mapped-types';
import { CreateFileLoaderDto } from './create-file-loader.dto';

export class UpdateFileLoaderDto extends PartialType(CreateFileLoaderDto) {}
