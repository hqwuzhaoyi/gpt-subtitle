import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from "@nestjs/common";

import { CustomConfigService } from "./custom-config.service";
import { Public } from "@/auth/decorators/public.decorator";

@Controller("config")
export class ConfigController {
  constructor(private readonly configService: CustomConfigService) {}

  @Public()
  @Get()
  findAll() {
    return this.configService.getAll();
  }
}
