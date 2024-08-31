import express from "express";
const router = express.Router();
import { v2 as cloudinary } from "cloudinary";
import Multer from "multer";

// const storage = multer.diskStorage({});
const storage = new Multer.diskStorage({});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) cb(null, true);
  else cb('invalid image file!', false);
};
const uploads = Multer({ storage, fileFilter });

cloudinary.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.API_KEY,
	api_secret: process.env.API_SECRET,
});

const handleUpload = async (req, res) => {
	
		try {
		const res = await cloudinary.uploader.upload(req.file.path, {
		  width: 500,
      height: 500,
      crop: 'fill',
	});
		res.status(200).json({ success: true, message: 'Your image has updated!' });
	} catch (error) {
		console.log(error);
		res.send({
			message: error.message,
		});
	}
};

// const storage = new Multer.memoryStorage();
//const upload = Multer({
//	storage,
//});

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

router.route("/").post(uploads.single("my_file"), handleUpload);

export default router;
