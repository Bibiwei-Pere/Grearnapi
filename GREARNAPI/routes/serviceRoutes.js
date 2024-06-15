import express from "express";
import { createAirtimeOrder, createDataOrder, verifyCableOrder, createCableOrder } from "../controllers/serviceController.js";
const router = express.Router();

router.post("/buyAirtime", async (req, res) => {
	try {
		const order = await createAirtimeOrder(req, res);
		console.log("Order", order);
		res.json(order);
	} catch (error) {
		console.log("Failed to create order", error);
		res.status(400).send(error.message);
	}
});

router.post("/buyData", async (req, res) => {
	try {
		const order = await createDataOrder(req, res);
		console.log(order);
		res.json(order);
	} catch (error) {
		console.log("Failed to create order", error);
		res.status(400).send(error.message);
	}
});

router.post("/verifyCable", async (req, res) => {
	try {
		const order = await verifyCableOrder(req, res);
		res.json(order);
	} catch (error) {
		console.log("Failed to create order", error);
		res.status(400).send(error.message);
	}
});

export default router;
