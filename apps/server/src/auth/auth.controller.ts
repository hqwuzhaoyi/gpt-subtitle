import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  Response,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "./auth.guard";
import { AuthService } from "./auth.service";
import { Public } from "./decorators/public.decorator";
import { RegisterDto } from "./dto/register.dto";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post("login")
  signIn(@Body() signInDto: RegisterDto) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post("refreshToken")
  refreshToken(@Body() { token }) {
    return this.authService.refreshToken(token);
  }

  @Public()
  @Post("register")
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @UseGuards(AuthGuard)
  @Get("profile")
  getProfile(@Request() req) {
    return req.user;
  }

  @Post("logout")
  async logout(@Request() req, @Response() res) {
    // If you're using a blacklist, add the token to it.
    // If tokens have an expiry, simply let it expire.

    // Clear the JWT token on client side
    res.clearCookie("jwt"); // If the JWT is stored in a cookie
    return res.status(200).send({ message: "Logged out successfully" });
  }
}
