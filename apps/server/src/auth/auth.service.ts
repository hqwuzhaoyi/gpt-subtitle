import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { RegisterDto } from "./dto/register.dto";
import { jwtConstants } from "./constants";
import { OAuthSignInDto } from "./dto/outhSignIn.dto";
import { CustomConfigService } from "@/config/custom-config.service";

@Injectable()
export class AuthService {
  private logger: Logger = new Logger("AuthService");
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: CustomConfigService
  ) {}

  async signIn(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    // instead of the user object
    const payload = { sub: user.id, username: user.username };

    const refreshToken = await this.jwtService.signAsync(payload); // 或使用其他方法生成
    await this.usersService.storeRefreshToken(refreshToken, user.id); // 假设你有这个方法

    return {
      access_token: await this.jwtService.signAsync(payload),
      refresh_token: refreshToken,
      expires_in: jwtConstants.expiresIn,
      user: {
        username: user.username,
        id: user.id,
      },
    };
  }

  async refreshToken(token: string) {
    try {
      // Verify the refresh token
      const payload = await this.jwtService.verifyAsync(token);
      const userExists = await this.usersService.verifyRefreshToken(
        token,
        payload.sub
      );

      // Optional: Check if the refresh token is in the database and still valid
      // if not, throw an exception
      // console.debug("refreshToken payload: " + JSON.stringify(payload));
      // console.debug("refreshToken userExists: " + JSON.stringify(userExists));

      // Create a new access token
      const user = { sub: payload.id, username: payload.username }; // this is just a placeholder. Adjust according to your payload structure
      const newAccessToken = await this.jwtService.signAsync(user);

      return {
        access_token: newAccessToken,
      };
    } catch (error) {
      // Handle token verification errors
      throw new UnauthorizedException(
        "Invalid refresh token: " + error.message
      );
    }
  }

  async register(registerDto: RegisterDto) {
    const { username, password } = registerDto;
    return this.usersService.register(username, password);
  }

  async oauthSignIn(oauthData: OAuthSignInDto): Promise<any> {
    let user = await this.usersService.findOneByProviderId(oauthData.user.id);

    // 如果用户不存在，创建一个新用户
    if (!user) {
      user = await this.usersService.createOAuthUser(oauthData);
    }

    // 创建token的payload
    const payload = { sub: user.id, username: user.username };

    const refreshToken = await this.jwtService.signAsync(payload);
    await this.usersService.storeRefreshToken(refreshToken, user.id);

    return {
      access_token: await this.jwtService.signAsync(payload),
      refresh_token: refreshToken,
      expires_in: jwtConstants.expiresIn,
      user: {
        name: user.username,
        id: user.id,
        image: user.image,
        email: user.email,
      },
    };
  }

  async getProfile(userId: number) {
    const user = await this.usersService.findOneById(userId);
    return {
      id: user.id,
      username: user.username,
      userType: user.userType,
    };
  }

  async updateProfile(user, updates) {
    // 定义需要特殊处理的字段
    const specialHandling = {
      OUTPUT_SRT_THEN_TRANSLATE: (value) => (value ? "1" : "0"),
      AUTO_START_FILTER: (value) => (value ? "1" : "0"),
    };

    this.logger.log(`Updating user profile: ${JSON.stringify(updates)}`);

    // 遍历updates对象的所有键，动态设置配置
    Object.keys(updates).forEach((key) => {
      // 检查字段是否需要特殊处理
      const value = specialHandling[key]
        ? specialHandling[key](updates[key])
        : updates[key];

      // 如果是布尔值且不在特殊处理中，将其转换为"1"或"0"
      if (typeof value === "boolean" && !specialHandling[key]) {
        this.configService.set(key, value ? "1" : "0");
      } else if (value) {
        // 避免未定义或空值
        this.configService.set(key, value);
      }
    });

    // 使用同一方法获取更新后的配置值
    const response = Object.keys(updates).reduce((acc, key) => {
      acc[key] = this.configService.get(key);
      return acc;
    }, {});

    return response;
  }

  async updateWhisper(obj) {
    if (obj) {
      Object.keys(obj).forEach((key) => {
        this.configService.set(key, obj[key]);
      });
    }
  }

  async getWhisper() {
    const objPromise = {
      model: this.configService.get("model"),
      videoLanguage: this.configService.get("videoLanguage"),
      maxContent: this.configService.get("maxContent"),
      entropyThold: this.configService.get("entropyThold"),
      prompt: this.configService.get("prompt"),
      threads: this.configService.get("threads"),
    };

    return Promise.all(Object.values(objPromise)).then((values) => {
      return Object.keys(objPromise).reduce((obj, key, index) => {
        obj[key] = values[index];
        return obj;
      }, {});
    });
  }
}
