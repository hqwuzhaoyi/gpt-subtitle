import { GPTTranslator } from "./gpt3";
import SubtitleProcessor from "./fileStream";

import fs from "fs";
import { parse, map, stringifySync } from "subtitle";

import { resolve } from "path";

import PQueue from "p-queue";
import { GoogleTranslator } from "./google";
import { Translator } from "./types";

export enum TranslateType {
  GOOGLE = "google",
  GPT3 = "gpt3",
}

export type TranslateOptions = {
  apiKey?: string;
  baseUrl?: string;
  concurrency?: number;
};

class TranslateModel {
  translate: Translator;
  options: TranslateOptions;
  concurrency: number = 5;
  constructor(type = TranslateType.GOOGLE, options = {}) {
    if (type === TranslateType.GOOGLE) {
      this.translate = new GoogleTranslator(options);
    } else if (type === TranslateType.GPT3) {
      this.translate = new GPTTranslator(options);
    }
    this.options = options;
  }

  async translateSrtStream(
    filePath: string,
    outputPath,
    targetLanguage: string
  ) {
    return new Promise((resolve, reject) => {
      const queue = new PQueue({ concurrency: this.concurrency });

      const nodes = [];
      const inputStream = fs.createReadStream(filePath, { encoding: "utf8" });
      const writeStream = fs.createWriteStream(outputPath);
      inputStream
        .pipe(parse())
        .on("data", (node) => {
          // 把每个翻译操作的 Promise 添加到数组中
          nodes.push(node);

          queue.add(async () => {
            const translatedText = await this.translate.translate(
              node.data.text,
              targetLanguage
            );
            console.info("Translating: ", node.data.text);
            console.info("Translated: ", translatedText);

            node.data.text = translatedText;
          });
        })
        .on("error", (error) => {
          console.error(error);
          reject(error);
        })
        .on("finish", async () => {
          await queue.onIdle();

          console.info("Translation has finished", nodes);

          writeStream.write(stringifySync(nodes, { format: "SRT" }) + "\n\n");
          writeStream.end();

          console.info("Writing to file has finished");
          resolve(outputPath);
        });
    });
  }

  async translateSrtStreamGroup(
    inputFilePath: string,
    outputFilePath: string,
    targetLanguage: string,
    groupSize: number = 4
  ) {
    return new Promise((resolve, reject) => {
      const nodes = [];
      const queue = new PQueue({ concurrency: this.concurrency });
      const inputStream = fs.createReadStream(inputFilePath, {
        encoding: "utf8",
      });
      const writeStream = fs.createWriteStream(outputFilePath, {
        encoding: "utf8",
      });

      let group = [];
      let textToTranslate = "";

      inputStream
        .pipe(parse())
        .on("data", (node) => {
          nodes.push(node);
          group.push(node);
          textToTranslate += node.data.text + " \n";

          if (group.length >= groupSize) {
            const textForThisGroup = textToTranslate;
            const nodesForThisGroup = group;

            queue.add(async () => {
              const translatedText = await this.translate.translate(
                textForThisGroup,
                targetLanguage
              );

              console.info("Translating: ", textForThisGroup);
              console.info("Translated: ", translatedText);

              const translatedSegments = translatedText.split("\n");

              if (
                nodesForThisGroup.length !==
                translatedSegments.slice(0, translatedSegments.length - 1)
                  .length
              ) {
                console.error("Translation segment mismatch!");
                return;
              }

              for (let i = 0; i < nodesForThisGroup.length; i++) {
                nodesForThisGroup[i].data.text = translatedSegments[i];
              }
            });

            // Reset the group and text
            group = [];
            textToTranslate = "";
          }
        })
        .on("error", (error) => {
          console.error(error);
          reject(error);
        })
        .on("finish", async () => {
          // Process any remaining nodes
          if (group.length > 0) {
            const textForThisGroup = textToTranslate;
            const nodesForThisGroup = group;

            queue.add(async () => {
              const translatedText = await this.translate.translate(
                textForThisGroup,
                targetLanguage
              );

              console.info("Translating: ", textForThisGroup);
              console.info("Translated: ", translatedText);

              const translatedSegments = translatedText.split("\n");

              if (translatedSegments[translatedSegments.length - 1] === "") {
                translatedSegments.pop();
              }

              if (nodesForThisGroup.length !== translatedSegments.length) {
                console.error("Translation segment mismatch!");
                return;
              }

              for (let i = 0; i < nodesForThisGroup.length; i++) {
                nodesForThisGroup[i].data.text = translatedSegments[i];
              }
            });
          }

          // Wait for all translations to finish
          await queue.onIdle();

          console.info("Translation has finished", nodes);

          // 将翻译后的字幕重新编码并写入新的文件

          writeStream.write(stringifySync(nodes, { format: "SRT" }) + "\n\n");

          writeStream.end();

          console.info("Writing to file has finished");
          resolve(outputFilePath);
        });
    });
  }
}

// const test = new TranslateModel(TranslateType.GOOGLE, {
//   apiKey: process.env.GOOGLE_TRANSLATE_API_KEY,
// })
//   .translateSrtStreamGroup(
//     resolve(__dirname, "../DLDSS-202.srt"),
//     resolve(__dirname, "..", "output.srt"),
//     "zh-CN"
//   )
//   .catch(console.error);

export { TranslateModel, SubtitleProcessor };
