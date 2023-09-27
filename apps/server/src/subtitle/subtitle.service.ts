import { Inject, Injectable, Logger } from "@nestjs/common";
import { CreateSubtitleDto } from "./dto/create-subtitle.dto";
import { UpdateSubtitleDto } from "./dto/update-subtitle.dto";
import { SubtitleFileEntity } from "@/files/entities/file.entity";
import { FilesService } from "@/files/files.service";
import * as path from "path";
import { staticPath, videoDirPath } from "utils";
import { WatchService } from "@/files/watch/watch.service";
import * as url from "url";
@Injectable()
export class SubtitleService {
  constructor(
    private readonly filesService: FilesService,
    private readonly watchService: WatchService,
    @Inject("STATIC_DIR") private staticDir: string
  ) {}

  private logger: Logger = new Logger("OsrtService");

  create(createSubtitleDto: CreateSubtitleDto) {
    return "This action adds a new subtitle";
  }

  findAll() {
    return this.findAudios();
  }

  filePathToUrl(filePath) {
    const relativePath = path.relative(this.staticDir, filePath);
    try {
      // 这将会创建一个以`staticPath`为前缀的URL
      // 注意，这假设`filePath`始终在`uploadsRoot`目录或其子目录下
      return url.resolve(
        staticPath,
        relativePath
      );
    } catch (error) {
      this.logger.error("filePathToUrl error");
      this.logger.error(error);
      this.logger.error("filePath " + filePath);
      this.logger.error("relativePath " + relativePath);
      this.logger.error("staticPath " + staticPath);
    }
  }

  async findAudios(): Promise<SubtitleFileEntity[]> {
    const subtitles = await this.filesService.findSubtitleFiles();

    const result = await Promise.all(
      subtitles.map(async (subtitleFileEntity) => {
        return {
          ...subtitleFileEntity,
          path: this.filePathToUrl(subtitleFileEntity.filePath),
          // subtitle: audioFileEntity?.subtitleFiles?.map((file) => {
          //   return { ...file, path: this.filePathToUrl(file.filePath) };
          // }),
          // isProcessing: currentJobsFiles.includes(audioFileEntity.id),
          // processingJobId: currentJobsIdMap[audioFileEntity.id],
          // status: audioFileEntity.status,
        };
      })
    );

    return result;
  }

  findOne(id: number) {
    return `This action returns a #${id} subtitle`;
  }

  update(id: number, updateSubtitleDto: UpdateSubtitleDto) {
    return `This action updates a #${id} subtitle`;
  }

  async remove(id: number) {
    const file = await this.filesService.findSubtitleFile(id);
    await this.filesService.removeWithPath(file.filePath);
    return `This action removes a #${file.filePath} subtitle`;
  }
  async uploadFile(file: Express.Multer.File): Promise<{
    originalname: string;
    filename: string;
    url: string;
  }> {
    await this.watchService.addFileToDB([file.path]);

    return {
      originalname: file.originalname,
      filename: file.filename,
      url: `${staticPath}${file.filename}`,
    };

    // 上传文件的逻辑，这里略去
  }
}
