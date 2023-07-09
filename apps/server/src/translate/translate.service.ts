import { Injectable } from "@nestjs/common";
import { CreateTranslateDto } from "./dto/create-translate.dto";
import { UpdateTranslateDto } from "./dto/update-translate.dto";
import * as path from "path";
import * as fs from "fs";
import { TranslateModel, TranslateType } from "translator";
import { staticPath } from "utils";

console.debug("staticPath", staticPath);

@Injectable()
export class TranslateService {
  async create(createTranslateDto: CreateTranslateDto) {}

  private readonly staticDir = path.join(
    __dirname,
    "..",
    "..",
    "..",
    "..",
    "uploads"
  );

  async findAll() {}

  existFile(fileName) {
    const exists = fs.existsSync(
      path.resolve(__dirname, "..", "..", "uploads", fileName)
    );

    if (exists) {
      console.log("文件存在");
      console.log("file not exist, return url" + `${staticPath}${fileName}`);
      return `${staticPath}${fileName}`;
    } else {
      console.log("file not exist, need translate");
      return false;
    }
  }

  translateFile(filename) {
    return new Promise((resolve, reject) => {
      const fileObj = path.parse(filename);
      const translateName =
        fileObj.name + "." + process.env.LANGUAGE ?? "Chinese" + fileObj.ext;

      const existUrl = this.existFile(translateName);
      if (existUrl) {
        resolve({
          url: `${staticPath}${translateName}`,
          filename: translateName,
        });
        return;
      }

      const model = new TranslateModel(TranslateType.GPT3, {
        baseUrl: process.env.BASE_URL,
        apiKey: process.env.OPENAI_API_KEY,
      })
        .translateSrtStreamGroup(
          path.join(this.staticDir, filename),
          path.join(this.staticDir, translateName),
          process.env.LANGUAGE ?? "Chinese"
        )
        .then(() => {
          resolve({
            url: `${staticPath}${translateName}`,
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
    return `This action returns a #${id} translate`;
  }

  update(id: number, updateTranslateDto: UpdateTranslateDto) {
    return `This action updates a #${id} translate`;
  }

  remove(id: number) {
    return `This action removes a #${id} translate`;
  }
}
