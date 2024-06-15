import express from "express";
const router = express.Router();
import * as notesController from "../controllers/notesController.js";
import verifyJWT from "../middleware/verifyJWT.js";

router.use(verifyJWT);

router.route("/").get(notesController.getAllNotes).post(notesController.createNewNote).patch(notesController.updateNote).delete(notesController.deleteNote);

export default router;
