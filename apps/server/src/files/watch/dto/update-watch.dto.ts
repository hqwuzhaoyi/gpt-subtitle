import { PartialType } from '@nestjs/mapped-types';
import { CreateWatchDto } from './create-watch.dto';

export class UpdateWatchDto extends PartialType(CreateWatchDto) {}
