import { Injectable } from "@nestjs/common";
import { CreateUploadDto } from "./dto/create-upload.dto";
import { UpdateUploadDto } from "./dto/update-upload.dto";
import { staticPath } from "utils";

@Injectable()
export class UploadService {
  private files: Express.Multer.File[] = [];

  create(createUploadDto: CreateUploadDto) {
    return "This action adds a new upload";
  }

  async getAllFiles(): Promise<Express.Multer.File[]> {
    return this.files;
  }

  async uploadFile(file: Express.Multer.File): Promise<{
    originalname: string;
    filename: string;
    url: string;
  }> {
    this.files.push(file);

    return {
      originalname: file.originalname,
      filename: file.filename,
      url: `${staticPath}/${file.filename}`,
    };

    // 上传文件的逻辑，这里略去
  }

  findAll() {
    return `This action returns all upload`;
  }

  findOne(id: number) {
    return `This action returns a #${id} upload`;
  }

  update(id: number, updateUploadDto: UpdateUploadDto) {
    return `This action updates a #${id} upload`;
  }

  remove(id: number) {
    return `This action removes a #${id} upload`;
  }
}
