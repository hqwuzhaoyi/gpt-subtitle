import {
  InjectQueue,
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from "@nestjs/bull";
import { Job, Queue } from "bull";
import { VideoDirFileGroup, WatchService } from "./watch.service";

@Processor("watchFiles")
export class WatchProcessor {
  constructor(
    private readonly watchService: WatchService,
    @InjectQueue("watchFiles") private watchFilesQueue: Queue
  ) {}

  private activeJobsCount = 0;

  @Process("findAndClassifyFiles")
  async handleFileClassification(job: Job) {
    // 你的文件分类逻辑
    const result = await this.watchService.findAndClassifyFilesWithDir();

    this.activeJobsCount += result.length; // 增加作业计数

    for (const item of result) {
      await this.watchFilesQueue.add("saveVideoFileGroup", item);
    }
  }

  @Process("saveVideoFileGroup")
  async handleVideoFileGroup(job: Job) {
    // 你的文件分类逻辑
    const result = await this.watchService.saveVideoFileGroup(job.data);
  }

  @OnQueueCompleted()
  onCompleted(job: Job) {
    if (job.name === "saveVideoFileGroup") {
      this.decrementJobCount();
    }
  }

  @OnQueueFailed()
  onFailed(job: Job) {
    if (job.name === "saveVideoFileGroup") {
      this.decrementJobCount();
    }
  }

  private decrementJobCount() {
    this.activeJobsCount--;
    if (this.activeJobsCount === 0) {
      // 所有作业都完成了
      console.log("All saveVideoFileGroup jobs have been completed");
      this.watchService.handleInitializeFinished();
      // 这里可以触发后续的逻辑
    }
  }
}
