import express from "express";
const router = express.Router();
import * as usersControllers from "../controllers/usersControllers.js";
import verifyJWT from "../middleware/verifyJWT.js";

router.use(verifyJWT);

router.route("/").get(usersControllers.getAllUsers).post(usersControllers.postUser).patch(usersControllers.updateUser);

router.route("/:userId").get(usersControllers.getUser);
router.route("/:userId").delete(usersControllers.deleteUser);

export default router;
