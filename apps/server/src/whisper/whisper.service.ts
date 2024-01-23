import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { CreateWhisperDto } from "./dto/create-whisper.dto";
import { UpdateWhisperDto } from "./dto/update-whisper.dto";
import {
  WhisperInterface,
  extractAudio,
  stopAllWhisper,
  stopWhisper,
  whisper,
  setupWhisper,
  compileWhisperModel,
} from "whisper";
import * as path from "path";
import * as fs from "fs";
import { FirstSetupDto } from "./dto/first-setup.dto";
import { WhisperModel } from "shared-types";
import { WhisperModelDto } from "./dto/whisper-model.dto";

const visibleFiles = (file: string) => !file.startsWith(".");

@Injectable()
export class WhisperService {
  private readonly whisperDir = path.join(
    __dirname,
    "..",
    "..",
    "..",
    "..",
    "whisper"
  );
  private readonly modelsDir = path.join(this.whisperDir, "models");

  private logger: Logger = new Logger("WhisperService");

  create(createWhisperDto: CreateWhisperDto) {
    return "This action adds a new whisper";
  }

  findAll() {
    return `This action returns all whisper`;
  }

  findOne(id: number) {
    return `This action returns a #${id} whisper`;
  }

  update(id: number, updateWhisperDto: UpdateWhisperDto) {
    return `This action updates a #${id} whisper`;
  }

  remove(id: number) {
    return `This action removes a #${id} whisper`;
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

  async extra(videoPath, audioPath) {
    await extractAudio(videoPath, audioPath);
  }

  async start(
    ...args: Parameters<WhisperInterface>
  ): Promise<ReturnType<WhisperInterface>> {
    this.logger.log("start", args);
    return whisper(...args);
  }

  async stop(processingJobId: string) {
    stopWhisper(processingJobId);
  }

  stopAll() {
    stopAllWhisper();
  }

  async firstSetUp(firstSetupDto: FirstSetupDto) {
    // 如果this.whisperDir存在
    if (fs.existsSync(this.whisperDir) && !firstSetupDto.force) {
      // throw new InternalServerErrorException("alreadySetup");
      // 如果this.modelsDir存在
      return this.findAllModels();
    }

    this.logger.log("firstSetUp", firstSetupDto);

    await setupWhisper({
      dir: this.whisperDir,
      makeType: firstSetupDto.makeType,
    });
    return this.findAllModels();
  }

  async downloadModel(downloadModelDto: WhisperModelDto) {
    this.logger.log("downloadModel", downloadModelDto);
    const data = await compileWhisperModel(
      this.whisperDir,
      downloadModelDto.model,
      downloadModelDto.makeType
    );
    return data;
  }
}
