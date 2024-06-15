import { createNewTransaction, updateTransaction } from "./transactionController.js";
import { generateRandomCode } from "../config/helpers.js";
import got from "got";

const { FLUTTER_WAVE_URL, FLW_SECRET_KEY, FRONTEND_URL } = process.env;

export const payWithFlutterwave = async (req, res) => {
	const { firstname, lastname, amount, email, phone } = req.body;
	const tx_ref = await generateRandomCode();

	const response = await got
		.post(FLUTTER_WAVE_URL, {
			headers: {
				Authorization: `Bearer ${FLW_SECRET_KEY}`,
			},
			json: {
				tx_ref: tx_ref,
				amount: amount,
				currency: "NGN",
				redirect_url: FRONTEND_URL,
				customer: {
					email: email,
					phonenumber: phone,
					name: firstname + " " + lastname,
				},
			},
		})
		.json();
	return response;
};

// const refund = false;

// export const payWithFlutterwav = async (req, res) => {
// 	const response = await got;
// 	const { amount, number, email, phone, name } = req.body;
// 	const tx_ref = await generateRandomCode();

// 	const options = {
// 		method: "POST",
// 		url: FLUTTER_WAVE_URL,
// 		headers: {
// 			Accept: "application/json",
// 			Authorization: `Bearer ${FLW_SECRET_KEY}`,
// 		},
// 		json: {
// 			redirect_url: FRONTEND_URL,

// 			customer: {
// 				email: email,
// 				phonenumber: phone,
// 				name: name,
// 			},
// 		},
// 	};

// 	const id = await createNewTransaction(req, res);
// 	const dataRes = await new Promise((resolve, reject) => {
// 		request(options, function (error, response) {
// 			const body = JSON.parse(response.body);
// 			if (error) reject(error);
// 			else resolve(body);
// 		});
// 	});
// 	console.log(dataRes);
// 	// if (dataRes.status === "ORDER_COMPLETED" || dataRes.statuscode === "200") await updateTransaction(id, refund, req, res);

// 	return dataRes;
// };
