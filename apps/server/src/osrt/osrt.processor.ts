// queue.processor.ts
import { Processor, Process } from "@nestjs/bull";
import { Job } from "bull";
import { OsrtService } from "./osrt.service";
import { SharedGateway } from "../shared/shared.gateway";
import { Logger } from "@nestjs/common";
import { FilesService } from "@/files/files.service";

@Processor("audio")
export class QueueProcessor {
  constructor(
    private readonly osrtService: OsrtService,
    private readonly osrtGateway: SharedGateway,
    private readonly filesService: FilesService
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
  async handleTranslationJob(
    job: Job<{ ln: string; file: string; model; id: string }>
  ): Promise<void> {
    this.osrtGateway.notifyClient(job.id as string, "start", job.data);
    const { ln, id, model } = job.data;

    const videoFileEntity = await this.filesService.findVideoFile(id);

    const videoPath = videoFileEntity.filePath;
    const audioPath = (await videoFileEntity.audioFile)?.filePath;
    const srtPath = (await videoFileEntity.audioFile)?.subtitleFiles?.[0]
      ?.filePath;
    const fileName = videoFileEntity.baseName;
    const srtFile = fileName + ".srt";

    try {
      this.logger.log(`Start processing job... ${job.id} ${ln} ${id} ${model}`);

      const url = await this.osrtService.findFileThenTranslate({
        ln,
        model,
        videoPath,
        audioPath,
        srtPath,
        srtFile,
        fileName,
      });

      this.osrtGateway.notifyClient(job.id as string, "completed", {
        ...job.data,
        url,
      });

      // 你可以通过 job.progress 更新任务进度
      // 你也可以使用 job.log 来记录任务的日志
    } catch (error) {
      // 任务失败，通知客户端
      this.osrtGateway.notifyClient(job.id as string, "failed", error.message);
    }
  }
}
