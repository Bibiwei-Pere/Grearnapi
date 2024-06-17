import express from "express";
const router = express.Router();
import { getNotification, createNotification, updateNotification, deleteNotification } from "../controllers/notificationController.js";
import verifyJWT from "../middleware/verifyJWT.js";

router.use(verifyJWT);

router.route("/").get(getNotification).post(createNotification).patch(updateNotification).delete(deleteNotification);

export default router;
