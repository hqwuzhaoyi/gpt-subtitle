import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Sse,
  Query,
  Inject,
} from "@nestjs/common";
import { OsrtService } from "./osrt.service";
import { CreateOsrtDto, FileType } from "./dto/create-osrt.dto";
import { UpdateOsrtDto } from "./dto/update-osrt.dto";
import { Request } from "express";
import { Observable, Subject, filter, interval, map, tap } from "rxjs";
import { IEvent } from "./event.subject";
import { PaginationDto } from "./dto/pagination.dto";

@Controller("osrt")
export class OsrtController {
  constructor(
    private readonly osrtService: OsrtService,
    @Inject("EVENT_SUBJECT") private readonly eventSubject: Subject<IEvent>
  ) {}

  @Post()
  create(@Body() createOsrtDto: CreateOsrtDto) {
    return this.osrtService.create(createOsrtDto);
  }

  @Get("list")
  async list(@Query() paginationDto: PaginationDto) {
    console.debug('paginationDto', paginationDto)
    return await this.osrtService.list(paginationDto);
  }
  @Get("audios")
  async findAudios() {
    return await this.osrtService.findAudios();
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
  @Get("clearAllJobs")
  async clearAllJobs() {
    return await this.osrtService.clearAllJobs();
  }
  @Get("terminateAllJobs")
  async terminateAllJobs() {
    return await this.osrtService.terminateAllJobs();
  }

  @Get(":ln/:id/:model/:priority/:fileType")
  translate(
    @Param("ln") ln: string,
    @Param("id") id: string,
    @Param("model") model: string,
    @Param("priority") priority: number,
    @Param("fileType") fileType?: FileType
  ) {
    return this.osrtService.translate(ln, id, model, priority, fileType);
  }

  @Post(":id/translate")
  translatePost(
    @Param("id") id: string,
    @Body("ln") ln: string,
    @Body("model") model: string,
    @Body("priority") priority: number,
    @Body("fileType") fileType?: FileType
  ) {
    return this.osrtService.translate(ln, id, model, priority, fileType);
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

  @Sse("stream")
  streamEvents(@Query("jobId") jobId: string): Observable<any> {
    return this.eventSubject.asObservable().pipe(
      filter((event) => event.jobId === jobId),
      map((data) => {
        return { data };
      })
    );
  }
}
