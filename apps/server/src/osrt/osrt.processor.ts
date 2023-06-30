// queue.processor.ts
import { Processor, Process } from "@nestjs/bull";
import { Job } from "bull";
import { OsrtService } from "./osrt.service";
import { OsrtGateway } from "./osrt.gateway";

@Processor("audio")
export class QueueProcessor {
  constructor(
    private readonly osrtService: OsrtService,
    private readonly osrtGateway: OsrtGateway
  ) {}

  @Process("transcode")
  async transcode(job: Job<unknown>) {
    console.log("Start processing job...");
    // your job processing logic
    console.log(job.data);
    console.log("Finished processing job...");
  }

  @Process({
    name: "translate",
    concurrency: 1,
  })
  async handleTranslationJob(
    job: Job<{ ln: string; file: string; model }>
  ): Promise<void> {
    this.osrtGateway.notifyClient(job.id as string, "start", job.data);

    const { ln, file, model } = job.data;
    try {
      const url = await this.osrtService.findFileThenTranslate(ln, file, model);

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
