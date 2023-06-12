import { Injectable } from "@nestjs/common";
import { CreateOsrtDto } from "./dto/create-osrt.dto";
import { UpdateOsrtDto } from "./dto/update-osrt.dto";
import { whisper, extractAudio, stopWhisper } from "whisper";
import * as path from "path";
import * as fs from "fs";

@Injectable()
export class OsrtService {
  create(createOsrtDto: CreateOsrtDto) {
    return "This action adds a new osrt";
  }

  findAll() {
    whisper("jfk.wav", "en");
    return `This action returns all osrt`;
  }

  findOne(file: string, ln: string) {
    this.findVideo(file, ln);
    return `This action returns a #${file} osrt`;
  }

  stop() {
    stopWhisper();
  }

  private samplesDir = path.join(__dirname, "..", "..", "..", "..", "samples");
  private videoDir = path.join(this.samplesDir, "video");
  private audioDir = path.join(this.samplesDir, "audio");

  async findVideo(fileName: string, ln: string) {
    const videoPath = this.findFile(this.videoDir, fileName);
    const audioPath = this.findFile(this.audioDir, fileName);
    const srtPath = this.findFile(this.audioDir, fileName + ".srt");

    if (srtPath) {
      console.info("srtPath exist", srtPath+ ".srt");
    } else if (audioPath) {
      console.info("audioPath exist", audioPath);
      const result = await whisper(audioPath, ln);
    } else if (videoPath) {
      console.info("videoPath exist", videoPath);
      const finalAudioPath = await this.handleAudio(
        audioPath,
        fileName,
        videoPath
      );
      const result = await whisper(finalAudioPath, ln);
      console.log("result", result);
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
