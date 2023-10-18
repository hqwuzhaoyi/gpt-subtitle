import { Session as NextAuthSession } from "next-auth";

declare module "next-auth/react" {
  interface Session extends NextAuthSession {
    refreshTokenExpires?: number;
    accessTokenExpires?: string;
    refreshToken?: string;
    token?: string;
    error?: string;
    user?: User;
    accessToken?: string;
  }
}

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as
   * a prop on the `SessionProvider` React Context
   */

  interface Session extends NextAuthSession {
    refreshTokenExpires?: number;
    accessTokenExpires?: string;
    refreshToken?: string;
    token?: string;
    error?: string;
    user?: User;
    accessToken?: string;
  }

  interface User {
    name: string;
    email?: string | null;
    id: string;
    access_token?: string;
    expires_in?: number;
    refresh_token?: string;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    refreshTokenExpires?: number;
    accessTokenExpires?: number;
    refreshToken?: string;
    token: string;
    exp?: number;
    iat?: number;
    jti?: string;
    user?: User;
    accessToken?: string;
    error?: string;
  }
}
