// queue.processor.ts
import { Processor, Process } from "@nestjs/bull";
import { Job } from "bull";
import { OsrtService } from "./osrt.service";
import { SharedGateway } from "../shared/shared.gateway";
import { Logger } from "@nestjs/common";
import { FilesService } from "@/files/files.service";
import { CreateOsrtDto } from "./dto/create-osrt.dto";
import { WatchService } from "@/files/watch/watch.service";

@Processor("audio")
export class QueueProcessor {
  constructor(
    private readonly osrtService: OsrtService,
    private readonly osrtGateway: SharedGateway,
    private readonly filesService: FilesService,
    private readonly watchService: WatchService
  ) {}

  private logger: Logger = new Logger("MessageGateway");

  @Process("transcode")
  async transcode(job: Job<unknown>) {
    this.logger.log("Start processing job...");
    // your job processing logic
    this.logger.log("Finished processing job...");
  }

  @Process({
    name: "translate",
    concurrency: 1,
  })
  async handleTranslationJob(job: Job<CreateOsrtDto>): Promise<void> {
    this.osrtGateway.notifyClient(job.id as string, "start", job.data);
    const { language, id, model, fileType } = job.data;
    try {
      let videoPath, audioPath, srtPath, fileName, srtFile;
      if (fileType === "audio") {
        const audioFileEntity = await this.filesService.findAudioFile(id);

        audioPath = audioFileEntity.filePath;
        srtPath = (await audioFileEntity.subtitleFiles?.[0])?.filePath;
        fileName = audioFileEntity.baseName;
        srtFile = fileName + ".srt";
      } else if (fileType === "video") {
        const videoFileEntity = await this.filesService.findVideoFile(id);

        videoPath = videoFileEntity.filePath;
        audioPath = (await videoFileEntity.audioFile)?.filePath;
        srtPath = (await videoFileEntity.audioFile)?.subtitleFiles?.[0]
          ?.filePath;
        fileName = videoFileEntity.baseName;
        srtFile = fileName + ".srt";
      } else {
        throw new Error("Unsupported file type " + fileType);
      }

      this.logger.log(
        `Start processing job... ${job.id} ${language} ${id} ${model}`
      );

      const subTitle = await this.osrtService.findFileThenTranslate(
        {
          language,
          model,
          videoPath,
          audioPath,
          srtPath,
          srtFile,
          fileName,
        },
        job
      );

      this.watchService.addFileToDB(subTitle.map(({ path }) => path));

      this.osrtGateway.notifyClient(job.id as string, "completed", {
        ...job.data,
        subTitle,
      });

      // 你可以通过 job.progress 更新任务进度
      // 你也可以使用 job.log 来记录任务的日志
    } catch (error) {
      // 任务失败，通知客户端
      this.osrtGateway.notifyClient(job.id as string, "failed", error.message);
    }
  }
}
