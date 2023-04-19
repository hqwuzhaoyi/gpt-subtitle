import * as fs from 'fs';
import { Transform, TransformCallback, TransformOptions } from 'stream';

class SubtitleStream extends Transform {
  private prefix: string;
  private isNumberLine: boolean;
  private buffer: string;
  private callback: (content: string) => Promise<string>;

  constructor(
    options: TransformOptions,
    prefix: string,
    lineCallback: (content: string) => Promise<string>,
  ) {
    super(options);
    this.prefix = prefix;
    this.isNumberLine = false;
    this.buffer = '';
    this.callback = lineCallback;
  }

  async _transform(
    chunk: any,
    encoding: BufferEncoding,
    callback: TransformCallback,
  ) {
    const lines = chunk.toString().split(/\r\n|\n/);
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line === '') {
        continue;
      } else if (/^\d+/.test(line)) {
        if (this.buffer !== '') {
          const result = await this.handleDialog(this.buffer);
          const dialogLines = result.split(/\r\n|\n/);
          for (let i = 0; i < dialogLines.length; i++) {
            const dialogLine = dialogLines[i];
            this.push(`${dialogLine}\n`);
            this.push(`\n`);
          }

          this.buffer = '';
        }
        this.isNumberLine = true;
        this.push(`${line}\n`);
      } else if (/\d+.*-->.*\d+/.test(line)) {
        this.isNumberLine = false;
        this.push(`${line}\n`);
      } else if (this.isNumberLine) {
        if (this.buffer !== '') {
          this.buffer += '\n';
        }
        this.buffer += `${line}`;
      }
    }
    callback();
  }

  async _final(callback: any) {
    if (this.buffer !== '') {
      const result = await this.handleDialog(this.buffer);

      const dialogLines = result.split(/\r\n|\n/);
      for (let i = 0; i < dialogLines.length; i++) {
        const dialogLine = dialogLines[i];
        this.push(`${dialogLine}\n`);
      }
      callback();
    } else {
      callback();
    }
  }

  private async handleDialog(content: string): Promise<string> {
    return this.callback(content);
  }
}

class SubtitleProcessor {
  private input: string;
  private output: string;
  private prefix?: string;
  private lineCallback?: (content: string) => Promise<string>;

  constructor(
    inputFilePath: string,
    outputFilePath: string,
    prefixString: string,
    lineCallback?: (content: string) => Promise<string>,
  ) {
    this.input = inputFilePath;
    this.output = outputFilePath;
    this.prefix = prefixString;
    this.lineCallback = lineCallback;
  }

  async process() {
    const readStream = fs.createReadStream(this.input, 'utf8');
    const writeStream = fs.createWriteStream(this.output);
    const subtitleStream = new SubtitleStream(
      { readableObjectMode: true },
      this.prefix,
      this.lineCallback,
    );

    return new Promise<void>((resolve, reject) => {
      readStream
        .pipe(subtitleStream)
        .pipe(writeStream)
        .on('error', (err: Error) => {
          console.error(err);
          reject(err);
        })
        .on('close', () => {
          resolve();
        });
    });
  }
}

export default SubtitleProcessor;
