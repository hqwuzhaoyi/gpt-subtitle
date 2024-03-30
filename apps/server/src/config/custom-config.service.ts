import { Injectable } from "@nestjs/common";
import { ConfigService as NextConfigService } from "@nestjs/config";
import { DatabaseConfigService } from "./config.service";

@Injectable()
export class CustomConfigService {
  constructor(
    private readonly configService: DatabaseConfigService,
    private readonly nextConfigService: NextConfigService
  ) {}

  getStatic(key: string): string {
    return this.nextConfigService.get<string>(key);
  }

  async getDynamic(key: string): Promise<string> {
    const config = await this.configService.get(key);
    return config?.value;
  }

  async get(key: string): Promise<string> {
    return (await this.getDynamic(key)) || this.getStatic(key);
  }

  async set(key: string, value: string): Promise<void> {
    if (!key || !value) return;
    await this.configService.set(key, value);
  }

  async getAll(): Promise<Record<string, string>> {
    return this.configService.getAll();
  }

  async getWhisperConfig(): Promise<{
    mc?: string;
    et?: string;
    prompt?: string;
    threads?: string;
  }> {
    const prompt = await this.get("prompt");
    const threads = await this.get("threads");
    const maxContent = await this.get("maxContent");
    const entropyThold = await this.get("entropyThold");
    return {
      mc: maxContent,
      et: entropyThold,
      prompt: prompt,
      threads: threads,
    };
  }

  async autoStartCustomSettings(): Promise<{
    isCustom: boolean;
    ln: string;
  }> {
    const ln = await this.get("AUTO_START_PREFERRED_LANGUAGE");
    const isCustom = await this.get("AUTO_START_FILTER");
    return {
      isCustom: isCustom === "1",
      ln: ln,
    };
  }
}
