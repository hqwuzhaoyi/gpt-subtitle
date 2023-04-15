import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FileLoaderService } from './file-loader.service';
import { CreateFileLoaderDto } from './dto/create-file-loader.dto';
import { UpdateFileLoaderDto } from './dto/update-file-loader.dto';

@Controller('file-loader')
export class FileLoaderController {
  constructor(private readonly fileLoaderService: FileLoaderService) {}

  @Post()
  create(@Body() createFileLoaderDto: CreateFileLoaderDto) {
    return this.fileLoaderService.create(createFileLoaderDto);
  }

  @Get()
  findAll() {
    return this.fileLoaderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fileLoaderService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFileLoaderDto: UpdateFileLoaderDto) {
    return this.fileLoaderService.update(+id, updateFileLoaderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fileLoaderService.remove(+id);
  }
}
