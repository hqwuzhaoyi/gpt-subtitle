import { CreateWatchDto } from "./dto/create-watch.dto";
import { UpdateWatchDto } from "./dto/update-watch.dto";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { Queue } from "bull";
import { InjectQueue } from "@nestjs/bull";
import { basename } from "path";
import * as path from "path";
import * as fs from "fs";
import * as chokidar from "chokidar";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {
  VideoFileEntity,
  AudioFileEntity,
  SubtitleFileEntity,
  FileEntity,
} from "../entities/file.entity";
import * as fg from "fast-glob";
@Injectable()
export class WatchService {
  constructor(
    @InjectRepository(VideoFileEntity)
    private videoFilesRepository: Repository<VideoFileEntity>,
    @InjectRepository(AudioFileEntity)
    private audioFilesRepository: Repository<AudioFileEntity>,
    @InjectRepository(SubtitleFileEntity)
    private subtitleFilesRepository: Repository<SubtitleFileEntity>,
    @InjectQueue("audio") private readonly audioQueue: Queue
  ) {}

  private readonly staticDir = path.join(
    __dirname,
    "..",
    "..",
    "..",
    "..",
    "..",
    "uploads"
  );
  private readonly videoDir = path.join(this.staticDir, "video");

  private videoExtensions = ["mp4", "mkv", "avi", "mov", "flv", "wmv"];
  private audioExtensions = ["mp3", "wav", "ogg", "flac"];
  private subtitleExtensions = ["srt", "ass"];

  async onModuleInit() {
    this.watchFiles();

    let { videoFiles, audioFiles, subtitleFiles } =
      await this.findAndClassifyFiles();
    this.saveFilesToDB({ videoFiles, audioFiles, subtitleFiles });
  }

  private async saveOrUpdateVideoFile(
    file: VideoFileEntity,
    repo: Repository<VideoFileEntity>,
    status: string = "todo"
  ) {
    //... function body
  }

  private async saveOrUpdateAudioFile(
    file: AudioFileEntity,
    repo: Repository<AudioFileEntity>,
    status: string = "todo"
  ) {
    //... function body
  }

  private async saveOrUpdateSubtitleFile(
    file: SubtitleFileEntity,
    repo: Repository<SubtitleFileEntity>,
    status: string = "todo"
  ) {
    //... function body
  }

  private async saveOrUpdateFile(
    filePath: string,
    repo,
    relatedEntities: any = {},
    status = "todo"
  ) {
    const fileName = path.basename(filePath);
    const baseName = path.basename(fileName, path.extname(fileName));
    const extName = path.extname(fileName);

    if (!repo.findOne) {
      throw new Error(
        "Repository is not defined." +
          filePath +
          repo +
          relatedEntities +
          status
      );
    }
    let existsInDb = await repo.findOne({ where: { fileName } });
    if (existsInDb) {
      // 更新状态
      if (status) {
        existsInDb.status = status;

        if (Object.keys(relatedEntities).length === 0) {
          // throw new Error("No fields to update for the entity.");
        } else {
          existsInDb = { ...existsInDb, ...relatedEntities };
        }

        return await repo.save(existsInDb);
      }
    } else {
      // 创建新的记录
      const newFile = repo.create({
        filePath,
        fileName,
        baseName,
        extName,
        status,
        ...relatedEntities,
      });
      return await repo.save(newFile);
    }
  }

