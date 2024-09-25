"use client";

import axiosInstance from "@/lib/axios-instance";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRefreshToken } from "./useRefreshToken";

const useAxiosAuth = () => {
  const { data: session } = useSession();
  console.log(session?.accessToken);
  const refreshToken = useRefreshToken();

  // console.log("session access token ", session?.accessToken);

  useEffect(() => {
    const requestIntercept = axiosInstance.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${session?.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error.config;
        if (error.response.status === 401 && !prevRequest.sent) {
          prevRequest.sent = true; // make su  that we run the logic once

          // naw call the refreshToken() from the  returned  useRefreshToken hook

          // await refreshToken();

          // add the new access token to the headers
          prevRequest.handlers[
            "Authorization"
          ] = `Bearer ${session?.accessToken}`;

          return axiosInstance(prevRequest);
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestIntercept);
      axiosInstance.interceptors.response.eject(responseIntercept);
    };
  }, [session, refreshToken]);

  return axiosInstance;
};

export default useAxiosAuth;
