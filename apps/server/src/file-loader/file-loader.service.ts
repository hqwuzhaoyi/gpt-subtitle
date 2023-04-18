import { Injectable } from '@nestjs/common';
import { CreateFileLoaderDto } from './dto/create-file-loader.dto';
import { UpdateFileLoaderDto } from './dto/update-file-loader.dto';
import FileStream from '../utils/file';
import * as path from 'path';
import TranslateModel from 'src/translate/translator/gpt3';

@Injectable()
export class FileLoaderService {
  create(createFileLoaderDto: CreateFileLoaderDto) {
    return 'This action adds a new fileLoader';
  }

  findAll() {
    const fileStream = new FileStream(
      path.resolve(
        __dirname,
        '..',
        '..',
        'test_subtitles',
        'The.Super.Mario.Bros.Movie.2023.1080p.Cam.X264.Will1869.srt',
      ),
      path.resolve(__dirname, '..', '..', 'test_subtitles', 'result.txt'),
      (text) => {
        const model = new TranslateModel();
        return model.translate(text);
        // return text;
      },
    );

    fileStream.start();

    return `This action returns all fileLoader`;
  }

  findOne(id: number) {
    return `This action returns a #${id} fileLoader`;
  }

  update(id: number, updateFileLoaderDto: UpdateFileLoaderDto) {
    return `This action updates a #${id} fileLoader`;
  }

  remove(id: number) {
    return `This action removes a #${id} fileLoader`;
  }
}
