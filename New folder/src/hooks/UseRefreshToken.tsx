import { apiRequest } from "../apiRequests/apirequest";
import UseAuth from "./UseAuth";

const UseRefreshToken = () => {
	const { setAuth }: any = UseAuth();

	const refresh = async () => {
		const response = await apiRequest.get("/auth/refresh");
		setAuth((prev: any) => {
			return { ...prev, accessToken: response.data.accessToken };
		});
		return response.data.accessToken;
	};
	return refresh;
};

export default UseRefreshToken;
