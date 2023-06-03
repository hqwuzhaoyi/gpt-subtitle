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

  async findVideo(fileName: string, ln: string) {
    const samplesDir = path.join(__dirname, "..", "..", "..", "..", "samples");

    const videoDir = path.join(samplesDir, "video");
    const audioDir = path.join(samplesDir, "audio");

    const videoPath = this.findFile(videoDir, fileName);

    if (videoPath) {
      console.info("videoPath exist", videoPath);
      let audioPath = this.findFile(audioDir, fileName);
      if (audioPath) {
        console.info("audioPath exist", audioPath);
      } else {
        try {
          audioPath = path.join(samplesDir, "audio", fileName + ".wav");
          await extractAudio(videoPath, audioPath);

          console.info("extractAudio done");
          console.info("audioPath:", audioPath);
        } catch (error) {
          console.warn("extractAudio error", error);
        }
      }

      whisper(audioPath, ln);
    } else {
      console.warn("videoPath not exist");
    }
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
