import { GPTTranslator } from "./gpt3";
import SubtitleProcessor from "./fileStream";
// import dotenv from "dotenv";
// dotenv.config();
import fs from "fs";
import { parse, map, stringifySync, filter } from "subtitle";

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
  return segment.replace(/^\d+\./, "").trim();
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
      const translationCache = {}; // 新建缓存

      let translationCount = 0; // 翻译次数计数器
      let translationCacheCount = 0; // 翻译次数计数器

      let group = [];
      let textToTranslate = "";
      let lastNode = null;

      inputStream
        .pipe(parse())
        .pipe(
          filter((node) => {
            if (node.type === "cue") {
              if (lastNode && node.data.text === lastNode.data.text) {
                lastNode.data.end = node.data.end;
                lastNode.merged = true;
                return false; // 不将当前节点添加到结果数组中
              }
              lastNode = node;
            }
            return true;
          })
        )
        .on("data", (node) => {
          nodes.push(node);
          group.push(node);
          if (translationCache[node.data.text]) {
            textToTranslate +=
              group.length + "." + translationCache[node.data.text] + " \n"; // 使用缓存中的翻译
            translationCacheCount++;
          } else {
            textToTranslate += group.length + "." + node.data.text + " \n";
          }

          if (group.length >= groupSize) {
            const textForThisGroup = textToTranslate;
            const nodesForThisGroup = group;

            queue.add(async () => {
              const translatedText = await this.translate.translate(
                textForThisGroup,
                targetLanguage
              );
              translationCount++;

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
                const translatedSegment = removeHeaderNumberAndDot(
                  translatedSegments[i]
                );
                nodesForThisGroup[i].data.text = translatedSegment;

                // Update the cache
                translationCache[nodesForThisGroup[i].data.text] =
                  translatedSegment;
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
          console.info("Total translations performed: ", translationCount);
          console.info("Translation cache count: ", translationCacheCount);
          console.info("Translation cache: ", translationCache);
          resolve(outputFilePath);
        });
    });
  }
}

// const test = new TranslateModel(TranslateType.GOOGLE, {
//   apiKey: process.env.GOOGLE_TRANSLATE_API_KEY,
// })
//   .translateSrtStreamGroup(
//     resolve(__dirname, "../cjob-132-copy.srt"),
//     resolve(__dirname, "..", "output.srt"),
//     "zh-CN",
//     4,
//     400
//   )
//   .catch(console.error);

export { TranslateModel, SubtitleProcessor };
