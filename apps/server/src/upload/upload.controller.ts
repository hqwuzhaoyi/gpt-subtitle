import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Get,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";
import { UploadService } from "./upload.service";

@Controller("upload")
export class UploadController {
  constructor(private readonly fileService: UploadService) {}

  @Get()
  async getAllFiles(): Promise<Express.Multer.File[]> {
    return this.fileService.getAllFiles();
  }

  @Post()
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: "./uploads",
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + "-" + Math.round(Math.random() * 1e9);
          const fileExt = extname(file.originalname);
          const fileName = file.originalname.replace(fileExt, "");
          cb(null, `${fileName}${fileExt}`);
        },
      }),
    })
  )
  async uploadFile(@UploadedFile() file) {
    console.log(file);

    return this.fileService.uploadFile(file);
  }
}
