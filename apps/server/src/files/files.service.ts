import { Injectable } from "@nestjs/common";
import { CreateFileDto } from "./dto/create-file.dto";
import { UpdateFileDto } from "./dto/update-file.dto";
import { FileEntity, VideoFileEntity } from "./entities/file.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, In } from "typeorm";

const videoExtensions = ["mp4", "mkv", "avi", "mov", "flv", "wmv"];
const audioExtensions = ["mp3", "wav", "ogg", "flac"];
const subtitleExtensions = ["srt", "ass"];

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(VideoFileEntity)
    private filesRepository: Repository<VideoFileEntity>
  ) {}

  create(createFileDto: CreateFileDto) {
    return "This action adds a new file";
  }

  findAll() {
    return `This action returns all files`;
  }

  findOne(id: number) {
    return `This action returns a #${id} file`;
  }

  update(id: number, updateFileDto: UpdateFileDto) {
    return `This action updates a #${id} file`;
  }

  remove(id: number) {
    return `This action removes a #${id} file`;
  }

  async findVideoFiles(): Promise<FileEntity[]> {
    return this.filesRepository.find({
      where: {
        extName: In(videoExtensions.map((ext) => "." + ext)),
      },
    });
  }
  async findAudioFiles(): Promise<FileEntity[]> {
    return this.filesRepository.find({
      where: {
        extName: In(audioExtensions.map((ext) => "." + ext)),
      },
    });
  }
  async findSubtitleFiles(): Promise<FileEntity[]> {
    return this.filesRepository.find({
      where: {
        extName: In(subtitleExtensions.map((ext) => "." + ext)),
      },
    });
  }
}
