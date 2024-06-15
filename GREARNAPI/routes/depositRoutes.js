import express from "express";
import { payWithFlutterwave } from "../controllers/depositController.js";
const router = express.Router();

router.post("/flutterwave", async (req, res) => {
	try {
		const order = await payWithFlutterwave(req, res);
		console.log("Order", order);
		res.json(order);
	} catch (error) {
		console.log("Failed to create order", error);
		res.status(400).send(error.message);
	}
});

export default router;
