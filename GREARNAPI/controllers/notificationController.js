import User from "../models/User.js";
import Notification from "../models/Notification.js";

export const getAllNotifications = async (req, res) => {
  const notes = await Notification.find().sort({ createdAt: -1 }).lean();

  if (!notes?.length) return res.status(200).json([]);

  const notesWithUser = await Promise.all(
    notes.map(async (note) => {
      const user = await User.findById(note.user).lean().exec();
      return { ...note, username: user.username };
    })
  );

  res.json(notesWithUser);
};

export const getAllUserNotifications = async (req, res) => {
  const { userId } = req.params;
  if (!userId) return res.status(400).json({ message: "User ID is required" });

  const notes = await Notification.find({ user: userId }).sort({ createdAt: -1 }).lean();
  console.log(notes);
  if (!notes?.length) return res.status(200).json([]);

  res.json(notes);
};

export const getNotification = async (req, res) => {
  const { id } = req.params;

  const notes = await Notification.findById(id).lean();

  if (!notes) return res.status(400).json({ message: "No notifications found" });

  res.json(notes);
};

// Create a separate helper function for notifications
export const createNotification = async ({ id, title, text, product }) => {
  if (!title) throw new Error("Title field is required");
  if (!text) throw new Error("Text field is required");

  if (!id) {
    const users = await User.find().lean().exec();
    const notePromises = users.map(async (user) => {
      const note = await Notification.create({
        user: user._id,
        title,
        text,
        product,
      });
      return note.save();
    });

    const createdNotes = await Promise.all(notePromises);
    return createdNotes.length > 0 ? "New notes created for all users" : "Failed to create notes for users";
  } else {
    // Create a notification for a specific user
    const user = await User.findById(id).exec();
    if (!user) throw new Error("User not found");

    const note = await Notification.create({ user: id, title, text, product });
    if (note) {
      await note.save();
      return `New notification created for ${user.username}`;
    } else {
      throw new Error("Invalid notification data received");
    }
  }
};

export const postNotification = async (req, res) => {
  const { id, title, text, product } = req.body;
  console.log(req.body);
  if (!title) return res.status(400).json({ message: "Title field is required" });
  if (!text) return res.status(400).json({ message: "Text field is required" });

  if (!id) {
    const users = await User.find().lean().exec();

    // Create and store the new note for each user
    const notePromises = users.map(async (user) => {
      const note = await Notification.create({
        user: user._id,
        title,
        text,
        product,
      });
      await note.save();
    });

    const createdNotes = await Promise.all(notePromises);

    if (createdNotes.length > 0) return res.status(200).json({ message: "New note created for all users" });
    else return res.status(400).json({ message: "Failed to create note for all users" });
  } else {
    const user = await User.findById(id).exec();
    if (!user) return res.status(400).json({ message: "User not found" });

    const note = await Notification.create({ user: id, title, text, product });

    if (note) {
      await note.save();
      console.log(note);
      return res.status(200).json({ message: `New notification created for ${user.username}` });
    } else return res.status(400).json({ message: "Invalid note data received" });
  }
};

export const updateNotification = async (req, res) => {
  const { id, user, title, text } = req.body;

  const note = await Notification.findById(id).exec();
  if (!note) return res.status(400).json({ message: "Note not found" });

  if (user) note.user = user;
  if (title) note.title = title;
  if (text) note.text = text;

  const updatedNote = await note.save();

  res.json(`'${updatedNote.title}' updated`);
};

export const deleteNotification = async (req, res) => {
  const { id } = req.params;
  // Confirm data
  if (!id) {
    const result = await Notification.deleteMany({});

    if (result.deletedCount > 0) res.json(`All notifications deleted`);
    else res.status(400).json({ message: "No notifications found to delete" });
  } else {
    const notification = await Notification.findById(id).exec();
    if (!notification) return res.status(400).json({ message: "Notification not found" });

    await notification.deleteOne();
    res.json(`Notification with ID ${id} deleted`);
  }
};

const title = ["Course Completed", "Successful transaction", "New course", "New quiz", "Certificate"];
