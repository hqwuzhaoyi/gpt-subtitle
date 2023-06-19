// queue.processor.ts
import { Processor, Process } from "@nestjs/bull";
import { Job } from "bull";
import { OsrtService } from "./osrt.service";

@Processor("audio")
export class QueueProcessor {
  constructor(private readonly osrtService: OsrtService) {}

  @Process("transcode")
  async transcode(job: Job<unknown>) {
    console.log("Start processing job...");
    // your job processing logic
    console.log(job.data);
    console.log("Finished processing job...");
  }

  @Process("translate")
  async handleTranslationJob(
    job: Job<{ ln: string; file: string }>
  ): Promise<void> {
    const { ln, file } = job.data;
    const result = await this.osrtService.findFileThenTranslate(ln, file);

    // 你可以通过 job.progress 更新任务进度
    // 你也可以使用 job.log 来记录任务的日志

    // return result;
  }
}
