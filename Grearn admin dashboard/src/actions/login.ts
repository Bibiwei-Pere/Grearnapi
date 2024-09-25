"use server";
import { signIn, signOut } from "@/auth";

export const login = async (values: { email: string; password: string }) => {
  const { email, password } = values;
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
  } catch (error) {
    console.log(error);
  }
};

export async function doLogout() {
  await signOut({ redirectTo: "/auth/login" });
}
