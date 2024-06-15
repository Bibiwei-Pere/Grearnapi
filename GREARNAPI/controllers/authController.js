import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const signup = async (req, res) => {
	const { firstname, lastname, phone, username, email, password, cpassword } = req.body;

	if (!username) return res.status(201).json({ message: "Username field is required" });
	if (!password) return res.status(201).json({ message: "Password field is required" });
	if (!email) return res.status(201).json({ message: "Email field is required" });
	if (password !== cpassword) return res.status(201).json({ message: "Passwords do not match" });

	const duplicateUsername = await User.findOne({ username }).collation({ locale: "en", strength: 2 }).lean().exec();
	if (duplicateUsername) return res.status(201).json({ message: "Duplicate username" });
	const duplicateEmail = await User.findOne({ email }).collation({ locale: "en", strength: 2 }).lean().exec();
	if (duplicateEmail) return res.status(201).json({ message: "Email address already exist!" });

	try {
		const hashedPwd = await bcrypt.hash(password, 10);

		const userObject = { firstname, lastname, phone, username, email, password: hashedPwd };

		const user = await User.create(userObject);

		if (user) return res.status(200).json({ message: `New user ${username} created` });
		else return res.status(201).json({ message: "Invalid user data received" });
	} catch (error) {
		return res.status(400).json({ message: "Internal server error" });
	}
};

export const signin = async (req, res) => {
	const { email, password } = req.body;
	console.log(req.body);
	if (!email || !password) return res.status(201).json({ message: "All fields are required" });

	try {
		// CHECK IF THE USER EXISTS
		const foundUser = await User.findOne({ email }).exec();
		if (!foundUser) return res.status(201).json({ message: "Invalid Email address" });

		// CHECK IF THE PASSWORD IS CORRECT
		const isPasswordValid = await bcrypt.compare(password, foundUser.password);
		if (!isPasswordValid) return res.status(201).json({ message: "Invalid Password" });

		const roles = Object.values(foundUser.roles).filter(Boolean);
		const accessToken = jwt.sign(
			{
				UserInfo: {
					email: foundUser.email,
					roles: roles,
				},
			},
			process.env.ACCESS_TOKEN_SECRET,
			{ expiresIn: "1d" }
		);

		const refreshToken = jwt.sign(
			{
				email: foundUser.email,
			},
			process.env.REFRESH_TOKEN_SECRET,
			{ expiresIn: "7d" }
		);

		// Saving refreshToken with current user
		foundUser.refreshToken = refreshToken;
		const result = await foundUser.save();
		console.log(result);
		console.log(roles);

		// Creates Secure Cookie with refresh token
		res.cookie("jwt", refreshToken, { httpOnly: true, secure: true, sameSite: "None", maxAge: 24 * 60 * 60 * 1000 })
			.status(200)
			.json({ accessToken, roles });

		// res.cookie("jwt", accessToken, {
		// 	httpOnly: true,
		// 	//secure: true,
		// 	maxAge: 7 * 24 * 60 * 60 * 1000,
		// })
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: "Failed to Signin!" });
	}
};

export const logout = (req, res) => {
	const cookies = req.cookies;
	if (!cookies.jwt) return res.status(400).json({ message: "Already Logged out" }); //No content
	res.clearCookie("jwt").status(200).json({ message: "Logout Successful" });
};

export const refresh = async (req, res) => {
	const cookies = req.cookies;
	if (!cookies?.jwt) return res.sendStatus(401);
	const refreshToken = cookies.jwt;

	const foundUser = await User.findOne({ refreshToken }).exec();
	if (!foundUser) return res.sendStatus(403); //Forbidden
	// evaluate jwt
	jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
		if (err || foundUser.email !== decoded.email) return res.sendStatus(403);
		const roles = Object.values(foundUser.roles);
		const accessToken = jwt.sign(
			{
				UserInfo: {
					email: decoded.email,
					roles: roles,
				},
			},
			process.env.ACCESS_TOKEN_SECRET,
			{ expiresIn: "10s" }
		);
		res.json({ roles, accessToken });
	});
};
