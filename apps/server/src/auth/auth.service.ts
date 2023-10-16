import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { RegisterDto } from "./dto/register.dto";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async signIn(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    // instead of the user object
    const payload = { sub: user.id, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
      username: user.username,
      id: user.id,
    };
  }

  async refreshToken(token: string) {
    try {
      // Verify the refresh token
      const payload = await this.jwtService.verifyAsync(token);

      // Optional: Check if the refresh token is in the database and still valid
      // if not, throw an exception
      console.debug("refreshToken payload: " + JSON.stringify(payload));

      // Create a new access token
      const user = { sub: payload.id, username: payload.username }; // this is just a placeholder. Adjust according to your payload structure
      const newAccessToken = await this.jwtService.signAsync(user);

      return newAccessToken;
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
}
