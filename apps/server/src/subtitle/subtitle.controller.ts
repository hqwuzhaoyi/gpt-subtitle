import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from "@nestjs/common";
import { SubtitleService } from "./subtitle.service";
import { CreateSubtitleDto } from "./dto/create-subtitle.dto";
import { UpdateSubtitleDto } from "./dto/update-subtitle.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { uploadDir } from "@/utils/uploadsUtils";
import * as path from "path";

@Controller("subtitle")
export class SubtitleController {
  constructor(private readonly subtitleService: SubtitleService) {}

  @Post()
  create(@Body() createSubtitleDto: CreateSubtitleDto) {
    return this.subtitleService.create(createSubtitleDto);
  }

  @Get()
  findAll() {
    return this.subtitleService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.subtitleService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateSubtitleDto: UpdateSubtitleDto
  ) {
    return this.subtitleService.update(+id, updateSubtitleDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    console.debug("remove subtitle", id);
    return this.subtitleService.remove(+id);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: path.join(uploadDir, "subtitle"),
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + "-" + Math.round(Math.random() * 1e9);
          const fileExt = path.extname(file.originalname);
          const fileName = file.originalname.replace(fileExt, "");
          cb(null, `${fileName}${fileExt}`);
        },
      }),
    })
  )
  async uploadFile(@UploadedFile() file) {
    console.log(file);

    return this.subtitleService.uploadFile(file);
  }
}
