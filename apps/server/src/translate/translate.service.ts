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
import { TranslateLanguage } from "shared-types";

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

  private async translateFileName(fileName) {
    const fileObj = path.parse(fileName);
    const language = await this.getTranslateLanguage();
    const translateName = fileObj.name + "." + language + fileObj.ext;
    return translateName;
  }

  private async getTranslateModel() {
    const translateModel =
      ((await this.customConfigService.get(
        "TranslateModel"
      )) as TranslateType) ?? TranslateType.GPT3;

    return translateModel;
  }

  private async getTranslateGroup() {
    const translateGroup =
      (await this.customConfigService.get("TRANSLATE_GROUP")) ?? 4;

    if (typeof translateGroup === "string") return Number(translateGroup);

    return translateGroup;
  }
  private async getTranslateDelay() {
    const translateDelay =
      (await this.customConfigService.get("TRANSLATE_DELAY")) ?? 1500;

    if (typeof translateDelay === "string") return Number(translateDelay);

    return translateDelay;
  }
  private async getTranslateLanguage() {
    const translateModel =
      ((await this.customConfigService.get("LANGUAGE")) as TranslateLanguage) ??
      TranslateLanguage.SimplifiedChinese;

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
      const translateName = await this.translateFileName(filename);
      const language = await this.getTranslateLanguage();
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
      const translateGroup = await this.getTranslateGroup();
      const translateDelay = await this.getTranslateDelay();

      const model = new TranslateModel(translateModel, {
        baseUrl: process.env.BASE_URL,
        gpt3Key: process.env.OPENAI_API_KEY,
        googleKey: process.env.GOOGLE_TRANSLATE_API_KEY,
      })
        .translateSrtStreamGroup(
          path.join(this.staticDir, dir, filename),
          path.join(this.staticDir, dir, translateName),
          language,
          translateGroup,
          translateDelay
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
      const translateName = await this.translateFileName(subtitle.fileName);
      const translatePath = this.translateFilePath(
        subtitle.filePath,
        translateName
      );
      const relativePath = path.dirname(
        path.relative(this.staticDir, translatePath)
      );
      console.debug("translatePath", translatePath);

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
      const language = await this.getTranslateLanguage();
      const translateGroup = await this.getTranslateGroup();
      const translateDelay = await this.getTranslateDelay();

      console.debug("translateLanguage", language);

      const model = new TranslateModel(translateModel, {
        baseUrl: process.env.BASE_URL,
        gpt3Key: process.env.OPENAI_API_KEY,
        googleKey: process.env.GOOGLE_TRANSLATE_API_KEY,
      })
        .translateSrtStreamGroup(
          subtitle.filePath,
          translatePath,
          language,
          translateGroup,
          translateDelay
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
