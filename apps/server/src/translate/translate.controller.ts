import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { TranslateService } from "./translate.service";
import { CreateTranslateDto } from "./dto/create-translate.dto";
import { UpdateTranslateDto } from "./dto/update-translate.dto";

@Controller("translate")
export class TranslateController {
  constructor(private readonly translateService: TranslateService) {}

  // @Post()
  // create(@Body() createTranslateDto: CreateTranslateDto) {
  //   return this.translateService.create(createTranslateDto);
  // }
  @Post()
  async translateOne(@Body("filename") filename: string, @Body("dir") dir?: string) {
    // return this.translateService.create(createTranslateDto);
    const result = await this.translateService.translateFile(filename, dir);
    return result;
  }

  @Post("useId")
  async translateOneWithId(
    @Body("id") id: number,
    @Body("forceTranslate") forceTranslate: boolean
  ) {
    // return this.translateService.create(createTranslateDto);
    const result = await this.translateService.translateOneWithId(id, {
      forceTranslate,
    });
    return result;
  }

  @Get()
  findAll() {
    return this.translateService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.translateService.findOne(id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateTranslateDto: UpdateTranslateDto
  ) {
    return this.translateService.update(+id, updateTranslateDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.translateService.remove(+id);
  }
}
