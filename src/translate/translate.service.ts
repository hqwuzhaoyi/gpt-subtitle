import { Injectable } from '@nestjs/common';
import { CreateTranslateDto } from './dto/create-translate.dto';
import { UpdateTranslateDto } from './dto/update-translate.dto';

import TranslateModel from './translator/gpt3';

@Injectable()
export class TranslateService {
  async create(createTranslateDto: CreateTranslateDto) {}

  async findAll() {}

  async findOne(id: string) {
    const model = new TranslateModel();

    try {
      return model.translate(id);
    } catch (error) {
      console.log(error);
    }
    return `This action returns a #${id} translate`;
  }

  update(id: number, updateTranslateDto: UpdateTranslateDto) {
    return `This action updates a #${id} translate`;
  }

  remove(id: number) {
    return `This action removes a #${id} translate`;
  }
}
