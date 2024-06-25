import express from "express";
const router = express.Router();
import { getAllTransaction, createNewTransaction, updateTransaction, deleteTransaction } from "../controllers/transactionController.js";
import verifyJWT from "../middleware/verifyJWT.js";
router.use(verifyJWT);

router.route("/").get(getAllTransaction).post(createNewTransaction).patch(updateTransaction).delete(deleteTransaction);

export default router;
