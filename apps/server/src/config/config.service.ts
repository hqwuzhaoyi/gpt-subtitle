// config.service.ts
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Config } from "./config.entity";

@Injectable()
export class DatabaseConfigService {
  constructor(
    @InjectRepository(Config)
    private configRepository: Repository<Config>
  ) {}

  async get(key: string): Promise<Config> {
    return this.configRepository.findOne({ where: { key } });
  }

  async set(key: string, value: string): Promise<Config> {
    let config = await this.configRepository.findOne({ where: { key } });
    if (config) {
      config.value = value;
    } else {
      config = this.configRepository.create({ key, value });
    }
    return this.configRepository.save(config);
  }

  async getAll(): Promise<Record<string, string>> {
    const configs = await this.configRepository.find();
    return configs.reduce((acc, config) => {
      acc[config.key] = config.value;
      return acc;
    }, {});
  }
}
