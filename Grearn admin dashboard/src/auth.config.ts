import { loginSchema } from "@/app/components/schema/Forms";
import axiosInstance from "@/lib/axios-instance";
import { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export default {
  secret: process.env.AUTH_SECRET,
  pages: { signIn: "/auth/login" },

  providers: [
    // Apple({
    //   clientId: process.env.AUTH_APPLE_ID,
    //   clientSecret: process.env.AUTH_APPLE_SECRET!,
    // }),
    // Facebook({
    //   clientId: process.env.AUTH_FACEBOOK_ID,
    //   clientSecret: process.env.AUTH_FACEBOOK_SECRET!,
    // }),
    // Google({
    //   clientId: process.env.AUTH_GOOGLE_ID,
    //   clientSecret: process.env.AUTH_GOOGLE_SECRET,
    // }),

    Credentials({
      async authorize(credentials) {
        const validatedFields = loginSchema.safeParse(credentials);
        if (validatedFields.success) {
          const { email, password } = validatedFields.data;
          try {
            const response = await axiosInstance.post("/auth/signin", {
              email,
              password,
            });
            const user = response.data;
            console.log(response);
            user.accessToken = response.data.accessToken;
            user.refreshToken = response.data.accessToken;
            console.log(user);
            if (user) return user;
          } catch (error) {
            console.log("Error Login", error);
          }
        }
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
