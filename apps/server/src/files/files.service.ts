import { Injectable } from "@nestjs/common";
import { CreateFileDto } from "./dto/create-file.dto";
import { UpdateFileDto } from "./dto/update-file.dto";
import {
  AudioFileEntity,
  FileEntity,
  SubtitleFileEntity,
  VideoFileEntity,
} from "./entities/file.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, In } from "typeorm";
import * as path from "path";

const videoExtensions = ["mp4", "mkv", "avi", "mov", "flv", "wmv"];
const audioExtensions = ["mp3", "wav", "ogg", "flac"];
const subtitleExtensions = ["srt", "ass"];

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(VideoFileEntity)
    private videoFilesRepository: Repository<VideoFileEntity>,
    @InjectRepository(AudioFileEntity)
    private audioFilesRepository: Repository<AudioFileEntity>,
    @InjectRepository(SubtitleFileEntity)
    private subtitleFilesRepository: Repository<SubtitleFileEntity>
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
    return this.videoFilesRepository.find({
      where: {
        extName: In(videoExtensions.map((ext) => "." + ext)),
      },
    });
  }
  async findAudioFiles(): Promise<FileEntity[]> {
    return this.audioFilesRepository.find({
      where: {
        extName: In(audioExtensions.map((ext) => "." + ext)),
      },
    });
  }
  async findSubtitleFiles(): Promise<FileEntity[]> {
    return this.subtitleFilesRepository.find({
      where: {
        extName: In(subtitleExtensions.map((ext) => "." + ext)),
      },
    });
  }

  async findRelatedFilesForVideo(): Promise<VideoFileEntity[]> {
    // 查找所有的视频文件并加载关联的音频和字幕文件
    const videoFiles = await this.videoFilesRepository.find({
      relations: ["audioFile", "audioFile.subtitleFiles"],
    });

    return videoFiles;
  }

}
