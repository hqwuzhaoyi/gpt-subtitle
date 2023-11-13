import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "@/users/users.service";
import { JwtService } from "@nestjs/jwt";
import { getRepositoryToken } from "@nestjs/typeorm";
import { OAuthUser, RegularUser, User } from "@/users/users.entity";
import { UnauthorizedException } from "@nestjs/common";
import { RegisterDto } from "./dto/register.dto";
import { RefreshToken } from "@/users/refresh-token.entity";
import {
  mockAccessToken,
  mockOAuthData,
  mockOAuthUser,
  mockRefreshToken,
  mockRegularUser,
} from "./testConstants";
import { jwtConstants } from "./constants";
import { CustomConfigService } from "@/config/custom-config.service";

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
            verifyRefreshToken: jest.fn(),
            storeRefreshToken: jest.fn(),
            findOneByProviderId: jest.fn(),
            createOAuthUser: jest.fn(),
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
          provide: CustomConfigService,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(RegularUser), // Replace 'VideoFileEntity' with your actual entity name
          useValue: {}, // Mock the repository methods you need
        },
        {
          provide: getRepositoryToken(OAuthUser), // Replace 'VideoFileEntity' with your actual entity name
          useValue: {}, // Mock the repository methods you need
        },
        {
          provide: getRepositoryToken(RefreshToken), // Replace 'VideoFileEntity' with your actual entity name
          useValue: {}, // Mock the repository methods you need
        },
        {
          provide: getRepositoryToken(User), // Replace 'VideoFileEntity' with your actual entity name
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          }, // Mock the repository methods you need
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
      jest
        .spyOn(usersService, "findOne")
        .mockResolvedValueOnce(mockRegularUser);

      await expect(
        authService.signIn("username", "incorrect-password")
      ).rejects.toThrow(UnauthorizedException);
    });

    it("should return access token if user is found and password is correct", async () => {
      jest
        .spyOn(usersService, "findOne")
        .mockResolvedValueOnce(mockRegularUser);
      jest
        .spyOn(jwtService, "signAsync")
        .mockResolvedValueOnce(mockRefreshToken)
        .mockResolvedValueOnce(mockAccessToken);

      const result = await authService.signIn(
        mockRegularUser.username,
        mockRegularUser.password
      );

      expect(result).toEqual({
        refresh_token: mockRefreshToken,
        access_token: mockAccessToken,
        expires_in: jwtConstants.expiresIn,
        user: {
          id: mockRegularUser.id,
          username: mockRegularUser.username,
        },
      });
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: mockRegularUser.id,
        username: mockRegularUser.username,
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
      jest
        .spyOn(usersService, "register")
        .mockResolvedValueOnce(mockRegularUser);

      const registerDto: RegisterDto = {
        username: "username",
        password: "password",
      };
      const response = await authService.register(registerDto);

      expect(response).toEqual(mockRegularUser);
    });
  });

  describe("refreshToken", () => {
    it("should return a new access token when given a valid refresh token", async () => {
      // Arrange
      const token = "validToken";
      const payload = { id: 1, username: "testuser" };

      jest.spyOn(jwtService, "verifyAsync").mockResolvedValueOnce(payload);
      jest
        .spyOn(jwtService, "signAsync")
        .mockReturnValueOnce(Promise.resolve(mockAccessToken));

      // Act
      const result = await authService.refreshToken(token);

      // Assert
      expect(result).toEqual({ access_token: mockAccessToken });
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

  describe("oauthSignIn", () => {
    it("should create a new user if one does not exist", async () => {
      // Arrange
      jest
        .spyOn(usersService, "findOneByProviderId")
        .mockResolvedValueOnce(undefined);
      const createOAuthUserSpy = jest
        .spyOn(usersService, "createOAuthUser")
        .mockResolvedValueOnce(mockOAuthUser);

      // Act
      await authService.oauthSignIn(mockOAuthData);

      // Assert
      expect(createOAuthUserSpy).toHaveBeenCalledWith(mockOAuthData);
    });

    it("should not create a new user if one already exists", async () => {
      // Arrange
      jest
        .spyOn(usersService, "findOneByProviderId")
        .mockResolvedValueOnce(mockOAuthUser);

      // Act
      await authService.oauthSignIn(mockOAuthData);

      // Assert
      expect(usersService.createOAuthUser).not.toHaveBeenCalled();
    });

    it("should create a new refresh token and store it for the user", async () => {
      // Arrange
      jest
        .spyOn(usersService, "findOneByProviderId")
        .mockResolvedValueOnce(undefined);
      jest
        .spyOn(usersService, "createOAuthUser")
        .mockResolvedValueOnce(mockOAuthUser);
      const storeRefreshTokenSpy = jest.spyOn(
        usersService,
        "storeRefreshToken"
      );
      jest
        .spyOn(jwtService, "signAsync")
        .mockResolvedValueOnce(mockRefreshToken);

      // Act
      await authService.oauthSignIn(mockOAuthData);

      // Assert
      expect(storeRefreshTokenSpy).toHaveBeenCalledWith(
        mockOAuthData.refreshToken,
        mockOAuthUser.id
      );
    });

    it("should return the access token, refresh token, and user information", async () => {
      // Arrange
      jest
        .spyOn(usersService, "findOneByProviderId")
        .mockResolvedValueOnce(undefined);
      jest
        .spyOn(usersService, "createOAuthUser")
        .mockResolvedValueOnce(mockOAuthUser);
      jest
        .spyOn(jwtService, "signAsync")
        .mockResolvedValueOnce(mockRefreshToken)
        .mockResolvedValueOnce(mockAccessToken);

      // Act
      const result = await authService.oauthSignIn(mockOAuthData);

      // Assert
      expect(result).toEqual({
        access_token: mockAccessToken,
        refresh_token: mockOAuthData.refreshToken,
        expires_in: jwtConstants.expiresIn,
        user: {
          name: mockOAuthUser.username,
          id: mockOAuthUser.id,
          image: mockOAuthUser.image,
          email: mockOAuthUser.email,
        },
      });
    });
  });
});
