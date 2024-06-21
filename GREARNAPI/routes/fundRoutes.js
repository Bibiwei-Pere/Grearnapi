import express from "express";
import { createNewTransaction, updateTransaction } from "../controllers/transactionController.js";
const router = express.Router();

router.post("/flutterwave", async (req, res) => {
	try {
		const OrderID = await createNewTransaction(req, res);
		console.log("Order", OrderID);
		res.status(200).json(OrderID);
	} catch (error) {
		console.log("Failed to create order", error);
		res.status(400).send(error.message);
	}
});

router.patch("/flutterwave", async (req, res) => {
	try {
		const response = await updateTransaction(req, res);
		console.log("Order", response);
		res.status(200).json(response);
	} catch (error) {
		console.log("Failed to create order", error);
		res.status(400).send(error.message);
	}
});

export default router;
