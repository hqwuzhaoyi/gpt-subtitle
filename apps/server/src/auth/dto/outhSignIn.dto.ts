export class OAuthSignInDto {
  user: {
    id: string;
    name: string;
    email: string;
    image: string;
  };
  account: {
    provider: string;
    type: string;
    providerAccountId: string;
    access_token: string;
    token_type: string;
    scope: string;
  };
}
