import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "./users.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { RegularUser, OAuthUser } from "./users.entity";
import { Repository } from "typeorm";
import { RefreshToken } from "./refresh-token.entity";

describe("UsersService", () => {
  let service: UsersService;
  let regularUserRepository: Repository<RegularUser>;
  let oauthUserRepository: Repository<OAuthUser>;
  let refreshTokenRepository: Repository<RefreshToken>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(RegularUser), // Replace 'VideoFileEntity' with your actual entity name
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          }, // Mock the repository methods you need
        },
        {
          provide: getRepositoryToken(OAuthUser), // Replace 'VideoFileEntity' with your actual entity name
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          }, // Mock the repository methods you need
        },
        {
          provide: getRepositoryToken(RefreshToken), // Replace 'VideoFileEntity' with your actual entity name
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
          }, // Mock the repository methods you need
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    regularUserRepository = module.get<Repository<RegularUser>>(
      getRepositoryToken(RegularUser)
    );
    oauthUserRepository = module.get<Repository<OAuthUser>>(
      getRepositoryToken(OAuthUser)
    );
    refreshTokenRepository = module.get<Repository<RefreshToken>>(
      getRepositoryToken(RefreshToken)
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("findOne", () => {
    it("should return a user when given a valid username", async () => {
      const mockUser = new RegularUser();
      mockUser.username = "testuser";
      mockUser.password = "testpassword";

      jest
        .spyOn(regularUserRepository, "findOne")
        .mockResolvedValueOnce(mockUser);

      const result = await service.findOne("testuser");

      expect(result).toEqual(mockUser);
      expect(regularUserRepository.findOne).toHaveBeenCalledWith({
        where: { username: "testuser" },
      });
    });

    it("should return undefined when given an invalid username", async () => {
      jest
        .spyOn(regularUserRepository, "findOne")
        .mockResolvedValueOnce(undefined);

      const result = await service.findOne("invaliduser");

      expect(result).toBeUndefined();
      expect(regularUserRepository.findOne).toHaveBeenCalledWith({
        where: { username: "invaliduser" },
      });
    });
  });

  describe("register", () => {
    it("should create a new user with the given username and password", async () => {
      const mockUser = new RegularUser();
      mockUser.username = "testuser";
      mockUser.password = "testpassword";

      jest.spyOn(regularUserRepository, "save").mockResolvedValueOnce(mockUser);

      const result = await service.register("testuser", "testpassword");

      expect(result).toEqual(mockUser);
      expect(regularUserRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          username: "testuser",
          password: "testpassword",
        })
      );
    });
  });

  describe("storeRefreshToken", () => {
    it("should create a new refresh token with the given token and user id", async () => {
      const mockRefreshToken = new RefreshToken();
      mockRefreshToken.token = "test_refresh_token";
      mockRefreshToken.user = new RegularUser();
      mockRefreshToken.user.id = 1;

      const findOneSpy = jest.spyOn(regularUserRepository, "findOne");
      findOneSpy.mockResolvedValueOnce(mockRefreshToken.user);

      const saveSpy = jest.spyOn(refreshTokenRepository, "save");
      saveSpy.mockResolvedValueOnce(mockRefreshToken);

      await service.storeRefreshToken("test_refresh_token", 1);

      expect(findOneSpy).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          token: "test_refresh_token",
          user: mockRefreshToken.user,
        })
      );
      expect(refreshTokenRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          token: "test_refresh_token",
          user: mockRefreshToken.user,
        })
      );
    });
  });

  describe("verifyRefreshToken", () => {
    it("should return true when given a valid refresh token", async () => {
      const mockRefreshToken = new RefreshToken();
      mockRefreshToken.token = "test_refresh_token";
      mockRefreshToken.user = new RegularUser();
      mockRefreshToken.user.id = 1;

      jest
        .spyOn(refreshTokenRepository, "findOne")
        .mockResolvedValueOnce(mockRefreshToken);

      const result = await service.verifyRefreshToken("test_refresh_token", 1);

      expect(result).toBe(true);
      expect(refreshTokenRepository.findOne).toHaveBeenCalledWith({
        where: { token: "test_refresh_token", user: { id: 1 } },
      });
    });

    it("should return false when given an invalid refresh token", async () => {
      jest
        .spyOn(refreshTokenRepository, "findOne")
        .mockResolvedValueOnce(undefined);

      const result = await service.verifyRefreshToken(
        "invalid_refresh_token",
        1
      );

      expect(result).toBe(false);
      expect(refreshTokenRepository.findOne).toHaveBeenCalledWith({
        where: { token: "invalid_refresh_token", user: { id: 1 } },
      });
    });
  });

  describe("revokeRefreshToken", () => {
    it("should delete the refresh token with the given token", async () => {
      const deleteSpy = jest.spyOn(refreshTokenRepository, "delete");

      await service.revokeRefreshToken("test_refresh_token");

      expect(deleteSpy).toHaveBeenCalledWith({
        token: "test_refresh_token",
      });
    });
  });

  describe("findOneByProviderId", () => {
    it("should return a user when given a valid provider id", async () => {
      const mockUser = new OAuthUser();
      mockUser.providerId = "test_provider_id";

      jest
        .spyOn(oauthUserRepository, "findOne")
        .mockResolvedValueOnce(mockUser);

      const result = await service.findOneByProviderId("test_provider_id");

      expect(result).toEqual(mockUser);
      expect(oauthUserRepository.findOne).toHaveBeenCalledWith({
        where: { providerId: "test_provider_id" },
      });
    });

    it("should return undefined when given an invalid provider id", async () => {
      jest
        .spyOn(oauthUserRepository, "findOne")
        .mockResolvedValueOnce(undefined);

      const result = await service.findOneByProviderId("invalid_provider_id");

      expect(result).toBeUndefined();
      expect(oauthUserRepository.findOne).toHaveBeenCalledWith({
        where: { providerId: "invalid_provider_id" },
      });
    });
  });

  describe("createOAuthUser", () => {
    it("should create a new oauth user with the given oauth data", async () => {
      const mockOAuthUser = new OAuthUser();
      mockOAuthUser.username = "testuser";
      mockOAuthUser.email = "test_email";
      mockOAuthUser.image = "test_image";
      mockOAuthUser.providerId = "test_provider_id";
      mockOAuthUser.provider = "test_provider";

      jest
        .spyOn(oauthUserRepository, "save")
        .mockResolvedValueOnce(mockOAuthUser);

      const result = await service.createOAuthUser({
        user: {
          id: "test_provider_id",
          name: "testuser",
          email: "test_email",
          image: "test_image",
        },
        account: {
          provider: "test_provider",
          type: "test_type",
          providerAccountId: "test_provider_id",
          access_token: "test_access_token",
          token_type: "test_token_type",
          scope: "test_scope",
        },
      });

      expect(result).toEqual(mockOAuthUser);
      expect(oauthUserRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          username: "testuser",
          email: "test_email",
          image: "test_image",
          providerId: "test_provider_id",
          provider: "test_provider",
        })
      );
    });
  });
});
