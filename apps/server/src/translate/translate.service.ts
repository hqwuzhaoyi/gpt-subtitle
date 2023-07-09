import { Inject, Injectable } from "@nestjs/common";
import { CreateTranslateDto } from "./dto/create-translate.dto";
import { UpdateTranslateDto } from "./dto/update-translate.dto";
import * as path from "path";
import * as fs from "fs";
import { TranslateModel, TranslateType } from "translator";
import { staticPath } from "utils";

console.debug("staticPath", staticPath);

@Injectable()
export class TranslateService {
  constructor(@Inject("STATIC_DIR") private staticDir: string) {}

  async create(createTranslateDto: CreateTranslateDto) {}

  async findAll() {}

  fileStaticPath(fileName: string, dir = "") {
    const dirPath = dir ? dir.slice(1) + "/" : "";

    return `${staticPath}${dirPath}${fileName}`;
  }

  existFile(fileName, dir) {
    const exists = fs.existsSync(path.join(this.staticDir, dir, fileName));

    if (exists) {
      console.log("文件存在");
      console.log(
        "file exist, return url" + `${this.fileStaticPath(fileName, dir)}`
      );
      return this.fileStaticPath(fileName, dir);
    } else {
      console.log("file not exist, need translate");
      return false;
    }
  }

  translateFile(
    filename,
    dir = ""
  ): Promise<{
    url: string;
    filename: string;
    path: string;
  }> {
    return new Promise((resolve, reject) => {
      const fileObj = path.parse(filename);
      const translateName =
        fileObj.name + "." + (process.env.LANGUAGE ?? "Chinese") + fileObj.ext;

      const existUrl = this.existFile(translateName, dir);
      if (existUrl) {
        resolve({
          url: existUrl,
          filename: translateName,
          path: path.join(this.staticDir, dir, translateName),
        });
        return;
      }

      const model = new TranslateModel(TranslateType.GPT3, {
        baseUrl: process.env.BASE_URL,
        apiKey: process.env.OPENAI_API_KEY,
      })
        .translateSrtStreamGroup(
          path.join(this.staticDir, dir, filename),
          path.join(this.staticDir, dir, translateName),
          process.env.LANGUAGE ?? "Chinese"
        )
        .then(() => {
          resolve({
            url: `${this.fileStaticPath(translateName, dir)}`,
            path: path.join(this.staticDir, dir, translateName),
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
