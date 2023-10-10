import { Injectable } from "@nestjs/common";
import { User } from "./users.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

// This should be a real class/interface representing a user entity

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async findOne(username: string): Promise<User | undefined> {
    return await this.userRepository.findOne({ where: { username } });
  }

  async register(username: string, password: string) {
    const user = new User();
    user.username = username;
    user.password = password; // 注意: 实际中，你需要加密密码，可以使用库如 bcrypt
    return await this.userRepository.save(user);
  }
}
