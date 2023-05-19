import { Module } from '@nestjs/common';
import { OsrtService } from './osrt.service';
import { OsrtController } from './osrt.controller';

@Module({
  controllers: [OsrtController],
  providers: [OsrtService]
})
export class OsrtModule {}
