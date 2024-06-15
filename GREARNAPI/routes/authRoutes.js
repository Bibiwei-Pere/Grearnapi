import express from "express";
const router = express.Router();
import { signin, refresh, logout, signup } from "../controllers/authController.js";
import loginLimiter from "../middleware/loginLimiter.js";

router.route("/signup").post(signup);

router.route("/signin").post(loginLimiter, signin);

router.route("/logout").post(logout);

router.route("/refresh").get(refresh);

export default router;
