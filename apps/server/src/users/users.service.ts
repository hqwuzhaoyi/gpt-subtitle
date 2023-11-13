import { Injectable } from "@nestjs/common";
import { RegularUser, OAuthUser, User } from "./users.entity";
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
    private readonly refreshTokenRepository: Repository<RefreshToken>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async findOne(username: string): Promise<RegularUser | undefined> {
    return await this.regularUserRepository.findOne({ where: { username } });
  }

  async register(username: string, password: string) {
    const user = new RegularUser();
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
    user.username = oauthData.user.name;
    user.email = oauthData.user.email;
    user.image = oauthData.user.image;
    user.providerId = oauthData.user.id; // 假设User实体有一个providerId字段来存储OAuth提供者的ID
    user.provider = oauthData.account.provider; // 假设User实体有一个provider字段来存储OAuth提供者的名称
    return this.oauthUserRepository.save(user);
  }

  async findOneById(id: number): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { id } });
  }

  async updateProfile(id, { username, password }) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new Error("User not found");
    }

    if (user.userType === "RegularUser") {
      // 检查用户是否为 RegularUser 类型
      const regularUser = await this.regularUserRepository.findOne({
        where: { id },
      });
      if (regularUser) {
        if (password) regularUser.password = password; // 更新密码
        if (username) regularUser.username = username; // 更新密码
        const user = await this.regularUserRepository.save(regularUser);
        return {
          id: user.id,
          username: user.username,
          userType: user.userType,
        };
      }
    } else {
      // 检查用户是否为 OAuthUser 类型
      const oauthUser = await this.oauthUserRepository.findOne({
        where: { id },
      });
      if (oauthUser) {
        if (username) oauthUser.username = username; // 更新用户名
        const user = await this.oauthUserRepository.save(oauthUser);
        return {
          id: user.id,
          username: user.username,
          userType: user.userType,
        };
      }
    }
  }
}
