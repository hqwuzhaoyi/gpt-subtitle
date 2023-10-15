import { SessionStrategy } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions as NextAuthConfig } from "next-auth";
import { Session } from "next-auth";
import { User } from "next-auth";
interface CustomSession extends Session {
  accessToken?: string;
}

const backendURL = process.env.API_URL;
export const authOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
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
        const user = await resp.json();
        console.debug("user: " + JSON.stringify(user));
        if (user.access_token) {
          console.log("nextauth daki user: " + user.access_token);
          user.asd = "111";
          return user;
        } else {
          console.log("check your credentials");
          return null;
        }
      },
    }),
  ],

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

      return token;
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      (session as CustomSession).accessToken = token.accessToken as string;
      console.debug("session session: " + JSON.stringify(session));
      return session;
    },
    // async session({ session, token, user }) {
    //   // session.accessToken = token.accessToken;
    //   // session.idToken = token.idToken;
    //   console.debug("session session: " + JSON.stringify(session));
    //   console.debug("session token: " + JSON.stringify(token));
    //   console.debug("session user: " + JSON.stringify(user));
    //   return { session };
    // },
    // async jwt({ token, account, user }) {
    //   console.debug("jwt token: " + JSON.stringify(token));
    //   console.debug("jwt account: " + JSON.stringify(account));
    //   console.debug("jwt user: " + JSON.stringify(user));
    //   if (account) {
    //     token.accessToken = account.access_token;
    //     token.idToken = account.id_token;
    //   }
    //   return token;
    // },
  },
  pages: {
    signIn: "/login",
    // signOut: "/login",
  },
} satisfies NextAuthConfig;

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
