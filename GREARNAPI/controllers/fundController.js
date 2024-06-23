import axios from "axios";
const { FLUTTER_WAVE_URL, FLW_SECRET_KEY } = process.env;

export const getBanks = async (req, res) => {
	try {
		const options = {
			method: "GET",
			url: `${FLUTTER_WAVE_URL}/banks/NG`,
			headers: {
				Authorization: `Bearer ${FLW_SECRET_KEY}`,
				"Content-Type": "application/json",
			},
		};

		const response = await axios(options);
		return response.data;
	} catch (error) {
		console.log("Failed to get banks", error);
	}
};
