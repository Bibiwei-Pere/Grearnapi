"use server";
import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";

export const login = async (values: { email: string; password: number }) => {
  const { email, password } = values;
  try {
    await signIn("credentials", {
      email,
      password,
      //   redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    console.log(error);
    if (error instanceof AuthError) {
      const errorMessage = error.message || "Something went wrong";
      return { error: errorMessage };
    }

    return { error: "An unexpected error occurred" }; // Fallback for other errors
  }

  return { success: "Sign success" };
};

export async function doLogout() {
  await signOut({ redirectTo: "/auth/login" });
}
