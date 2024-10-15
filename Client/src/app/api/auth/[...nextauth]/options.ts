import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axiosInstance from "@/lib/axios-instance";
import GoogleProvider from "next-auth/providers/google";

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    role: string;
    id: string;
    email: string;
    error?: string;
  }
}

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    accessToken: string;
    role: string;
  }
  interface Session {
    accessToken: string;
    error?: string;
    user: { role: string; id: string; email: string };
  }
}

export const options: NextAuthOptions = {
  pages: {
    signIn: "/auth/login", // Custom sign-in page
  },
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
      // profile callback runs after Google authentication
      profile: async (profile): Promise<any> => {
        console.log("Google Profile:", profile);
        try {
          const response = await axiosInstance.post("/auth/signup", {
            email: profile.email,
            username: profile.name,
            password: "google",
            cpassword: "google",
          });
          console.log(response.data);
          if (response.status === 200) {
            return {
              id: response.data.id, // assuming the backend returns the user id
              email: profile.email,
              name: profile.name,
              accessToken: response.data.accessToken, // Include accessToken from backend response
              role: response.data.role || "user", // Include role from backend response
            };
          }
        } catch (error) {
          console.error("Error creating or updating user:", error);
          return null; // Return null if something goes wrong
        }
      },
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const response = await axiosInstance.post("/auth/login", {
            email: credentials?.email,
            password: credentials?.password,
          });

          const user = response.data;
          if (user) {
            return user;
          }
          return null;
        } catch (error) {
          console.error("Login error:", error);
          return null; // Return null if authentication fails
        }
      },
    }),
  ],

  callbacks: {
    // Update JWT with user info
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken || ""; // Store accessToken
        token.role = user.role || "user"; // Store role
        token.id = user.id || ""; // Store user ID
        token.email = user.email || ""; // Store user ID
      }
      return token;
    },

    // Update session with JWT token data
    async session({ session, token }) {
      session.accessToken = token.accessToken; // Pass accessToken to session
      session.user.role = token.role; // Pass role to session
      session.user.id = token.id; // Pass user ID to session
      session.user.email = token.email; // Pass user EMAIL to session
      return session;
    },
  },
};
