import express from "express";
import { createNewTransaction, updateTransaction } from "../controllers/transactionController.js";
const router = express.Router();
import Flutterwave from "flutterwave-node-v3";
import { generateRandomCode } from "../config/helpers.js";
import { getBanks } from "../controllers/fundController.js";

router.post("/deposit", async (req, res) => {
	try {
		const { OrderID } = await createNewTransaction(req, res);
		res.status(200).json({ orderID: OrderID });
	} catch (error) {
		console.log("Failed to create order", error);
		res.status(400).send(error.message);
	}
});

router.patch("/deposit", async (req, res) => {
	try {
		const response = await updateTransaction(req, res);
		res.status(200).json(response);
	} catch (error) {
		console.log("Failed to create order", error);
		res.status(400).send(error.message);
	}
});

router.post("/withdraw", async (req, res) => {
	const { account_bank, account_number, amount } = req.body.data;

	try {
		const ref = await generateRandomCode();
		const { orderID } = await createNewTransaction(req, res); // Capture the returned object
		req.body.data.OrderID = orderID;

		const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY);
		const details = {
			account_bank: account_bank,
			account_number: account_number,
			amount: amount,
			currency: "NGN",
			narration: "Withdrawal from Balance",
			reference: ref,
		};
		const response = await flw.Transfer.initiate(details);
		console.log(response);

		if (response.status === "success") {
			const message = await updateTransaction(req, res);
			return res.status(200).json(message); // Ensure to return after sending a response
		} else {
			return res.status(201).json(response); // Ensure to return after sending a response
		}
	} catch (error) {
		// console.error("Error during withdrawal:", error.message);
		res.status(203).json({ error: error.message || "An unexpected error occurred" });
	}
});

router.get("/banks", async (req, res) => {
	try {
		const banks = await getBanks(req, res);
		res.json(banks);
	} catch (error) {
		console.log(error);
	}
});

export default router;