  private async saveFilesToDB({ videoFiles, audioFiles, subtitleFiles }) {
    // 遍历字幕文件
    for (const subtitleFile of subtitleFiles) {
      // 如果字幕文件存在，那么对应的音频文件状态应该是 'done'
      const audioFileIndex = audioFiles.findIndex((filePath) =>
        path
          .basename(subtitleFile, path.extname(subtitleFile))
          .includes(path.basename(filePath, path.extname(filePath)))
      );

      const baseName = path.basename(subtitleFile, path.extname(subtitleFile));

      // todo: 优化查询, 通过 baseName 查询audioFile的参数
      // const audioFileInDb = await this.audioFilesRepository
      //   .createQueryBuilder("audioFile")
      //   .where("audioFile.baseName LIKE :baseName", {
      //     baseName: `%${baseName}%`,
      //   })
      //   .getOne();

      await this.saveOrUpdateFile(
        subtitleFile,
        this.subtitleFilesRepository,
        {},
        "done"
      );

      if (audioFileIndex !== -1) {
        const audioFile = audioFiles[audioFileIndex];
        const audioEntity = await this.saveOrUpdateFile(
          audioFile,
          this.audioFilesRepository,
          {},
          "done"
        );

        await this.saveOrUpdateFile(
          subtitleFile,
          this.subtitleFilesRepository,
          { audioFile: audioEntity },
          "done"
        );

        // Save subtitle file with associated audio file entity

        // 如果音频文件存在，那么对应的视频文件状态也应该是 'done'
        const videoFileIndex = videoFiles.findIndex(
          (filePath) =>
            path.basename(filePath, path.extname(filePath)) ===
            path.basename(audioFile, path.extname(audioFile))
        );
        if (videoFileIndex !== -1) {
          const videoFile = videoFiles[videoFileIndex];
          const videoEntity = await this.saveOrUpdateFile(
            videoFile,
            this.videoFilesRepository,
            {},
            "done"
          );

          // Update audio file with associated video file entity
          audioEntity.videoFile = videoEntity;
          await this.audioFilesRepository.save(audioEntity);

          videoFiles = [
            ...videoFiles.slice(0, videoFileIndex),
            ...videoFiles.slice(videoFileIndex + 1),
          ];
        }

        audioFiles = [
          ...audioFiles.slice(0, audioFileIndex),
          ...audioFiles.slice(audioFileIndex + 1),
        ];
      }
    }

    // 遍历音频文件,要查找对应的 subtitleFilesRepository 实体关系，并且找到把它们关联起来，status改为done
    for (const audioFile of audioFiles) {
      // 查找对应的字幕文件

      // todo: 改成where函数
      const subtitleEntity = await this.subtitleFilesRepository.findOne({
        where: {
          baseName: path.basename(audioFile, path.extname(audioFile)),
        },
      });

      // 如果找到字幕文件，把它们关联起来并设置状态为 'done'

      const audioEntity = await this.saveOrUpdateFile(
        audioFile,
        this.audioFilesRepository
      );
      if (subtitleEntity) {
        await this.saveOrUpdateFile(
          subtitleEntity.filePath,
          this.subtitleFilesRepository,
          { audioFile: audioEntity }, // 关联的字幕文件
          "done"
        );
      }
    }

    // 遍历视频文件,要查找对应的 audioFilesRepository 实体关系，并且找到把它们关联起来，status改为done
    for (const videoFile of videoFiles) {
      // 查找对应的音频文件
      const audioEntity = await this.audioFilesRepository.findOne({
        where: {
          baseName: path.basename(videoFile, path.extname(videoFile)),
        },
      });
      const videoEntity = await this.saveOrUpdateFile(
        videoFile,
        this.videoFilesRepository
      );
      if (audioEntity) {
        // 如果找到音频文件，把它们关联起来并设置状态为 'done'
        await this.saveOrUpdateFile(
          audioEntity.filePath,
          this.audioFilesRepository,
          { videoFile: videoEntity }, // 关联的音频文件
          "done"
        );
      }
    }
  }

  async addFileToDB(filePaths: string[]) {
    let videoFiles = [],
      audioFiles = [],
      subtitleFiles = [];

    filePaths.forEach((filePath) => {
      const fileName = basename(filePath);
      console.log(`File ${filePath} has been added, ${fileName}`);

      const ext = path.extname(filePath).slice(1);

      // 当发现新文件，执行保存到数据库的操作
      // 检查文件扩展名并分类
      if (this.videoExtensions.includes(ext)) {
        videoFiles.push(filePath);
      } else if (this.audioExtensions.includes(ext)) {
        audioFiles.push(filePath);
      } else if (this.subtitleExtensions.includes(ext)) {
        subtitleFiles.push(filePath);
      }
    });
    await this.saveFilesToDB({
      videoFiles,
      audioFiles,
      subtitleFiles,
    });
  }

  private watchFiles(): void {
    const watcher = chokidar.watch(this.videoDir, {
      ignored: /^\./, // ignore dotfiles
      persistent: true,
    });

    watcher.on("add", async (filePath, stats) => {
      await this.addFileToDB([filePath]);
    });
  }

  // 查找并分类文件
  async findAndClassifyFiles() {
    const videoFiles = [];
    const audioFiles = [];
    const subtitleFiles = [];

    const stream = fg.stream(path.join(this.videoDir, "**/*.*"), { dot: true });

    for await (const entry of stream) {
      // 获取文件扩展名
      const ext = path.extname(entry as string).slice(1);

      // 检查文件扩展名并分类
      if (this.videoExtensions.includes(ext)) {
        videoFiles.push(entry);
      } else if (this.audioExtensions.includes(ext)) {
        audioFiles.push(entry);
      } else if (this.subtitleExtensions.includes(ext)) {
        subtitleFiles.push(entry);
      }
    }

    return { videoFiles, audioFiles, subtitleFiles };
  }

  create(createWatchDto: CreateWatchDto) {
    return "This action adds a new watch";
  }

  findAll() {
    return `This action returns all watch`;
  }

  findOne(id: number) {
    return `This action returns a #${id} watch`;
  }

  update(id: number, updateWatchDto: UpdateWatchDto) {
    return `This action updates a #${id} watch`;
  }

  remove(id: number) {
    return `This action removes a #${id} watch`;
  }
}
