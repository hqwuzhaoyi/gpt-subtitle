import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { RegisterDto } from "./dto/register.dto";
import { jwtConstants } from "./constants";
import { OAuthSignInDto } from "./dto/outhSignIn.dto";
import { CustomConfigService } from "@/config/custom-config.service";

@Injectable()
export class AuthService {
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
      console.debug("refreshToken payload: " + JSON.stringify(payload));
      console.debug("refreshToken userExists: " + JSON.stringify(userExists));

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

  async updateProfile(user, { username, password, outputSrtThenTranslate }) {
    if (outputSrtThenTranslate) {
      this.configService.set("outputSrtThenTranslate", outputSrtThenTranslate);
    }

    return this.usersService.updateProfile(user.id, {
      username,
      password,
    });
  }
}
