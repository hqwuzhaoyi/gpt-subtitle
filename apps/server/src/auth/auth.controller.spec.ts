import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { UsersService } from "@/users/users.service";
import { JwtService } from "@nestjs/jwt";
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "@/users/users.entity";

describe("AuthController", () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        UsersService,
        JwtService,
        {
          provide: getRepositoryToken(User), // Replace 'VideoFileEntity' with your actual entity name
          useValue: {}, // Mock the repository methods you need
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe("signIn", () => {
    it("should return a token", async () => {
      const signInDto: RegisterDto = {
        username: "testuser",
        password: "testpassword",
      };
      const token = "testtoken";
      jest.spyOn(authService, "signIn").mockImplementation(async () => token);

      expect(await controller.signIn(signInDto)).toBe(token);
    });
  });

  describe("register", () => {
    it("should return a user", async () => {
      const registerDto: RegisterDto = {
        username: "testuser",
        password: "testpassword",
      };
      const user = { id: 1, username: "testuser", password: "testpassword" };
      jest
        .spyOn(authService, "register")
        .mockImplementation(async () => Promise.resolve(user));

      expect(await controller.register(registerDto)).toBe(user);
    });
  });

  describe("getProfile", () => {
    it("should return the authenticated user", () => {
      const user = { id: 1, username: "testuser" };
      expect(controller.getProfile({ user })).toBe(user);
    });
  });
  describe("refreshToken", () => {
    it("should refresh access token", async () => {
      const token = "testtoken";
      const newAccessToken = "newaccesstoken";
      jest
        .spyOn(authService, "refreshToken")
        .mockImplementation(async () => newAccessToken);

      expect(await controller.refreshToken({ token })).toBe(newAccessToken);
    });
  });
});
