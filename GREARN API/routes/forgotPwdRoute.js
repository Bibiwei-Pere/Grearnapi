import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";

const router = express.Router();

router.post("/forgot-password", async (req, res) => {
	const { email } = req.body;
	console.log(email);

	User.findOne({ email }).then((user) => {
		if (!user) return res.status(201).json({ message: "Email address not valid" });
		const verificationCode = Math.floor(100000 + Math.random() * 900000);
		const token = jwt.sign({ id: user._id, code: verificationCode }, "jwt_secret_key", { expiresIn: "1d" });

		console.log(verificationCode);
		const transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: "subscribed.contact@gmail.com",
				pass: "jakyfndhldwrprxk",
			},
		});
		const mailOptions = {
			from: "subscribed.contact@gmail.com",
			to: email,
			subject: "Reset your password",
			html: `<p>Use the code below to reset your password:</p></br><h2>${verificationCode}</h2></br><p>Expires in 15 minutes</p>`,
		};

		transporter.sendMail(mailOptions, function (error) {
			if (error) console.log(error);
			else return res.status(200).json({ token, id: user._id });
		});
	});
});

router.post("/reset-password/:id/:token", async (req, res) => {
	const { id, token } = req.params;
	const { code, password, cpassword } = req.body;
	console.log(req.body);
	if (password !== cpassword) return res.status(201).json({ message: "Passwords do not match" });
	if (!code) return res.status(201).json({ message: "Enter verification code" });

	console.log("Reset Link clicked");
	const hashedPwd = await bcrypt.hash(password, 10);
	console.log(hashedPwd);
	jwt.verify(token, "jwt_secret_key", (err, decoded) => {
		if (err || decoded.id !== id || decoded.code !== Number(code)) {
			return res.status(201).json({ message: "Invalid verification code" + err });
		} else {
			User.findByIdAndUpdate({ _id: id }, { password: hashedPwd })
				.then((u) => res.status(200).json({ message: "Password reset successful!" }))
				.catch((err) => res.status(201).json({ message: "Error resetting password" }));
		}
	});
});

export default router;
