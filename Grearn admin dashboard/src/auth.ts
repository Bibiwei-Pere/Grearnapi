import NextAuth, { type DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";
import authConfig from "./auth.config";
import axiosInstance from "./lib/axios-instance";

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    refreshToken: string;
    roles: string[];
    accessTokenExpires: number;
    error?: string;
  }
}

declare module "next-auth" {
  interface User {
    accessToken: string;
    refreshToken: string;
    roles: string[];
  }
  interface Session {
    accessToken: string;
    refreshToken: string;
    error?: string;
    stripeSecret?: string | null | undefined;
    stripeConnectId?: string | null;
    user: { roles: string[] } & DefaultSession["user"];
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  callbacks: {
    async session({ token, session }) {
      console.log("first");

      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.roles && session.user) {
        session.user.roles = token.roles;
      }
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.error = token.error;

      return session;
    },
    async jwt({ token, user }) {
      if (!token.sub) return token;
      console.log(token);
      console.log(user);
      if (user) {
        token.roles = user.roles;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.accessTokenExpires = Date.now() + 3600 * 100000; // 1 hour
      }

      token.error = token.error;
      /**
       * Return previous token if the access token has not expired yet
       */
      if (Date.now() < token.accessTokenExpires) {
        return token;
      }
      /**
       * Access token has expired, try to update it
       */
      return refreshAccessToken(token);
    },
  },
  session: { strategy: "jwt" },
  ...authConfig,
});

async function refreshAccessToken(token: JWT) {
  try {
    const response = await axiosInstance.post(
      `/auth/refresh-token/${token.refreshToken}`
    );

    const refreshedTokens = response.data.data;

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires:
        Date.now() + parseInt(refreshedTokens.expires_in) * 1000, // 1 hour
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.error("Failed to refresh access token", error);

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}
