import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { OsrtService } from "./osrt.service";
import { CreateOsrtDto } from "./dto/create-osrt.dto";
import { UpdateOsrtDto } from "./dto/update-osrt.dto";

@Controller("osrt")
export class OsrtController {
  constructor(private readonly osrtService: OsrtService) {}

  @Post()
  create(@Body() createOsrtDto: CreateOsrtDto) {
    return this.osrtService.create(createOsrtDto);
  }

  @Get()
  findAll() {
    return this.osrtService.findAll();
  }

  @Get("stop")
  stop() {
    return this.osrtService.stop();
  }

  @Get(":ln/:file")
  findOne(@Param("ln") ln: string, @Param("file") file: string) {
    return this.osrtService.findOne(file, ln);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateOsrtDto: UpdateOsrtDto) {
    return this.osrtService.update(+id, updateOsrtDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.osrtService.remove(+id);
  }
}
