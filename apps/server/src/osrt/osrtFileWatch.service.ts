import { Injectable, OnModuleInit } from "@nestjs/common";
import { Queue } from "bull";
import { InjectQueue } from "@nestjs/bull";
import { basename } from "path";
import * as path from "path";
import * as fs from "fs";
import * as chokidar from "chokidar";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { FileEntity } from "./entities/file.entity";

@Injectable()
export class FileWatcherService implements OnModuleInit {
  constructor(
    @InjectRepository(FileEntity)
    private filesRepository: Repository<FileEntity>,
    @InjectQueue("audio") private readonly audioQueue: Queue
  ) {}

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

  onModuleInit(): void {
    this.watchFiles();
    this.saveFilesToDB();
  }

  private async saveFilesToDB() {
    const files = fs
      .readdirSync(this.videoDir)
      .filter((file) => !file.startsWith("."));

    for (const fileName of files) {
      const filePath = path.join(this.videoDir, fileName);
      const existsInDb = await this.filesRepository.findOne({
        where: { filePath },
      });

      if (!existsInDb) {
        const newFile = this.filesRepository.create({
          filePath,
          fileName,
          status: "todo",
          baseName: path.basename(fileName, path.extname(fileName)),
          extName: path.extname(fileName),
        });
        await this.filesRepository.save(newFile);
      }
    }
  }

  private watchFiles(): void {
    const watcher = chokidar.watch(this.videoDir, {
      ignored: /^\./, // ignore dotfiles
      persistent: true,
    });

    watcher.on("add", (path, stats) => {
      const fileName = basename(path);
      console.log(`File ${path} has been added,${fileName}`);

      this.audioQueue.add({
        filePath: path,
        translateOption: "option",
      });
    });
  }
}
