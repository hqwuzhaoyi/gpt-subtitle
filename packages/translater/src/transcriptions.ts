import OpenAI, { toFile } from "openai";

import fs from "fs";
import path from "path";

export class GptWhisper {
  model: OpenAI;
  baseUrl: string;
  apiKey: string;
  constructor(params: { baseUrl?: string; apiKey?: string } = {}) {
    this.baseUrl = params.baseUrl;
    this.apiKey = params.apiKey;
    this.create();
  }

  create() {
    const openai = new OpenAI({
      baseURL: this.baseUrl ?? process.env.BASE_URL,
      apiKey: this.apiKey ?? process.env.OPENAI_API_KEY,
    });

    this.model = openai;
  }

  async translate() {
    const audioFile = path.resolve(__dirname, "./test.wav");
    const srtFile = path.resolve(__dirname, "./test.srt");

    try {
      const transcription = await this.model.audio.transcriptions.create({
        file: await toFile(fs.createReadStream(audioFile)),
        model: "whisper-1",
        response_format: "srt",
      });

      console.log(transcription);

      fs.createWriteStream(srtFile).write(transcription);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

const gpt = new GptWhisper({
  apiKey: "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",
});

gpt.translate();
