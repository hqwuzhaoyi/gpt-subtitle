import { PartialType } from '@nestjs/mapped-types';
import { CreateOsrtDto } from './create-osrt.dto';

export class UpdateOsrtDto extends PartialType(CreateOsrtDto) {}
