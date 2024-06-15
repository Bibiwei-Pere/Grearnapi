import User from "../models/User.js";
import Note from "../models/Note.js";
// const bcrypt = require("bcrypt") // To encrypt or secure the password everywhere, including the DB

// getAllSettings: To fetch all users from the DB
export const getAllSettings = async (req, res) => {
	const users = await User.find().select("-password").lean(); // fetch all User model excluding the passwords. lean makes the data easier to work with
	if (!users?.length) return res.status(400).json({ message: "No users found" }); // return this if no user is found
	res.json(users); // else return the users
};

// updateSetting: To update a User
export const updateSetting = async (req, res) => {
	const { id, username, roles, password, active, firstName, lastName, email, phone, address, country, sex, btcAddress, ethAddress, usdtAddress, walletBalance, profitBalance } = req.body;

	// Check for any empty field and return accordingly
	if (!id) return res.status(400).json({ message: "ID field is required" });
	if (!username) return res.status(400).json({ message: "Username field is required" });
	if (!Array.isArray(roles) || !roles.length) return res.status(400).json({ message: "Roles field cannot be empty" });
	if (typeof active !== "boolean") return res.status(400).json({ message: "Active should be either true or false" });

	const user = await User.findById(id).exec(); // Find the user by the provided id
	if (!user) return res.status(400).json({ message: "User not found" });

	// Checks if the new username is availble else throw the err
	const duplicate = await User.findOne({ username }).collation({ locale: "en", strength: 2 }).lean().exec();
	if (duplicate && duplicate?._id.toString() !== id) return res.status(409).json({ message: "Username is already taken" });

	// Update the user with the new details including the pwd is provided
	user.username = username;
	user.roles = roles;
	user.active = active;
	user.firstName = firstName;
	user.lastName = lastName;
	user.email = email;
	user.phone = phone;
	user.address = address;
	user.country = country;
	user.sex = sex;
	user.btcAddress = btcAddress;
	user.ethAddress = ethAddress;
	user.usdtAddress = usdtAddress;
	user.walletBalance = walletBalance;
	user.profitBalance = profitBalance;
	if (password) user.password = password;
	// if (password) user.password = await bcrypt.hash(password, 10);

	const updateSetting = await user.save();
	res.json({ message: `${updateSetting.username} successfully updated` });
};

// deleteSetting: To delete a User
export const deleteSetting = async (req, res) => {
	const { id } = req.body;

	if (!id) return res.status(400).json({ message: "User ID required" });

	// Check if the User as assigned any notes before now
	const note = await Note.findOne({ user: id }).lean().exec();
	if (note) return res.status(400).json({ message: "User has assigned note, unassign note to continue" });

	const user = await User.findById(id).exec();
	if (!user) return res.status(400).json({ message: "User not found!" });

	const result = await user.deleteOne();
	const reply = `Username ${result.username} with ID ${result._id} deleted`;

	res.json(reply);
};
