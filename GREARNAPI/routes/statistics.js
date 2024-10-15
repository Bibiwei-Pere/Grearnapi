import express from "express";
const router = express.Router();
import verifyJWT from "../middleware/verifyJWT.js";
import { getStatistics } from "../controllers/statistics.js";

router.use(verifyJWT);

router.route("/").get(getStatistics);

export default router;
