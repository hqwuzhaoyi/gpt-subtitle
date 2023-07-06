import { Injectable } from "@nestjs/common";
import { CreateFileLoaderDto } from "./dto/create-file-loader.dto";
import { UpdateFileLoaderDto } from "./dto/update-file-loader.dto";
import FileStream from "../utils/file";
import * as path from "path";
import { TranslateModel, TranslateType } from "translator";

@Injectable()
export class FileLoaderService {
  create(createFileLoaderDto: CreateFileLoaderDto) {
    return "This action adds a new fileLoader";
  }

  findAll() {
    return `This action returns all fileLoader`;
  }

  findOne(id: number) {
    return `This action returns a #${id} fileLoader`;
  }

  update(id: number, updateFileLoaderDto: UpdateFileLoaderDto) {
    return `This action updates a #${id} fileLoader`;
  }

  remove(id: number) {
    return `This action removes a #${id} fileLoader`;
  }
}
