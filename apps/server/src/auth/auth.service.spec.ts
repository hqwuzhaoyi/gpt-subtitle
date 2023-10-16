import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "@/users/users.service";
import { JwtService } from "@nestjs/jwt";
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "@/users/users.entity";
import { UnauthorizedException } from "@nestjs/common";
import { RegisterDto } from "./dto/register.dto";

describe("AuthService", () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn(),
            register: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
            verifyAsync: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User), // Replace 'VideoFileEntity' with your actual entity name
          useValue: {}, // Mock the repository methods you need
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it("should be defined", () => {
    expect(authService).toBeDefined();
  });

  describe("signIn", () => {
    it("should throw UnauthorizedException if user is not found", async () => {
      jest.spyOn(usersService, "findOne").mockResolvedValueOnce(undefined);

      await expect(authService.signIn("username", "password")).rejects.toThrow(
        UnauthorizedException
      );
    });

    it("should throw UnauthorizedException if password is incorrect", async () => {
      jest.spyOn(usersService, "findOne").mockResolvedValueOnce({
        id: 1,
        username: "username",
        password: "password",
      });

      await expect(
        authService.signIn("username", "incorrect-password")
      ).rejects.toThrow(UnauthorizedException);
    });

    it("should return access token if user is found and password is correct", async () => {
      const user = {
        id: 1,
        username: "username",
        password: "password",
      };
      jest.spyOn(usersService, "findOne").mockResolvedValueOnce(user);
      jest.spyOn(jwtService, "signAsync").mockResolvedValueOnce("access-token");

      const result = await authService.signIn("username", "password");

      expect(result).toEqual({
        access_token: "access-token",
        id: 1,
        username: "username",
      });
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: user.id,
        username: user.username,
      });
    });
  });

  describe("register", () => {
    it("should call usersService.register with correct arguments", async () => {
      const registerDto: RegisterDto = {
        username: "username",
        password: "password",
      };

      await authService.register(registerDto);

      expect(usersService.register).toHaveBeenCalledWith(
        registerDto.username,
        registerDto.password
      );
    });

    it("should return the result of usersService.register", async () => {
      const result = { id: 1, username: "username", password: "password" };
      jest.spyOn(usersService, "register").mockResolvedValueOnce(result);

      const registerDto: RegisterDto = {
        username: "username",
        password: "password",
      };
      const response = await authService.register(registerDto);

      expect(response).toEqual(result);
    });
  });

  describe("refreshToken", () => {
    it("should return a new access token when given a valid refresh token", async () => {
      // Arrange
      const token = "validToken";
      const payload = { id: 1, username: "testuser" };
      const newAccessToken = "newAccessToken";
      jest.spyOn(jwtService, "verifyAsync").mockResolvedValueOnce(payload);
      jest
        .spyOn(jwtService, "signAsync")
        .mockReturnValueOnce(Promise.resolve(newAccessToken));

      // Act
      const result = await authService.refreshToken(token);

      // Assert
      expect(result).toEqual(newAccessToken);
      expect(jwtService.verifyAsync).toHaveBeenCalledWith(token);
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: payload.id,
        username: payload.username,
      });
    });

    it("should throw an UnauthorizedException when given an invalid refresh token", async () => {
      // Arrange
      const token = "invalidToken";
      const error = new Error("Invalid token");
      jest.spyOn(jwtService, "verifyAsync").mockRejectedValueOnce(error);

      // Act & Assert
      await expect(authService.refreshToken(token)).rejects.toThrow(
        UnauthorizedException
      );
      expect(jwtService.verifyAsync).toHaveBeenCalledWith(token);
    });
  });
});
