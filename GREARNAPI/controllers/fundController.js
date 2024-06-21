import { createNewTransaction, updateTransaction } from "./transactionController.js";
import { generateRandomCode } from "../config/helpers.js";

const refund = false;

export const payWithFlutterwave = async (req, res) => {
	console.log(req.body);

	const id = await createNewTransaction(req, res);
	return id;
};

// import got from "got";

// const { FLUTTER_WAVE_URL, FLW_SECRET_KEY, FRONTEND_URL } = process.env;

// export const payWithFlutterwave = async (req, res) => {
// 	const { firstname, lastname, amount, email, phone } = req.body;
// 	const tx_ref = await generateRandomCode();

// 	const response = await got
// 		.post(FLUTTER_WAVE_URL, {
// 			headers: {
// 				Authorization: `Bearer ${FLW_SECRET_KEY}`,
// 			},
// 			json: {
// 				tx_ref: tx_ref,
// 				amount: amount,
// 				currency: "NGN",
// 				redirect_url: FRONTEND_URL,
// 				customer: {
// 					email: email,
// 					phonenumber: phone,
// 					name: firstname + " " + lastname,
// 				},
// 			},
// 		})
// 		.json();
// 	return response;
// };
