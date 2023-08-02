import { GPTTranslator } from "./gpt3";
import SubtitleProcessor from "./fileStream";
// import dotenv from "dotenv";
// dotenv.config();
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

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function removeHeaderNumberAndDot(segment) {
  return segment.replace(/^\d+\. /, "").trim();
}

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
    targetLanguage: string,
    delayed = 0
  ) {
    return new Promise((resolve, reject) => {
      const queue = new PQueue({ concurrency: this.concurrency });

      const nodes = [];
      const translationCache = {}; // 缓存对象
      let translationCount = 0; // 翻译次数计数器
      let translationCacheCount = 0; // 翻译次数计数器

      const inputStream = fs.createReadStream(filePath, { encoding: "utf8" });
      const writeStream = fs.createWriteStream(outputPath);
      console.info("translateSrtStream: Reading from file has started");
      inputStream
        .pipe(parse())
        .on("data", (node) => {
          nodes.push(node);

          queue.add(async () => {
            // 检查缓存是否已经包含这个段落的翻译
            if (translationCache[node.data.text]) {
              node.data.text = translationCache[node.data.text];
              translationCacheCount++;
              console.info("Cached translation: ", node.data.text);
            } else {
              const translatedText = await this.translate.translate(
                node.data.text,
                targetLanguage
              );
              console.info("Translating: ", node.data.text);
              console.info("Translated: ", translatedText);

              // 将新的翻译添加到缓存中
              translationCache[node.data.text] = translatedText;
              node.data.text = translatedText;

              // 增加翻译计数器
              translationCount++;
            }

            await delay(delayed);
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

          // 输出总的翻译次数
          console.info(
            `${filePath} Total translations performed: ${translationCount};`,
            `Translation cache count: ${translationCacheCount} `
          );

          resolve(outputPath);
        });
    });
  }

  async translateSrtStreamGroup(
    inputFilePath: string,
    outputFilePath: string,
    targetLanguage: string,
    groupSize: number = 4,
    delayed = 100
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
          textToTranslate += group.length + "." + node.data.text + " \n";

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

              if (translatedSegments[translatedSegments.length - 1] === "") {
                translatedSegments.pop();
              }

              if (nodesForThisGroup.length !== translatedSegments.length) {
                console.error("Translation segment mismatch!");
                return;
              }

              for (let i = 0; i < nodesForThisGroup.length; i++) {
                nodesForThisGroup[i].data.text = removeHeaderNumberAndDot(
                  translatedSegments[i]
                );
              }

              await delay(delayed);
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
                nodesForThisGroup[i].data.text = removeHeaderNumberAndDot(
                  translatedSegments[i]
                );
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
//   .translateSrtStream(
//     resolve(__dirname, "../cjob-132-copy.srt"),
//     resolve(__dirname, "..", "output.srt"),
//     "zh-CN"
//   )
//   .catch(console.error);

export { TranslateModel, SubtitleProcessor };
