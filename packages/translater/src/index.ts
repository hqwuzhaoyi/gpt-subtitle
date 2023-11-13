import fs from "fs";
import { parse, stringifySync, filter } from "subtitle";

import PQueue from "p-queue";
import { GPTTranslator } from "./gpt3";
import { GoogleTranslator } from "./google";
import { Translator } from "./types";

import { TranslateType } from "shared-types";
export { TranslateType };

export type TranslateOptions = {
  gpt3Key?: string;
  googleKey?: string;
  baseUrl?: string;
  concurrency?: number;
};

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function removeHeaderNumberAndDot(segment) {
  return segment.replace(/^\d+\./, "").trim();
}

class TranslateModel {
  translate: Translator;
  options: TranslateOptions;
  concurrency: number = 5;

  filterLastNode = null;

  constructor(type = TranslateType.GOOGLE, options: TranslateOptions = {}) {
    if (type === TranslateType.GOOGLE) {
      this.translate = new GoogleTranslator({
        apiKey: options.googleKey,
      });
      console.log("google translate", options.googleKey);
    } else if (type === TranslateType.GPT3) {
      this.translate = new GPTTranslator({
        apiKey: options.gpt3Key,
      });
    }
    this.options = options;
  }

  filterFunc(node) {
    if (node.type === "cue") {
      if (
        this.filterLastNode &&
        node.data.text === this.filterLastNode.data.text
      ) {
        this.filterLastNode.data.end = node.data.end;
        this.filterLastNode.merged = true;
        return false;
      }
      this.filterLastNode = node;
    }
    return true;
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
      const translationCache = {}; // 新建缓存

      let translationCount = 0; // 翻译次数计数器
      let translationCacheCount = 0; // 翻译次数计数器

      let group = [];
      let textToTranslate = "";

      inputStream
        .pipe(parse())
        .pipe(filter((node) => this.filterFunc(node)))
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
              try {
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
                  // Update the cache
                  translationCache[nodesForThisGroup[i].data.text] =
                    translatedSegment;

                  nodesForThisGroup[i].data.text = translatedSegment;
                }

                await delay(delayed);
              } catch (error) {}
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

// const test = new TranslateModel(TranslateType.GPT3, {
//   // googleKey: process.env.GOOGLE_TRANSLATE_API_KEY,
//   gpt3Key: process.env.OPENAI_API_KEY,
//   baseUrl: process.env.BASE_URL,
// })
//   .translateSrtStreamGroup(
//     resolve(__dirname, "../Cyberpunk.Edgerunners.S01E06.DUBBED.1080p.WEBRip.x265-RARBG.srt"),
//     resolve(__dirname, "..", "output.srt"),
//     "zh-CN",
//     4,
//     400
//   )
//   .catch(console.error);

export { TranslateModel };
