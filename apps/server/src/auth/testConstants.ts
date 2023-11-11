import { RegularUser, OAuthUser } from "@/users/users.entity";

export const mockRegularUser: RegularUser = {
  id: 1,
  username: "testuser",
  password: "testpassword",
  userType: "RegularUser",
  email: null,
  image: null,
  name: null,
};

export const mockOAuthUser: OAuthUser = {
  id: 1,
  username: "testuser",
  userType: "OAuthUser",
  email: "test_email",
  image: "test_image",
  name: "test_name",
  provider: "test_provider",
  providerId: "test_provider_id",
};

export const mockAccessToken = "test_access_token";
export const mockRefreshToken = "test_refresh_token";

export const mockOAuthData = {
  user: {
    id: "test_id",
    name: "test_name",
    email: "test_email",
    image: "test_image",
  },
  account: {
    provider: "test_provider",
    type: "test_type",
    providerAccountId: "test_provider_account_id",
    access_token: mockAccessToken,
    token_type: "test_token_type",
    scope: "test_scope",
  },
  refreshToken: mockRefreshToken,
};
