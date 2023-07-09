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

  @Get("list")
  async list() {
    return await this.osrtService.list();
  }

  @Get("models")
  async findAllModels() {
    return await this.osrtService.findAllModels();
  }

  @Get("/find/:ln/:file")
  findOne(@Param("ln") ln: string, @Param("file") file: string) {
    return this.osrtService.findOne(ln, file);
  }

  @Get("stop/:processingJobId")
  stop(@Param("processingJobId") processingJobId: string) {
    return this.osrtService.stop(processingJobId);
  }

  @Get("autoStart/:ln/:model")
  autoStart(@Param("ln") ln: string, @Param("model") model: string) {
    return this.osrtService.autoStart(ln, model);
  }

  @Get("currentJobs")
  currentJobs() {
    return this.osrtService.getActiveJobs();
  }

  @Get(":ln/:file/:model/:priority")
  translate(
    @Param("ln") ln: string,
    @Param("file") file: string,
    @Param("model") model: string,
    @Param("priority") priority: number
  ) {
    return this.osrtService.translate(ln, file, model, priority);
  }

  @Post("createJobs") createJobs(@Body() createOsrtDto: CreateOsrtDto[]) {
    return this.osrtService.createJobs(createOsrtDto);
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
