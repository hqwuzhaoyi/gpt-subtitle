import { Injectable, OnModuleInit } from "@nestjs/common";
import { Queue } from "bull";
import { InjectQueue } from "@nestjs/bull";
import { watch } from "fs";
import { join, basename } from "path";
import * as path from "path";
import * as chokidar from "chokidar";

@Injectable()
export class FileWatcherService implements OnModuleInit {
  constructor(@InjectQueue("audio") private readonly translateQueue: Queue) {}

  onModuleInit(): void {
    this.watchFiles();
  }

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

  private watchFiles(): void {
    const watcher = chokidar.watch(this.videoDir, {
      ignored: /^\./, // ignore dotfiles
      persistent: true,
    });

    watcher.on("add", (path, stats) => {
      const fileName = basename(path);
      console.log(`File ${path} has been added,${fileName}`);

      this.translateQueue.add({
        filePath: path,
        translateOption: "option",
      });
    });
  }
}
