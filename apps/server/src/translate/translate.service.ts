import { Injectable } from "@nestjs/common";
import { CreateTranslateDto } from "./dto/create-translate.dto";
import { UpdateTranslateDto } from "./dto/update-translate.dto";
import * as path from "path";
import * as fs from "fs";
import { TranslateModel, SubtitleProcessor } from "tranlater";
import { staticPath } from "utils";

@Injectable()
export class TranslateService {
  async create(createTranslateDto: CreateTranslateDto) {}

  async findAll() {}

  existFile(fileName) {
    const exists = fs.existsSync(
      path.resolve(__dirname, "..", "..", "uploads", fileName)
    );

    if (exists) {
      console.log("文件存在");
      console.log(
        "file not exist, return url" + `${staticPath}/static/${fileName}`
      );
      return `${staticPath}/static/${fileName}`;
    } else {
      console.log("file not exist, need translate");
      return false;
    }
  }

  translateFile(filename) {
    return new Promise((resolve, reject) => {
      const fileObj = path.parse(filename);
      const translateName = fileObj.name + ".Chinese" + fileObj.ext;

      const existUrl = this.existFile(translateName);
      if (existUrl) {
        resolve({
          url: `${staticPath}/${translateName}`,
          filename: translateName,
        });
        return;
      }

      const fileStream = new SubtitleProcessor(
        path.resolve(__dirname, "..", "..", "uploads", filename),
        path.resolve(__dirname, "..", "..", "uploads", translateName),
        "",
        (text) => {
          const model = new TranslateModel({
            baseUrl: process.env.BASE_URL,
            apiKey: process.env.OPENAI_API_KEY,
          });
          return model.translate(text, process.env.LANGUAGE ?? "Chinese");
          // return text;
        }
      );

      fileStream
        .process()
        .then(() => {
          resolve({
            url: `${staticPath}/${translateName}`,
            filename: translateName,
          });
        })
        .catch((err) => {
          console.error("translate failed");
          reject("translate failed" + err.message);
        });
    });
  }

  async findOne(id: string) {
    const model = new TranslateModel();

    try {
      return model.translate(id);
    } catch (error) {
      console.log(error);
    }
    return `This action returns a #${id} translate`;
  }

  update(id: number, updateTranslateDto: UpdateTranslateDto) {
    return `This action updates a #${id} translate`;
  }

  remove(id: number) {
    return `This action removes a #${id} translate`;
  }
}
