import TranslateModel from "./gpt3";
import SubtitleProcessor from "./fileStream";

import fs from "fs";
import { parse, map, stringify, stringifySync } from "subtitle";

import { resolve } from "path";

import { v2 } from "@google-cloud/translate";
import PQueue from "p-queue";

const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
const translate = new v2.Translate({ key: apiKey });

async function translateSrtStream(
  filePath: string,
  outputPath,
  targetLanguage: string
) {
  const queue = new PQueue({ concurrency: 20 });

  const nodes = [];
  const inputStream = fs.createReadStream(filePath, { encoding: "utf8" });
  const writeStream = fs.createWriteStream(outputPath);
  inputStream
    .pipe(parse())
    .on("data", (node) => {
      // 把每个翻译操作的 Promise 添加到数组中
      nodes.push(node);

      queue.add(async () => {
        console.debug("Translating: ", node.data.text);
        const [translatedText] = await translate.translate(
          node.data.text,
          targetLanguage
        );
        console.debug("Translated: ", translatedText);
        node.data.text = translatedText;
      });
    })
    .on("error", console.error)
    .on("finish", async () => {
      await queue.onIdle();

      console.log("Translation has finished");
      writeStream.write(stringifySync(nodes, { format: "SRT" }) + "\n\n");
      writeStream.end();

      console.log("Writing to file has finished");
    });
}

async function translateSrtStreamGroup(
  inputFilePath: string,
  outputFilePath: string,
  targetLanguage: string,
  groupSize: number = 4
) {
  const nodes = [];
  const queue = new PQueue({ concurrency: 20 });
  const inputStream = fs.createReadStream(inputFilePath, { encoding: "utf8" });
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
          const [translatedText] = await translate.translate(
            textForThisGroup,
            targetLanguage
          );
          const translatedSegments = translatedText.split("\n");

          if (
            nodesForThisGroup.length !==
            translatedSegments.slice(0, translatedSegments.length - 1).length
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
    .on("error", console.error)
    .on("finish", async () => {
      // Process any remaining nodes
      if (group.length > 0) {
        const textForThisGroup = textToTranslate;
        const nodesForThisGroup = group;

        queue.add(async () => {
          const [translatedText] = await translate.translate(
            textForThisGroup,
            targetLanguage
          );
          const translatedSegments = translatedText.split("\n");

          if (
            nodesForThisGroup.length !==
            translatedSegments.slice(0, translatedSegments.length - 1).length
          ) {
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

      console.log("Translation has finished");

      // 将翻译后的字幕重新编码并写入新的文件

      writeStream.write(stringifySync(nodes, { format: "SRT" }) + "\n\n");

      writeStream.end();

      console.log("Writing to file has finished");
    });
}

translateSrtStreamGroup(
  resolve(__dirname, "../DLDSS-202.srt"),
  resolve(__dirname, "..", "output.srt"),
  "zh-CN"
).catch(console.error);
// translateSrtStream(
//   resolve(__dirname, "../DLDSS-202.srt"),
//   resolve(__dirname, "..", "output.srt"),
//   "zh-CN"
// ).catch(console.error);

export { TranslateModel, SubtitleProcessor };
