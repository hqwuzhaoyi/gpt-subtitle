import * as fs from 'fs';
// 定义前缀字符串
const prefix = 'Prefix: ';

class FileStream {
  input: string;
  output: string;
  callback: (content: string) => Promise<void>;
  constructor(inputFilePath, outputFilePath, dialogueContentCallback) {
    this.input = inputFilePath;
    this.output = outputFilePath;
    this.callback = dialogueContentCallback;
  }
  start() {
    return new Promise<void>((resolve, reject) => {
      // 创建可读流
      const readStream = fs.createReadStream(this.input, 'utf8');

      // 创建可写流
      const writeStream = fs.createWriteStream(this.output, { flags: 'a' });

      // 初始化变量用于缓存需要读取的对话信息
      let remaining = '';

      // 当读取到新数据时触发
      readStream.on('data', (chunk: string) => {
        // 将新数据添加到缓存中
        remaining += chunk;
      });

      // 完成读取时触发
      readStream.on('end', async () => {
        // 将缓存的数据按换行符分隔成行
        const lines = remaining.split(/\r\n|\n/);
        let cachedDialogueContent = '';
        // 遍历所有行数据并处理
        for (const line of lines) {
          // 如果当前行数据为空字符串或者只包含时间码，则直接写入到输出文件中
          if (line.trim() === '' || /^\d+.*-->.*\d+$/.test(line)) {
            if (/^\d+.*-->.*\d+$/.test(line))
              writeStream.write(line + '\n', 'utf8');
            continue;
          }
          // 如果当前行为数字，则认为是新的对话内容并将之前缓存的对话信息写入输出文件中
          if (!isNaN(Number(line))) {
            if (cachedDialogueContent !== '') {
              await writeToFile(`${cachedDialogueContent}`, this.callback);
              // await writeStream.write('' + '\n', 'utf8');
            }
            await writeStream.write(line + '\n', 'utf8');
            cachedDialogueContent = '';
          } else {
            // 如果当前行数据不是数字，则认为是对话文本，将之添加到缓存的对话信息中
            cachedDialogueContent += line + '\n';
          }
        }
        // 处理最后一个对话信息
        if (cachedDialogueContent !== '') {
          await writeToFile(`${cachedDialogueContent}`, this.callback);
        }
        console.log('write end');
        // 关闭可写流
        writeStream.end();
        resolve();
      });

      // 处理读取错误时触发
      readStream.on('error', (err: Error) => {
        console.error(err);
        reject(err);
      });

      // 写入文件的异步函数
      async function writeToFile(data: string, callback) {
        const result = callback ? await callback(data) : data;
        console.log('wait write');
        return new Promise<void>((resolve, reject) => {
          writeStream.write(result + '\n' + '' + '\n', 'utf8', (err: Error) => {
            if (err) reject(err);
            else resolve();
          });
        });
      }
    });
  }
}

export default FileStream;
