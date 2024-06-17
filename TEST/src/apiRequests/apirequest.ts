import axios from "axios";

export const apiRequest = axios.create({
	baseURL: "http://localhost:3500",
	// baseURL: "https://grearnapi.vercel.app",
	withCredentials: true,
});

export const User = async (isMounted: boolean, data: any, controller: any, auth: any, req: string) => {
	try {
		if (req === "get") {
			const response = await apiRequest.get("/users", {
				signal: controller.signal,
			});

			const matchingUser = response.data.find((user: any) => user._id === auth.id);
			if (matchingUser) isMounted && data([matchingUser]);
		}
		if (req === "patch") {
			const response = await apiRequest.patch("/users", {
				signal: controller.signal,
				data,
			});
			return response;
		}
		if (req === "post") {
			const response = await apiRequest.post("/users", {
				signal: controller.signal,
				data,
			});
			return response;
		}
		if (req === "delete") {
			const response = await apiRequest.delete("/users", {
				signal: controller.signal,
				data,
			});
			return response;
		}
	} catch (err) {
		console.error(err);
	}
};

export const Notification = async (isMounted: boolean, data: any, controller: any, auth: any, req: string) => {
	try {
		if (req === "get") {
			const response = await apiRequest.get("/notification", {
				signal: controller.signal,
			});

			const matchingUser = response.data.find((user: any) => user._id === auth.id);
			if (matchingUser) isMounted && data([matchingUser]);
		}
		if (req === "patch") {
			const response = await apiRequest.patch("/notification", {
				signal: controller.signal,
				data,
			});
			return response;
		}
		if (req === "post") {
			const response = await apiRequest.post("/notification", {
				signal: controller.signal,
				data,
			});
			console.log(data);
			return response;
		}
		if (req === "delete") {
			const response = await apiRequest.delete("/notification", {
				signal: controller.signal,
				data,
			});
			return response;
		}
	} catch (err) {
		console.error(err);
	}
};

// Make Users Requests to the API
export const getAllUsers = async (isMounted: boolean, data: any, controller: any) => {
	try {
		const response = await apiRequest.get("/users", {
			signal: controller.signal,
		});
		isMounted && data(response.data);
	} catch (err) {
		console.error(err);
	}
};
