import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WatchService } from './watch.service';
import { CreateWatchDto } from './dto/create-watch.dto';
import { UpdateWatchDto } from './dto/update-watch.dto';

@Controller('watch')
export class WatchController {
  constructor(private readonly watchService: WatchService) {}

  @Post()
  create(@Body() createWatchDto: CreateWatchDto) {
    return this.watchService.create(createWatchDto);
  }

  @Get()
  findAll() {
    return this.watchService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.watchService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWatchDto: UpdateWatchDto) {
    return this.watchService.update(+id, updateWatchDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.watchService.remove(+id);
  }
}
