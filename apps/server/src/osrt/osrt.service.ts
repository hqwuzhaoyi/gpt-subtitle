import { Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { CreateOsrtDto, FileType } from "./dto/create-osrt.dto";
import { UpdateOsrtDto } from "./dto/update-osrt.dto";
import { whisper, extractAudio, stopWhisper } from "whisper";
import { AudioListResult, FileListResult } from "shared-types";
import * as path from "path";
import * as fs from "fs";
import Bull, { JobStatusClean, Queue } from "bull";
import { InjectQueue } from "@nestjs/bull";
import { glob } from "glob";
import { staticPath, videoDirPath } from "utils";

import { FilesService } from "@/files/files.service";
import { TranslateService } from "@/translate/translate.service";

const visibleFiles = (file: string) => !file.startsWith(".");
const autoTranslateLanguages = "ja";
const videoExtensions = ["mp4", "mkv", "avi", "mov", "flv", "wmv"];
const audioExtensions = ["mp3", "wav", "ogg", "flac"];
const subtitleExtensions = ["srt", "ass"];

@Injectable()
export class OsrtService {
  constructor(
    @InjectQueue("audio") private audioQueue: Queue,
    private readonly filesService: FilesService,
    private readonly translateService: TranslateService,
    @Inject("STATIC_DIR") private staticDir: string
  ) {}

  private logger: Logger = new Logger("OsrtService");

  private readonly videoDir = path.join(this.staticDir, "video");
  private readonly audioDir = path.join(this.staticDir, "audio");
  private readonly whisperDir = path.join(
    __dirname,
    "..",
    "..",
    "..",
    "..",
    "whisper"
  );
  private readonly modelsDir = path.join(this.whisperDir, "models");

  async getActiveJobs() {
    return await this.audioQueue.getActive();
  }
  async clearAllJobs() {
    const jobStatuses: JobStatusClean[] = [
      "completed",
      "wait",
      "active",
      "delayed",
      "paused",
      "failed",
    ];

    await Promise.all(
      jobStatuses.map((status) => this.audioQueue.clean(0, status))
    );

    return await this.getActiveJobs();
  }
  async terminateAllJobs() {
    await this.clearAllJobs();
    stopWhisper();
    return await this.getActiveJobs();
  }

  create(createOsrtDto: CreateOsrtDto) {
    return "This action adds a new osrt";
  }

  async autoStart(ln = autoTranslateLanguages, model) {
    const allVideos = await this.list();
    return allVideos
      .filter((video) => video.status === "todo")
      .filter((video) => !video.isProcessing)
      .map((video) => {
        this.translate(ln, video.id + "", model);
        return video.fileName;
      });
  }

  filePathToUrl(filePath) {
    const relativePath = path.relative(this.staticDir, filePath);
    // 这将会创建一个以`staticPath`为前缀的URL
    // 注意，这假设`filePath`始终在`uploadsRoot`目录或其子目录下
    return new URL(relativePath, staticPath).toString();
  }

  async list(): Promise<FileListResult> {
    const currentJobs = await this.audioQueue.getActive();
    const currentJobsFiles = currentJobs.map((job) => {
      return job.data.id;
    });
    const currentJobsIdMap = currentJobs.reduce((acc, job) => {
      acc[job.data.id] = job.id;
      return acc;
    }, {});

    const videos = await this.filesService.findRelatedFilesForVideo();

    const result = await Promise.all(
      videos.map(async (videoFileEntity) => {
        const audioFile = await videoFileEntity.audioFile;
        return {
          ...videoFileEntity,
          path: this.filePathToUrl(videoFileEntity.filePath),
          audio: audioFile
            ? { ...audioFile, path: this.filePathToUrl(audioFile.filePath) }
            : undefined,
          subtitle: audioFile?.subtitleFiles?.map((file) => {
            return { ...file, path: this.filePathToUrl(file.filePath) };
          }),
          isProcessing: currentJobsFiles.includes(videoFileEntity.id),
          processingJobId: currentJobsIdMap[videoFileEntity.id],
          status: videoFileEntity.status,
        };
      })
    );

    return result;
  }
  async findAudios(): Promise<AudioListResult> {
    const currentJobs = await this.audioQueue.getActive();
    const currentJobsFiles = currentJobs.map((job) => {
      return job.data.id;
    });
    const currentJobsIdMap = currentJobs.reduce((acc, job) => {
      acc[job.data.id] = job.id;
      return acc;
    }, {});

    const audios = await this.filesService.findRelatedFilesForAudio();

    const result = await Promise.all(
      audios.map(async (audioFileEntity) => {
        return {
          ...audioFileEntity,
          path: this.filePathToUrl(audioFileEntity.filePath),
          subtitle: audioFileEntity?.subtitleFiles?.map((file) => {
            return { ...file, path: this.filePathToUrl(file.filePath) };
          }),
          isProcessing: currentJobsFiles.includes(audioFileEntity.id),
          processingJobId: currentJobsIdMap[audioFileEntity.id],
          status: audioFileEntity.status,
        };
      })
    );

    return result;
  }

  findOne(ln: string, fileName: string) {
    const srtPath = this.findFile(this.audioDir, fileName + ".srt");
    if (srtPath) {
      return srtPath;
    } else {
      return null;
    }
  }

  findAllModels() {
    const files = fs.readdirSync(this.modelsDir).filter(visibleFiles);
    return files;
  }

  async findAllSrt() {
    return await this.findFiles(this.staticDir, subtitleExtensions);
  }
  async findAllAudio() {
    return await this.findFiles(this.audioDir, audioExtensions);
  }

  // 查找所有video文件
  async findAllVideo() {
    return await this.findFiles(this.videoDir, videoExtensions);
  }

  async findFiles(dir: string, exts: string[]): Promise<string[]> {
    const pattern = path.join(dir, "**", `*.{${exts.join(",")}}`);

    const files = await glob(pattern);
    return files;
  }

  async translate(
    language: string,
    id: string,
    model: string,
    priority = 1,
    fileType: FileType = "video"
  ) {
    await this.addTranslationJob({ language, id, model, priority, fileType });
    return `This action returns a #${id} osrt`;
  }

  async createJobs(jobs: CreateOsrtDto[]) {
    try {
      return await Promise.all(jobs.map((job) => this.addTranslationJob(job)));
    } catch (error) {
      console.error(error);
      this.logger.error(error);
    }
  }

  async addTranslationJob(job: CreateOsrtDto): Promise<Bull.Job<any>> {
    const result = await this.audioQueue.add("translate", job, {
      priority: job.priority,
      jobId: job.id,
    });
    // const repeatOpts = {
    //   cron: "*/5 * * * *", // Run every 5 minutes
    //   jobId: job.id, // A unique identifier for this job
    // };
    // this.audioQueue.removeRepeatable("translate", repeatOpts);
    return result;
  }

  async deleteJob(jobId: string) {
    const job = await this.audioQueue.getJob(jobId);
    console.info("job", job);
    if (job) {
      await job.remove();
      return `Job ${jobId} has been removed`;
    } else {
      throw new NotFoundException(`Job ${jobId} not found`);
    }
  }

  async stop(processingJobId) {
    try {
      await this.deleteJob(processingJobId);
    } catch (error) {
      console.error("Could not remove job", error);
      this.logger.error(error);
    }
    stopWhisper();
  }

  async srtTranslate(videoDirPath, srtFile, targetSrtPath) {
    if (process.env.OUTPUT_SRT_THEN_TRANSLATE === "true") {
      const translateSubtitle = await this.translateService.translateFile(
        srtFile,
        "/video"
      );
      return [
        translateSubtitle,
        {
          path: targetSrtPath,
          url: `${videoDirPath}${srtFile}`,
        },
      ];
    } else {
      return [
        {
          path: targetSrtPath,
          url: `${videoDirPath}${srtFile}`,
        },
      ];
    }
  }

  async findFileThenTranslate({
    language,
    model,
    videoPath,
    audioPath,
    srtPath,
    srtFile,
    fileName,
  }) {
    try {
      const targetSrtPath = path.join(this.staticDir, "/video", srtFile);
      if (srtPath) {
        console.info("srtPath exist", srtPath + ".srt");
        return await this.srtTranslate(videoDirPath, srtFile, targetSrtPath);
      } else if (audioPath) {
        console.info("audioPath exist", audioPath);
        const status = await whisper(audioPath, language, model);
        if (status === "SIGTERM") {
          return [];
        }
        fs.renameSync(audioPath + ".srt", targetSrtPath);
        const subtitleFiles = await this.srtTranslate(
          videoDirPath,
          srtFile,
          targetSrtPath
        );
        return [...subtitleFiles, { path: audioPath }];
      } else if (videoPath) {
        console.info("videoPath exist", videoPath);
        const finalAudioPath = await this.handleAudio(
          audioPath,
          fileName,
          videoPath
        );
        const status = await whisper(finalAudioPath, language, model);
        if (status === "SIGTERM") {
          return [];
        }
        fs.renameSync(audioPath + ".srt", targetSrtPath);
        const subtitleFiles = await this.srtTranslate(
          videoDirPath,
          srtFile,
          targetSrtPath
        );
        return [
          ...subtitleFiles,
          { path: finalAudioPath },
          { path: videoPath },
        ];
      } else {
        this.logger.warn("srtPath not exist", srtPath);
        this.logger.warn("audioPath not exist", audioPath);
        this.logger.warn("videoPath not exist", videoPath);
        this.logger.warn(language, fileName, model);
      }
    } catch (error) {
      this.logger.error("findFileThenTranslate error", error);
    }
  }
  private async handleAudio(
    audioPath: string,
    fileName: string,
    videoPath?: string
  ) {
    if (!audioPath && videoPath) {
      try {
        audioPath = path.join(path.dirname(videoPath), fileName + ".wav");
        await extractAudio(videoPath, audioPath);
        console.info("extractAudio done");
        console.info("audioPath:", audioPath);
      } catch (error) {
        console.warn("extractAudio error", error);
      }
    }
    return audioPath;
  }

  findFile(dirPath, targetName) {
    console.info("dirPath", dirPath);
    const files = fs.readdirSync(dirPath);
    for (let i = 0; i < files.length; i++) {
      const filename = files[i];
      if (
        path.basename(filename, path.extname(filename)) ===
          path.basename(targetName, path.extname(targetName)) ||
        path.basename(filename, path.extname(filename)) === targetName
      ) {
        return path.join(dirPath, filename);
      }
    }
    return null;
  }

  update(id: number, updateOsrtDto: UpdateOsrtDto) {
    return `This action updates a #${id} osrt`;
  }

  remove(id: number) {
    return `This action removes a #${id} osrt`;
  }
}
