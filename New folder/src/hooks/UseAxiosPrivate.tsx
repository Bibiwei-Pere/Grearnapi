import { useEffect } from "react";
import UseAuth from "./UseAuth";
import UseRefreshToken from "./UseRefreshToken";
import { apiRequest } from "../apiRequests/apirequest";

const useAxiosPrivate = () => {
	const refresh = UseRefreshToken();
	const { auth }: any = UseAuth();

	useEffect(() => {
		const requestIntercept = apiRequest.interceptors.request.use(
			(config) => {
				if (!config.headers["Authorization"]) {
					config.headers["Authorization"] = `Bearer ${auth?.accessToken}`;
				}
				return config;
			},
			(error) => Promise.reject(error)
		);

		const responseIntercept = apiRequest.interceptors.response.use(
			(response) => response,
			async (error) => {
				const prevRequest = error?.config;
				if (error?.response?.status === 403 && !prevRequest?.sent) {
					prevRequest.sent = true;
					const newAccessToken = await refresh();
					prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
					return apiRequest(prevRequest);
				}
				return Promise.reject(error);
			}
		);

		return () => {
			apiRequest.interceptors.request.eject(requestIntercept);
			apiRequest.interceptors.response.eject(responseIntercept);
		};
	}, [auth, refresh]);

	return apiRequest;
};

export default useAxiosPrivate;
