"use client";
import axiosInstance from "@/lib/axios-instance";
import { useSession } from "next-auth/react";

export const useRefreshToken = () => {
  const { data: session } = useSession();

  const refreshToken = async () => {
    const response = await axiosInstance.get(`/auth/refresh`);
    console.log(response.data);
    const refreshedTokens = response.data.data;

    console.log("am the new accesstoken ", refreshedTokens);
    if (session) session.accessToken = refreshedTokens.access_token;
  };

  return refreshToken;
};
