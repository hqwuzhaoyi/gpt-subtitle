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
import * as fs from "fs";
import { promises as fsPromises } from "fs";

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

  // 使用路径删除文件
  public async removeWithPath(filePath: string) {
    try {
      await fsPromises.unlink(filePath);
      console.log("File removed:", filePath);
    } catch (err) {
      console.error("Error:", err);
      throw err;
    }

    try {
      const res = await this.subtitleFilesRepository.delete({ filePath });
      console.log("Remove subtitle success");
      return res;
    } catch (err) {
      console.error("Error:", err);
      throw err;
    }
  }

  public async findVideoFiles(): Promise<FileEntity[]> {
    return this.videoFilesRepository.find({
      where: {
        extName: In(videoExtensions.map((ext) => "." + ext)),
      },
    });
  }
  public async findVideoFile(id): Promise<VideoFileEntity> {
    return this.videoFilesRepository.findOne({
      where: {
        id: id,
      },
    });
  }
  public async findSubtitleFile(id): Promise<SubtitleFileEntity> {
    return this.subtitleFilesRepository.findOne({
      where: {
        id: id,
      },
    });
  }
  public async findAudioFile(id): Promise<AudioFileEntity> {
    return this.audioFilesRepository.findOne({
      where: {
        id: id,
      },
    });
  }
  public async findAudioFiles(): Promise<FileEntity[]> {
    return this.audioFilesRepository.find({
      where: {
        extName: In(audioExtensions.map((ext) => "." + ext)),
      },
    });
  }
  public async findSubtitleFiles(): Promise<SubtitleFileEntity[]> {
    return this.subtitleFilesRepository.find({
      where: {
        extName: In(subtitleExtensions.map((ext) => "." + ext)),
      },
    });
  }

  public async findRelatedFilesForVideo({
    skip,
    take,
    searchKey,
  }: {
    skip?: number;
    take?: number;
    searchKey?: string;
  } = {}): Promise<VideoFileEntity[]> {
    // 查找所有的视频文件并加载关联的音频和字幕文件
    const queryBuilder = this.videoFilesRepository.createQueryBuilder("video");

    // 添加关系
    queryBuilder.leftJoinAndSelect("video.audioFile", "audio");
    queryBuilder.leftJoinAndSelect("audio.subtitleFiles", "subtitles");

    // 如果searchKey存在，则添加模糊匹配条件
    if (searchKey) {
      queryBuilder.where("video.baseName LIKE :searchKey", {
        searchKey: `%${searchKey}%`,
      });
    }

    // 添加分页条件
    if (skip !== undefined) {
      queryBuilder.skip(skip);
    }
    if (take !== undefined) {
      queryBuilder.take(take);
    }

    // 执行查询并返回结果
    return await queryBuilder.getMany();
  }

  public async videoFilesCount(): Promise<number> {
    return this.videoFilesRepository.count();
  }

  public async audioFilesCount(): Promise<number> {
    return this.audioFilesRepository.count();
  }

  public async subtitleFilesCount(): Promise<number> {
    return this.subtitleFilesRepository.count();
  }

  public async findRelatedFilesForAudio({
    skip,
    take,
  }: {
    skip?: number;
    take?: number;
  } = {}): Promise<AudioFileEntity[]> {
    // 查找所有的视频文件并加载关联的音频和字幕文件
    const audioFiles = await this.audioFilesRepository.find({
      relations: ["subtitleFiles"],
      skip,
      take,
    });

    return audioFiles;
  }
}
