import User from "../models/User.js";
import Signal from "../models/Signal.js";

export const getAllSignals = async (_req, res) => {
  const signals = await Signal.find().sort({ createdAt: -1 }).lean();

  if (!signals.length) return res.status(200).json([]);

  // Filter unique signals by username
  const uniqueSignals = new Map();

  signals.forEach((signal) => {
    if (!uniqueSignals.has(signal.name)) {
      uniqueSignals.set(signal.name, signal);
    }
  });

  res.json(Array.from(uniqueSignals.values()));
};

export const getUserSignals = async (req, res) => {
  const { userId } = req.params;

  const signal = await Signal.find({ user: userId }).sort({ createdAt: -1 }).lean();

  if (!signal) return res.status(200).json([]);

  res.json(signal);
};

export const getSignal = async (req, res) => {
  const { signalId } = req.params;

  const signal = await Signal.findById(signalId).lean();

  if (!signal) return res.status(400).json({ message: "No signal found" });

  res.json(signal);
};

export const postSignal = async (req, res) => {
  const { userId, data, name, orderType, duration, info, status } = req.body;

  // await Signal.deleteMany();
  // Validate required fields
  if (!data || !Array.isArray(data) || data.length === 0) {
    return res.status(400).json({ message: "Data field is required and must be an array." });
  }
  if (!orderType) return res.status(400).json({ message: "Order type is required." });
  if (!name) return res.status(400).json({ message: "Product name is required." });

  const duplicateName = await User.findOne({ name }).collation({ locale: "en", strength: 2 }).lean().exec();
  if (duplicateName) return res.status(400).json({ message: "You've already added this product" });

  if (status === "Published") {
    // Retrieve all users
    const users = await User.find().lean().exec();

    const signals = users.map(async (user) => {
      // Create signal for each user
      const signal = await Signal.create({
        user: user._id,
        data, // Dadata data comes directly from the frontend
        orderType,
        duration,
        info,
        status,
        name,
      });

      await signal.save();
      return signal;
    });

    const createdSignal = await Promise.all(signals);

    if (createdSignal.length > 0) {
      return res.status(200).json({ message: "New signal created and sent to all users." });
    } else {
      return res.status(400).json({ message: "Failed to create signal for all users." });
    }
  } else {
    // If it's a draft, create signal for a specific user
    if (!userId) return res.status(400).json({ message: "UserId is required for a draft." });

    const specificUser = await User.findById(userId).lean().exec();
    if (!specificUser) return res.status(400).json({ message: "User not found." });

    const signal = await Signal.create({
      user: specificUser._id,
      data, // Product data comes directly from the frontend
      orderType,
      duration,
      info,
      status,
      name,
    });

    await signal.save();

    if (signal) {
      return res.status(200).json({ message: "Signal Archived successfully" });
    } else {
      return res.status(400).json({ message: "Failed to add draft." });
    }
  }
};

export const updateSignal = async (req, res) => {
  const { signalId, data, name, orderType, duration, info, status, isRead } = req.body;
  const signal = await Signal.findById(signalId).exec();
  if (!signal) return res.status(400).json({ message: "Signal not found" });

  if (data) signal.data = data;
  if (name) signal.name = name;
  if (status) signal.status = status;
  if (info) signal.info = info;
  if (duration) signal.duration = duration;
  if (orderType) signal.orderType = orderType;
  if (isRead !== undefined) signal.isRead = isRead;

  await signal.save();
  console.log(signal);
  res.json({ message: "Signal successfully updated" });
};

export const deleteSignal = async (req, res) => {
  const { signalId } = req.params;
  console.log(req.params);
  const signal = await Signal.findById(signalId).exec();
  if (!signal) return res.status(400).json({ message: "Signal not found" });

  await signal.deleteOne();
  res.json(`Signal deleted successfully`);
};
