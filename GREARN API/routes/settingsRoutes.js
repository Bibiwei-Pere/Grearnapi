import express from "express";
const router = express.Router();
import * as settingsController from "../controllers/settingsController.js";
import verifyJWT from "../middleware/verifyJWT.js";

router.use(verifyJWT);

router.route("/").get(settingsController.getAllSettings).patch(settingsController.updateSetting).delete(settingsController.deleteSetting);

export default router;
