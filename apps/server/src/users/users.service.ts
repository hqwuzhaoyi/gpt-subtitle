import { Injectable } from "@nestjs/common";
import { User } from "./users.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RefreshToken } from "./refresh-token.entity";

// This should be a real class/interface representing a user entity

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>
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

  async storeRefreshToken(token: string, id: number): Promise<void> {
    const refreshToken = new RefreshToken();
    refreshToken.token = token;
    refreshToken.user = await this.userRepository.findOne({ where: { id } });
    await this.refreshTokenRepository.save(refreshToken);
  }

  async verifyRefreshToken(token: string, id: number): Promise<boolean> {
    const foundToken = await this.refreshTokenRepository.findOne({
      where: { token: token, user: { id: id } },
    });
    return !!foundToken;
  }

  async revokeRefreshToken(token: string): Promise<void> {
    await this.refreshTokenRepository.delete({ token });
  }
}
