import { Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { CreateOsrtDto, FileType, WhisperConfig } from "./dto/create-osrt.dto";
import { UpdateOsrtDto } from "./dto/update-osrt.dto";
import { whisper, extractAudio, stopWhisper, stopAllWhisper } from "whisper";
import { AudioListResult, FileListResult } from "shared-types";
import * as path from "path";
import * as fs from "fs";
import Bull, { JobStatusClean, Queue } from "bull";
import { InjectQueue } from "@nestjs/bull";
import { glob } from "glob";
import { staticPath, videoDirPath } from "utils";

import { FilesService } from "@/files/files.service";
import { TranslateService } from "@/translate/translate.service";
import { IEvent } from "./event.subject";
import { Subject } from "rxjs";
import { ListDto, PaginationDto } from "./dto/pagination.dto";
import { CustomConfigService } from "@/config/custom-config.service";

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
    @Inject("STATIC_DIR") private staticDir: string,
    @Inject("EVENT_SUBJECT") private readonly eventSubject: Subject<IEvent>,
    private customConfigService: CustomConfigService
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
    stopAllWhisper();
    return await this.getActiveJobs();
  }

  create(createOsrtDto: CreateOsrtDto) {
    return "This action adds a new osrt";
  }

  async autoStart(ln = autoTranslateLanguages, model) {
    const { list: allVideos } = await this.list();
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
    try {
      // 这将会创建一个以`staticPath`为前缀的URL
      // 注意，这假设`filePath`始终在`uploadsRoot`目录或其子目录下
      return staticPath + relativePath;
    } catch (error) {
      this.logger.error("filePathToUrl error");
      this.logger.error(error);
      this.logger.error("filePath " + filePath);
      this.logger.error("relativePath " + relativePath);
      this.logger.error("staticPath " + staticPath);
    }
  }

  async list(listDto: ListDto = {}): Promise<FileListResult> {
    try {
      let filesServiceOptions = {};
      if (listDto.page && listDto.limit) {
        const skippedItems = (listDto.page - 1) * listDto.limit;
        filesServiceOptions = {
          ...filesServiceOptions,
          skip: skippedItems,
          take: listDto.limit,
          searchKey: listDto.searchKey,
        };
      }
      const currentJobs = await this.audioQueue.getActive();
      const currentJobsFiles = currentJobs.map((job) => {
        return job.data.id;
      });
      const currentJobsIdMap = currentJobs.reduce((acc, job) => {
        acc[job.data.id] = job.id;
        return acc;
      }, {});

      const videos =
        await this.filesService.findRelatedFilesForVideo(filesServiceOptions);
      const totalCount = await this.filesService.videoFilesCount();
      const result = await Promise.all(
        videos.map(async (videoFileEntity) => {
          const audioFile = await videoFileEntity.audioFile;
          const nfoFile = await videoFileEntity.nfoFile;
          // this.logger.debug("nfoFile", JSON.stringify(nfoFile));
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
            poster: nfoFile?.poster && this.filePathToUrl(nfoFile?.poster),
            fanart: nfoFile?.fanart && this.filePathToUrl(nfoFile?.fanart),
            title: nfoFile?.title,
            originaltitle: nfoFile?.originaltitle,
            plot: nfoFile?.plot,
            actors: nfoFile?.actors,
            dateadded: nfoFile?.dateadded,
          };
        })
      );

      return {
        list: result,
        page: listDto.page,
        limit: listDto.limit,
        totalCount,
      };
    } catch (error) {
      this.logger.error(error);
    }
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
    const files = fs
      .readdirSync(this.modelsDir)
      .filter(visibleFiles)
      .filter(
        (file) => file.startsWith("ggml") && path.extname(file) === ".bin"
      );
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
    fileType: FileType = "video",
    whisperConfig?: {
      prompt?: string;
      threads?: number;
      maxContent?: number;
      entropyThold?: number;
    }
  ) {
    await this.addTranslationJob({
      language,
      id,
      model,
      priority,
      fileType,
      whisperConfig,
    });
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
      attempts: 1,
      // jobId: job.id, // TODO: 重复的jobId会导致不执行
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
      stopWhisper(processingJobId);
      await this.deleteJob(processingJobId);
    } catch (error) {
      console.error("Could not remove job", error);
      this.logger.error(error);
    }
  }

  async srtTranslate(videoDirPath, srtFile, targetSrtPath) {
    try {
      if (this.customConfigService.get("OUTPUT_SRT_THEN_TRANSLATE")) {
        const relativePath = path.relative(this.staticDir, targetSrtPath);
        const translateSubtitle = await this.translateService.translateFile(
          srtFile,
          path.dirname(relativePath)
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
    } catch (error) {
      console.error(error);
      this.logger.error(error);
    }
  }

  async findFileThenTranslate(
    {
      language,
      model,
      videoPath,
      audioPath,
      srtPath,
      srtFile,
      fileName,
      whisperConfig: propWhisperConfig,
    }: {
      language: string;
      model: string;
      videoPath: any;
      audioPath: any;
      srtPath: any;
      srtFile: any;
      fileName: any;
      whisperConfig?: WhisperConfig;
    },
    job: Bull.Job<CreateOsrtDto>
  ) {
    try {
      const getSrtFileName = (originalPath) => {
        // 获取文件所在的目录
        const dir = path.dirname(originalPath);

        // 获取文件名，但不包括扩展名
        const filenameWithoutExt = path.basename(
          originalPath,
          path.extname(originalPath)
        );

        // 创建新路径
        const newPath = path.join(dir, filenameWithoutExt + ".srt");
        return newPath;
      };

      const targetSrtPath = path.join(this.staticDir, "/video", srtFile);
      job.progress(10);

      const globalWhisperConfig =
        await this.customConfigService.getWhisperConfig();

      const whisperConfig = propWhisperConfig
        ? {
            ...propWhisperConfig,
            mc: propWhisperConfig.maxContent + "",
            et: propWhisperConfig.entropyThold + "",
            threads: propWhisperConfig.threads + "",
          }
        : globalWhisperConfig;

      if (srtPath) {
        console.info("srtPath exist", srtPath + ".srt");
        this.eventSubject.next({
          msg: `srtPath exist ${srtPath}.srt`,
          jobId: String(job.id),
        });
        const result = await this.srtTranslate(
          videoDirPath,
          srtFile,
          targetSrtPath
        );
        this.eventSubject.next({
          msg: `srtTranslate done ${JSON.stringify(result)}`,
          jobId: String(job.id),
        });
        job.progress(100);
        return result;
      } else if (audioPath) {
        console.info("audioPath exist", audioPath);
        this.eventSubject.next({
          msg: `audioPath exist ${audioPath}`,
          jobId: String(job.id),
        });

        const status = await whisper(
          audioPath,
          language,
          model,
          job.id.toString(),
          (data) => {
            this.eventSubject.next({
              msg: `whisper ${data}`,
              jobId: String(job.id),
            });
          },
          whisperConfig
        );
        job.progress(50);
        if (status === "SIGTERM") {
          return [];
        }
        const srtPath = getSrtFileName(audioPath);
        fs.renameSync(audioPath + ".srt", srtPath);
        const subtitleFiles = await this.srtTranslate(
          videoDirPath,
          srtFile,
          srtPath
        );
        this.eventSubject.next({
          msg: `srtTranslate done ${JSON.stringify(subtitleFiles)}`,
          jobId: String(job.id),
        });
        job.progress(100);
        return [...subtitleFiles, { path: audioPath }];
      } else if (videoPath) {
        console.info("videoPath exist", videoPath);
        this.eventSubject.next({
          msg: `videoPath exist ${videoPath}`,
          jobId: String(job.id),
        });
        this.eventSubject.next({
          msg: `start extractAudio`,
          jobId: String(job.id),
        });
        const finalAudioPath = await this.handleAudio(
          audioPath,
          fileName,
          videoPath
        );
        this.eventSubject.next({
          msg: `extractAudio done ${finalAudioPath}`,
          jobId: String(job.id),
        });
        job.progress(30);
        this.eventSubject.next({
          msg: `start whisper ${finalAudioPath} ${language} ${model} ${job.id.toString()}`,
          jobId: String(job.id),
        });

        const status = await whisper(
          finalAudioPath,
          language,
          model,
          job.id.toString(),
          (data) => {
            this.eventSubject.next({
              msg: `whisper ${data}`,
              jobId: String(job.id),
            });
          },
          whisperConfig
        );
        this.eventSubject.next({
          msg: `whisper done ${status}`,
          jobId: String(job.id),
        });
        if (status === "SIGTERM") {
          return [];
        }
        job.progress(80);
        const srtPath = getSrtFileName(finalAudioPath);
        fs.renameSync(finalAudioPath + ".srt", srtPath);
        this.eventSubject.next({
          msg: `srtPath ${srtPath}`,
          jobId: String(job.id),
        });
        const subtitleFiles = await this.srtTranslate(
          videoDirPath,
          srtFile,
          srtPath
        );
        this.eventSubject.next({
          msg: `srtTranslate done ${JSON.stringify(subtitleFiles)}`,
          jobId: String(job.id),
        });
        job.progress(100);
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
        this.eventSubject.next({
          msg: `srtPath not exist ${srtPath}`,
          jobId: String(job.id),
        });
      }
    } catch (error) {
      this.logger.error("findFileThenTranslate error", error);
      this.eventSubject.next({
        msg: `findFileThenTranslate error ${error.message}`,
        jobId: String(job.id),
      });
      return [];
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
