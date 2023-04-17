import FileStream from './utils/file';
import * as path from 'path';
import TranslateModel from './translate/translator/gpt3';
import { program } from 'commander';
import 'dotenv/config';
import SubtitleProcessor from './utils/fileStream';

program
  .option('-i, --input_file <filename>', 'Specify the original file name')
  .option('-o, --output_file <filename>', 'Specify the target file name')
  .option('--base_url <base_url>', 'OpenAI API 的 Base URL')
  .option('--open_api <open_api>', 'OpenAI API 的名称')
  .parse(process.argv);

program.parse(process.argv);

const options = program.opts();

const originalFile = options.input_file;
const targetFile = options.output_file;

const fileStream = new SubtitleProcessor(
  path.resolve(__dirname, '..', 'test_subtitles', originalFile),
  path.resolve(__dirname, '..', 'test_subtitles', targetFile),
  '',
  (text) => {
    const model = new TranslateModel({
      baseUrl: options.base_url ?? process.env.BASE_URL,
      apiKey: options.open_api ?? process.env.OPENAI_API_KEY,
    });
    return model.translate(text);
    // return text;
  },
);

fileStream
  .process()
  .then(() => {
    console.log('tranlate success, new filePath');
  })
  .catch((err) => {
    console.error('translate failed');
  });
