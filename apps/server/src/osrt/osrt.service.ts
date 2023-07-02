import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { CreateOsrtDto } from "./dto/create-osrt.dto";
import { UpdateOsrtDto } from "./dto/update-osrt.dto";
import { whisper, extractAudio, stopWhisper } from "whisper";
import { FileListResult } from "shared-types";
import * as path from "path";
import * as fs from "fs";
import Bull, { Queue } from "bull";
import { InjectQueue } from "@nestjs/bull";
import { glob } from "glob";

const staticHost =
  process.env.STATIC_HOST ||
  `http://localhost:${process.env.SERVER_PORT}/static`;
const visibleFiles = (file: string) => !file.startsWith(".");
const autoTranslateLanguages = "ja";
const videoExtensions = ["mp4", "mkv", "avi", "mov", "flv", "wmv"];
const audioExtensions = ["mp3", "wav", "ogg", "flac"];
const subtitleExtensions = ["srt", "ass"];

@Injectable()
export class OsrtService {
  constructor(@InjectQueue("audio") private audioQueue: Queue) {}

  private logger: Logger = new Logger("OsrtService");

  private readonly samplesDir = path.join(
    __dirname,
    "..",
    "..",
    "..",
    "..",
    "samples"
  );
  private readonly staticDir = path.join(
    __dirname,
    "..",
    "..",
    "..",
    "..",
    "uploads"
  );
  private readonly videoDir = path.join(this.samplesDir, "video");
  private readonly audioDir = path.join(this.samplesDir, "audio");
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

  create(createOsrtDto: CreateOsrtDto) {
    return "This action adds a new osrt";
  }

  async autoStart(ln = autoTranslateLanguages, model) {
    const allVideos = await this.findAll();
    return allVideos
      .filter((video) => !video.exist.subtitle)
      .filter((video) => !video.isProcessing)
      .map((video) => {
        this.translate(ln, video.name, model);
        return video.name;
      });
  }

  async findAll(): Promise<FileListResult[]> {
    const subtitles = await this.findAllSrt();
    const videos = await this.findAllVideo();
    const audios = await this.findAllAudio();
    const currentJobs = await this.audioQueue.getActive();
    const currentJobsFiles = currentJobs.map((job) => {
      return job.data.file;
    });
    const currentJobsIdMap = currentJobs.reduce((acc, job) => {
      acc[job.data.file] = job.id;
      return acc;
    }, {});
    const result = videos
      .map((file) => path.parse(file).name)
      .map((videoName) => {
        const audioExists = audios.find((file) =>
          path.parse(file).name.includes(videoName)
        );

        const subtitleExists = subtitles.find((file) =>
          path.parse(file).name.includes(videoName)
        );

        return {
          name: videoName,
          exist: {
            audio: !!audioExists,
            subtitle: !!subtitleExists,
            subtitlePath: subtitleExists
              ? `${staticHost}/${subtitleExists}`
              : undefined,
          },
          isProcessing: currentJobsFiles.includes(videoName),
          processingJobId: currentJobsIdMap[videoName],
        };
      });

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

  async translate(language: string, file: string, model: string) {
    await this.addTranslationJob({ language, file, model });
    return `This action returns a #${file} osrt`;
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
    const result = await this.audioQueue.add("translate", {
      ...job,
      ln: job.language,
    });
    console.info("result", result);
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

  async findFileThenTranslate(ln: string, fileName: string, model: string) {
    const videoPath = this.findFile(this.videoDir, fileName);
    const audioPath = this.findFile(this.audioDir, fileName);
    const srtFile = fileName + ".srt";
    const srtPath = this.findFile(this.staticDir, srtFile);

    const targetSrtPath = path.join(this.staticDir, srtFile);
    if (srtPath) {
      console.info("srtPath exist", srtPath + ".srt");
      return `${staticHost}/${srtFile}`;
    } else if (audioPath) {
      console.info("audioPath exist", audioPath);
      await whisper(audioPath, ln, model);
      fs.renameSync(audioPath + ".srt", targetSrtPath);
      return `${staticHost}/${srtFile}`;
    } else if (videoPath) {
      console.info("videoPath exist", videoPath);
      const finalAudioPath = await this.handleAudio(
        audioPath,
        fileName,
        videoPath
      );
      await whisper(finalAudioPath, ln, model);
      fs.renameSync(finalAudioPath + ".srt", targetSrtPath);
      return `${staticHost}/${srtFile}`;
    } else {
      console.warn("videoPath not exist");
    }
  }

  private async handleAudio(
    audioPath: string,
    fileName: string,
    videoPath?: string
  ) {
    if (!audioPath && videoPath) {
      try {
        audioPath = path.join(this.samplesDir, "audio", fileName + ".wav");
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
    console.info("files", files);
    for (let i = 0; i < files.length; i++) {
      const filename = files[i];
      if (
        path.basename(filename, path.extname(filename)) ===
        path.basename(targetName, path.extname(targetName))
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
