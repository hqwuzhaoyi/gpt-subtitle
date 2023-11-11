import { Global, Module } from "@nestjs/common";
import { CustomConfigService } from "./custom-config.service";
import { Config } from "./config.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DatabaseConfigService } from "./config.service";
import { ConfigModule } from "@nestjs/config";
import { ConfigController } from "./config.controller";

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Config]), ConfigModule],
  providers: [DatabaseConfigService, CustomConfigService],
  exports: [CustomConfigService],
  controllers: [ConfigController],
})
export class CustomConfigModule {}
