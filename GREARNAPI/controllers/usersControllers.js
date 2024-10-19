import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import bcrypt from "bcrypt";

// getAllUsers: To fetch all users from the DB
export const getAllUsers = async (_req, res) => {
  const users = await User.find().sort({ createdAt: -1 }).lean();
  if (!users?.length) return res.status(400).json({ message: "No users found" });
  res.json(users);
};

export const getUser = async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId).select("-password").lean();
  if (!user) return res.status(400).json({ message: "No user found" });
  res.json(user);
};

export const postUser = async (req, res) => {
  const { firstname, lastname, phone, username, email, role, password } = req.body;
  console.log(req.body);
  if (!username) return res.status(400).json({ message: "Username field is required" });
  if (!password) return res.status(400).json({ message: "Password field is required" });
  if (!firstname) return res.status(400).json({ message: "Firstname field is required" });
  if (!phone) return res.status(400).json({ message: "Phone field is required" });
  if (!email) return res.status(400).json({ message: "Email field is required" });

  const duplicateUsername = await User.findOne({ username }).collation({ locale: "en", strength: 2 }).lean().exec();
  if (duplicateUsername) return res.status(400).json({ message: "Duplicate username" });
  const duplicateEmail = await User.findOne({ email }).collation({ locale: "en", strength: 2 }).lean().exec();
  if (duplicateEmail) return res.status(400).json({ message: "Email address already exist!" });

  try {
    const hashedPwd = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstname,
      lastname,
      phone: parseInt(phone),
      username,
      email,
      role,
      password: hashedPwd,
    });
    user.lastLogin = new Date();
    user.isActive = true;
    if (user) {
      await user.save();
      return res.status(200).json({ message: `New user ${username} created` });
    } else return res.status(400).json({ message: "Invalid user data received" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const updateUser = async (req, res) => {
  const {
    userId,
    firstname,
    lastname,
    phone,
    username,
    email,
    role,
    password,
    transactions,
    dob,
    country,
    balance,
    avatar,
    bankDetails,
  } = req.body;
  console.log(req.body);
  if (!userId) return res.status(400).json({ message: "ID field is required" });

  const user = await User.findById(userId).exec();
  if (!user) return res.status(400).json({ message: "User not found" });

  if (firstname) user.firstname = firstname;
  if (lastname) user.lastname = lastname;
  if (username) {
    const duplicateUsername = await User.findOne({ username }).collation({ locale: "en", strength: 2 }).lean().exec();
    if (duplicateUsername) return res.status(400).json({ message: "Duplicate username" });
    else user.username = username;
  }
  if (email) {
    const duplicateEmail = await User.findOne({ email }).collation({ locale: "en", strength: 2 }).lean().exec();
    if (duplicateEmail) return res.status(400).json({ message: "Email address already exist!" });
    else user.email = email;
  }
  if (phone) user.phone = parseInt(phone);
  if (role) user.role = role;
  if (dob) user.dob = dob;
  if (country) user.country = country;
  if (password) {
    const hashedPwd = await bcrypt.hash(password, 10);
    user.password = hashedPwd;
  }
  if (transactions) user.transactions = transactions;
  if (avatar) user.avatar = avatar;
  if (bankDetails) user.bankDetails = bankDetails;
  if (balance) user.balance = balance;

  const updateUser = await user.save();

  res.json({ message: `${updateUser.username} successfully updated` });
};

export const deleteUser = async (req, res) => {
  const { userId } = req.params;
  if (!userId) return res.status(400).json({ message: "User ID required" });

  const transaction = await Transaction.findOne({ user: userId }).lean().exec();
  if (transaction) return res.status(400).json({ message: "User has transactions, can't delete" });

  const user = await User.findById(userId).exec();
  if (!user) return res.status(400).json({ message: "User not found!" });

  await user.deleteOne();
  res.json("User successfully deleted");
};
