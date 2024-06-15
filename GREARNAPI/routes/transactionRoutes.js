import express from "express";
const router = express.Router();
import { getAllTransaction, createNewTransaction, updateTransaction, deleteTransaction } from "../controllers/transactionController.js";
import verifyJWT from "../middleware/verifyJWT.js";
router.use(verifyJWT);

router.route("/")
	.get(getAllTransaction)
	.post(createNewTransaction)
	.patch(async (req, res) => {
		try {
			const id = req.body.id,
				refund = req.body.refund;
			const transaction = await updateTransaction(id, refund, req, res);
			res.json(transaction);
		} catch (error) {
			console.log("Failed to create order", error);
			res.status(400).send(error.message);
		}
	})
	.delete(deleteTransaction);

export default router;
