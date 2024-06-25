import express from "express";
const router = express.Router();
import verifyJWT from "../middleware/verifyJWT.js";
import { createNewInvestment, deleteInvestment, getAllInvestment, updateInvestment } from "../controllers/investmentController.js";
router.use(verifyJWT);

router.route("/").get(getAllInvestment).post(createNewInvestment).patch(updateInvestment).delete(deleteInvestment);

export default router;
