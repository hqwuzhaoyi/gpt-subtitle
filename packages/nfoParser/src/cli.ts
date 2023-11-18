#!/usr/bin/env node
import path from "path";
import fs from "fs";
import { program } from "commander";
import { parser } from "./parser"; // 导入 parser 函数

program
  .version("1.0.0")
  .requiredOption("-i, --input <path>", "Input NFO file path")
  .option("-o, --output <path>", "Output JSON file path");

program.parse(process.argv);
const options = program.opts();

if (options.input) {
  parser(options.input).then((data) => {
    if (options.output) {
      const outputPath = path.resolve(options.output);
      fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
      console.log(`JSON output saved to ${outputPath}`);
    } else {
      console.log(JSON.stringify(data, null, 2));
    }
  });
}
