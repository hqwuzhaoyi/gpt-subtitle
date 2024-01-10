import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { WhisperService } from "./whisper.service";
import { CreateWhisperDto } from "./dto/create-whisper.dto";
import { UpdateWhisperDto } from "./dto/update-whisper.dto";

@Controller("whisper")
export class WhisperController {
  constructor(private readonly whisperService: WhisperService) {}

  @Post()
  create(@Body() createWhisperDto: CreateWhisperDto) {
    return this.whisperService.create(createWhisperDto);
  }

  @Get()
  findAll() {
    return this.whisperService.findAll();
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateWhisperDto: UpdateWhisperDto) {
    return this.whisperService.update(+id, updateWhisperDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.whisperService.remove(+id);
  }

  @Get("models")
  models() {
    return this.whisperService.findAllModels();
  }

  @Get("firstSetUp")
  firstSetUp() {
    return this.whisperService.firstSetUp();
  }
}
