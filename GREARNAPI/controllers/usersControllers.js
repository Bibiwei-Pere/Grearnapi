import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import bcrypt from "bcrypt";

// getAllUsers: To fetch all users from the DB
export const getAllUsers = async (req, res) => {
	const users = await User.find().select("-password").lean();
	if (!users?.length) return res.status(201).json({ message: "No users found" });
	res.json(users);
};

// createNewUser: To create a new user
export const createNewUser = async (req, res) => {
	const { firstname, lastname, phone, username, email, roles, password, cpassword, dob, country } = req.body.data;

	if (!username) return res.status(201).json({ message: "Username field is required" });
	if (!password) return res.status(201).json({ message: "Password field is required" });
	if (password !== cpassword) return res.status(201).json({ message: "Passwords do not match" });

	const duplicateUsername = await User.findOne({ username }).collation({ locale: "en", strength: 2 }).lean().exec();
	if (duplicateUsername) return res.status(201).json({ message: "Duplicate username" });
	const duplicateEmail = await User.findOne({ email }).collation({ locale: "en", strength: 2 }).lean().exec();
	if (duplicateEmail) return res.status(201).json({ message: "Email address already exist!" });

	try {
		const hashedPwd = await bcrypt.hash(password, 10);

		const userObject = !Array.isArray(roles) || !roles.length ? { firstname, lastname, phone, username, email, password: hashedPwd, dob, country } : { firstname, lastname, phone, username, email, roles, password: hashedPwd, dob, country };

		const user = await User.create(userObject);

		if (user) return res.status(200).json({ message: `New user ${username} created` });
		else return res.status(400).json({ message: "Invalid user data received" });
	} catch (error) {
		return res.status(500).json({ message: "Internal server error" });
	}
};

// updateUser: To update a User
export const updateUser = async (req, res) => {
	const { id, firstname, lastname, phone, username, email, roles, password, walletbalance, lockedbalance, transactions, dob, country, avatar, accountnumber, accountname, bankname } = req.body.data;
	if (!id) return res.status(201).json({ message: "ID field is required" });

	const user = await User.findById(id).exec();
	if (!user) return res.status(201).json({ message: "User not found" });

	if (firstname) user.firstname = firstname;
	if (lastname) user.lastname = lastname;
	if (username) {
		const duplicateUsername = await User.findOne({ username }).collation({ locale: "en", strength: 2 }).lean().exec();
		if (duplicateUsername) return res.status(201).json({ message: "Duplicate username" });
		else user.username = username;
	}
	if (email) {
		const duplicateEmail = await User.findOne({ email }).collation({ locale: "en", strength: 2 }).lean().exec();
		if (duplicateEmail) return res.status(201).json({ message: "Email address already exist!" });
		else user.email = email;
	}
	if (phone) user.phone = phone;
	if (roles) user.roles = roles;
	console.log(user.walletbalance);
	if (walletbalance) user.walletbalance = walletbalance;
	if (lockedbalance) user.lockedbalance = lockedbalance;
	if (dob) user.dob = dob;
	if (country) user.country = country;
	if (password) {
		const hashedPwd = await bcrypt.hash(password, 10);
		user.password = hashedPwd;
	}
	if (transactions) user.transactions = transactions;
	if (avatar) user.avatar = avatar;
	if (accountnumber) user.accountnumber = accountnumber;
	if (accountname) user.accountname = accountname;
	if (bankname) user.bankname = bankname;

	const updateUser = await user.save();
	console.log(user.walletbalance);

	res.json({ message: `${updateUser.username} successfully updated` });
};

export const deleteUser = async (req, res) => {
	const { id } = req.body;

	if (!id) return res.status(400).json({ message: "User ID required" });

	const transaction = await Transaction.findOne({ user: id }).lean().exec();
	if (transaction) return res.status(400).json({ message: "User has transactions, can't delete" });

	const user = await User.findById(id).exec();
	if (!user) return res.status(400).json({ message: "User not found!" });

	await user.deleteOne();
	res.json("User successfully deleted");
};
