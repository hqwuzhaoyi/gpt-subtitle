# nfo-parser

## Introduction

`nfo-parser` is a simple command-line tool for parsing NFO files and converting their content into JSON format. It is built on Node.js and can be used to handle NFO files containing information about TV series or movies.

## Installation

Install `nfo-parser` globally via npm:

```bash
npm install -g nfo-parser
```

## Usage

To convert an NFO file to JSON format using nfo-parser, run the following command

```bash
nfo-parser --input <path-to-nfo-file> [--output <path-to-json-file>]

```

- `--input` - Required, specifies the path to the NFO file to be converted.
- `--output` - Optional, specifies the path to output the JSON file. If not specified, the output is printed to the console.

## Using the parser function

To use the parser function in your project, follow these steps：

```typescript
import { parser } from "nfo-parser";

(async () => {
  try {
    const nfoData = await parser("path/to/yourfile.nfo");
    console.log(nfoData); // 输出解析后的 JSON 数据
  } catch (error) {
    console.error("Error:", error);
  }
})();
```
