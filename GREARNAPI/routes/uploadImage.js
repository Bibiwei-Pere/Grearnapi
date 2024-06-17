import express from "express";
const router = express.Router();
import { v2 as cloudinary } from "cloudinary";
import Multer from "multer";

cloudinary.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.API_KEY,
	api_secret: process.env.API_SECRET,
});

const handleUpload = async (file) => {
	const res = await cloudinary.uploader.upload(file, {
		resource_type: "auto",
	});
	return res;
};

const storage = new Multer.memoryStorage();
const upload = Multer({
	storage,
});

const uploadImage = async (req, res) => {
	try {
		const b64 = Buffer.from(req.file.buffer).toString("base64");
		let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
		const cldRes = await handleUpload(dataURI);
		console.log(cldRes);
		res.json(cldRes);
	} catch (error) {
		console.log(error);
		res.send({
			message: error.message,
		});
	}
};

router.route("/").post(upload.single("my_file"), uploadImage);

export default router;
