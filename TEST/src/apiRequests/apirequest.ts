import axios from "axios";

export const apiRequest = axios.create({
	// baseURL: "http://localhost:3500",
	baseURL: "https://grearnapi.vercel.app",
	withCredentials: true,
});

export const getAllUsers = async (isMounted: boolean, setUsers: any, controller: any) => {
	try {
		const response = await apiRequest.get("/users", {
			signal: controller.signal,
		});
		isMounted && setUsers(response.data);
	} catch (err) {
		console.error(err);
	}
};

export const getUser = async (isMounted: boolean, setUsers: any, controller: any, auth: any) => {
	try {
		const response = await apiRequest.get("/users", {
			signal: controller.signal,
		});

		const matchingUser = response.data.find((user: any) => user.email === auth.email);
		if (matchingUser) isMounted && setUsers([matchingUser]);
	} catch (err) {
		console.error(err);
	}
};
