import { Inject, Injectable } from "@nestjs/common";
import { CreateTranslateDto } from "./dto/create-translate.dto";
import { UpdateTranslateDto } from "./dto/update-translate.dto";
import * as path from "path";
import * as fs from "fs";
import { TranslateModel, TranslateType } from "translator";
import { staticPath } from "utils";
import { TranslateResult } from "shared-types";
import { FilesService } from "@/files/files.service";
import { CustomConfigService } from "@/config/custom-config.service";

@Injectable()
export class TranslateService {
  constructor(
    @Inject("STATIC_DIR") private staticDir: string,
    private readonly filesService: FilesService,
    private customConfigService: CustomConfigService
  ) {}

  async create(createTranslateDto: CreateTranslateDto) {}

  async findAll() {}

  private fileStaticPath(fileName: string, dir = "") {
    const dirPath = dir ? dir.slice(1) + "/" : "";

    return `${staticPath}${dirPath}${fileName}`;
  }

  existFile(fileName, dir) {
    const exists = fs.existsSync(path.join(this.staticDir, dir, fileName));

    if (exists) {
      console.log("文件存在");
      console.log(
        "file exist, return url: " + `${this.fileStaticPath(fileName, dir)}`
      );
      return this.fileStaticPath(fileName, dir);
    } else {
      console.log("file not exist, need translate");
      return false;
    }
  }

  private translateFileName(fileName) {
    const fileObj = path.parse(fileName);
    const translateName =
      fileObj.name + "." + (process.env.LANGUAGE ?? "Chinese") + fileObj.ext;
    return translateName;
  }

  private async getTranslateModel() {
    const translateModel =
      ((await this.customConfigService.get(
        "TranslateModel"
      )) as TranslateType) ?? TranslateType.GPT3;

    return translateModel;
  }

  translateFile(
    filename,
    dir = ""
  ): Promise<{
    url: string;
    filename: string;
    path: string;
  }> {
    return new Promise(async (resolve, reject) => {
      const translateName = this.translateFileName(filename);

      // const existUrl = this.existFile(translateName, dir);
      // if (existUrl) {
      //   resolve({
      //     url: existUrl,
      //     filename: translateName,
      //     path: path.join(this.staticDir, dir, translateName),
      //   });
      //   return;
      // }

      const translateModel = await this.getTranslateModel();

      const model = new TranslateModel(translateModel, {
        baseUrl: process.env.BASE_URL,
        gpt3Key: process.env.OPENAI_API_KEY,
        googleKey: process.env.GOOGLE_TRANSLATE_API_KEY,
      })
        .translateSrtStreamGroup(
          path.join(this.staticDir, dir, filename),
          path.join(this.staticDir, dir, translateName),
          process.env.LANGUAGE ?? "zh-CN",
          process.env.TRANSLATE_GROUP ? Number(process.env.TRANSLATE_GROUP) : 4,
          process.env.TRANSLATE_DELAY
            ? Number(process.env.TRANSLATE_DELAY)
            : 500
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

  private translateFilePath(filePath, translateName) {
    const fileDir = path.dirname(filePath);
    const translatePath = path.join(fileDir, translateName);
    return translatePath;
  }

  translateOneWithId(
    id: number,
    { forceTranslate = false } = {}
  ): Promise<TranslateResult> {
    return new Promise(async (resolve, reject) => {
      const subtitle = await this.filesService.findSubtitleFile(id);
      const translateName = this.translateFileName(subtitle.fileName);
      const translatePath = this.translateFilePath(
        subtitle.filePath,
        translateName
      );
      const relativePath = path.dirname(
        path.relative(this.staticDir, translatePath)
      );
      console.debug("translatePath", translatePath);
      console.debug("translateLanguage", process.env.LANGUAGE ?? "Chinese");
      // console.debug("relativePath", path.dirname(relativePath));
      const existUrl = fs.existsSync(translatePath);
      if (existUrl && !forceTranslate) {
        console.debug("file exist, return url", translatePath);
        resolve({
          url: `${this.fileStaticPath(translateName, "/" + relativePath)}`,
          filename: translateName,
          path: translatePath,
        });
        return;
      }

      const translateModel = await this.getTranslateModel();

      const model = new TranslateModel(translateModel, {
        baseUrl: process.env.BASE_URL,
        gpt3Key: process.env.OPENAI_API_KEY,
        googleKey: process.env.GOOGLE_TRANSLATE_API_KEY,
      })
        .translateSrtStreamGroup(
          subtitle.filePath,
          translatePath,
          process.env.LANGUAGE ?? "zh-CN",
          process.env.TRANSLATE_GROUP ? Number(process.env.TRANSLATE_GROUP) : 4,
          process.env.TRANSLATE_DELAY
            ? Number(process.env.TRANSLATE_DELAY)
            : 500
        )
        .then(() => {
          resolve({
            url: `${this.fileStaticPath(translateName, "/" + relativePath)}`,
            filename: translateName,
            path: translatePath,
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
