import GitHubProvider from "next-auth/providers/github";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions as NextAuthConfig } from "next-auth";
import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";

const backendURL = process.env.API_URL;

async function refreshAccessToken(token: string) {
  const resp = await fetch(backendURL + "/auth/refreshToken", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token }),
  });
  return await resp.json();
  // TODO: 失败处理
}

async function oauthSignIn({ user, account }: any) {
  const resp = await fetch(backendURL + "/auth/oauthSignIn", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user, account }),
  });
  return await resp.json();
  // TODO: 失败处理
}

const githubProvider =
  process.env.GITHUB_CLIENT_ID &&
  process.env.GITHUB_CLIENT_SECRET &&
  GitHubProvider({
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  });

export const authOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.AUTH_SECRET,
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {
        username: {
          label: "User Name",
          type: "username",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.debug("credentials: " + JSON.stringify(credentials));
        const credentialDetails = {
          username: credentials?.username,
          password: credentials?.password,
        };

        if (!credentialDetails.username || !credentialDetails.password) {
          return;
        }

        // TODO: return user object
        const resp = await fetch(backendURL + "/auth/login", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentialDetails),
        });
        const data = await resp.json();
        console.debug("user data: " + JSON.stringify(data));
        if (data.access_token) {
          return {
            ...data,
            user: {
              ...data.user,
              name: data.user.username,
            },
          };
        } else {
          console.log("check your credentials");
          return null;
        }
      },
    }),
    githubProvider,
  ].filter(Boolean) as NextAuthConfig["providers"],

  callbacks: {
    jwt: async ({ token, user, account, profile }) => {
      // if (user) {
      //   token.email = user.data.auth.email;
      //   token.username = user.data.auth.userName;
      //   token.user_type = user.data.auth.userType;
      //   token.accessToken = user.data.auth.token;
      // }
      console.debug("jwt token: " + JSON.stringify(token));
      console.debug("jwt user: " + JSON.stringify(user));
      console.debug("jwt account: " + JSON.stringify(account));
      console.debug("jwt profile: " + JSON.stringify(profile));

      if (account && user) {
        if (account?.type === "credentials") {
          return {
            ...token,
            ...user,
            accessToken: user.access_token,
            accessTokenExpires:
              user.expires_in && Date.now() + user.expires_in * 1000,
            refreshToken: user.refresh_token,
          };
        } else if (account?.type === "oauth") {
          const data = await oauthSignIn({ user, account });
          // TODO: Oauth 登录
          return {
            ...token,
            ...data,
            accessToken: data.access_token,
            accessTokenExpires:
              data.expires_in &&
              Date.now() + (data.expires_in as number) * 1000,
            refreshToken: data.refresh_token,
          };
        } else {
          return {
            ...token,
            accessToken: account.access_token,
            accessTokenExpires:
              account.expires_in &&
              Date.now() + (account.expires_in as number) * 1000,
            refreshToken: account.refresh_token,
          };
        }
      }

      // on subsequent calls, token is provided and we need to check if it's expired
      // if (token?.accessTokenExpires) {
      //   if (Date.now() / 1000 < token?.accessTokenExpires) {
      //     if (user) {
      //       return { ...token, ...user };
      //     } else {
      //       return { ...token };
      //     }
      //   }
      // } else if (token?.refreshToken) {
      //   const data = await refreshAccessToken(token.refreshToken);
      //   console.debug("refreshAccessToken data: " + JSON.stringify(data));

      //   if (data.access_token) {
      //     const user = { ...data.user, name: data.user.username };
      //     const account = {
      //       access_token: data.access_token,
      //       refresh_token: data.refresh_token,
      //       expires_in: data.expires_in,
      //     };

      //     return {
      //       ...token,
      //       ...user,
      //       accessToken: account.access_token,
      //       accessTokenExpires: Date.now() + account.expires_in * 1000,
      //       refreshToken: account.refresh_token,
      //     };
      //   } else {
      //     return {
      //       ...token,
      //       error:
      //         "Refresh token has expired. Please log in again to get a new refresh token.",
      //     };
      //   }
      // }

      return { ...token, ...user };
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      console.debug("session session: " + JSON.stringify(session));
      if (token) {
        if (token.user) session.user = token.user;
        if (token.accessToken) session.accessToken = token.accessToken;
        if (token.error) session.error = token.error;
      }

      return session;
    },
  },
  pages: {
    signIn: "/login",
    // signOut: "/login",
  },
} satisfies NextAuthConfig;

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
