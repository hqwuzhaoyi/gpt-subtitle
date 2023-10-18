import { Injectable } from "@nestjs/common";
import { RegularUser, OAuthUser } from "./users.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RefreshToken } from "./refresh-token.entity";
import { OAuthSignInDto } from "@/auth/dto/outhSignIn.dto";

// This should be a real class/interface representing a user entity

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(RegularUser)
    private readonly regularUserRepository: Repository<RegularUser>,
    @InjectRepository(OAuthUser)
    private readonly oauthUserRepository: Repository<OAuthUser>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>
  ) {}

  async findOne(username: string): Promise<RegularUser | undefined> {
    return await this.regularUserRepository.findOne({ where: { username } });
  }

  async register(username: string, password: string) {
    const user = new RegularUser();
    user.userType = "regular";
    user.username = username;
    user.password = password; // 注意: 实际中，你需要加密密码，可以使用库如 bcrypt
    return await this.regularUserRepository.save(user);
  }

  async storeRefreshToken(token: string, id: number): Promise<void> {
    const refreshToken = new RefreshToken();
    refreshToken.token = token;
    refreshToken.user = await this.regularUserRepository.findOne({
      where: { id },
    });
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

  async findOneByProviderId(
    providerId: string
  ): Promise<OAuthUser | undefined> {
    return this.oauthUserRepository.findOne({ where: { providerId } });
  }

  async createOAuthUser(oauthData: OAuthSignInDto): Promise<OAuthUser> {
    const user = new OAuthUser();
    user.userType = "oauth";
    user.username = oauthData.user.name;
    user.email = oauthData.user.email;
    user.image = oauthData.user.image;
    user.providerId = oauthData.user.id; // 假设User实体有一个providerId字段来存储OAuth提供者的ID
    user.provider = oauthData.account.provider; // 假设User实体有一个provider字段来存储OAuth提供者的名称
    return this.oauthUserRepository.save(user);
  }
}
