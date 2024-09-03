import User from "../models/User.js";
import Notification from "../models/Notification.js";

// getAllNotes: Get all notes from MongoDB
export const getNotification = async (req, res) => {
	// Get all notes from MongoDB
	const notes = await Notification.find().lean();

	// If no notes
	if (!notes?.length) return res.status(201).json({ message: "No notes found" });

	// Add username to each note before sending the response
	const notesWithUser = await Promise.all(
		notes.map(async (note) => {
			const user = await User.findById(note.user).lean().exec();
			return { ...note, username: user.username };
		})
	);

	res.json(notesWithUser);
};

// createNewNote: Create new note for all users
export const createNotification = async (req, res) => {
	const { id, title, text, author } = req.body.data;

	// Check if fields are empty
	if (!title) return res.status(201).json({ message: "Title field is required" });
	if (!text) return res.status(201).json({ message: "Text field is required" });
	if (!author) return res.status(201).json({ message: "Text field is required" });

	if (!id) {
		const users = await User.find().lean().exec();

		// Create and store the new note for each user
		const notePromises = users.map(async (user) => {
			const note = await Notification.create({ user: user._id, title, text, author });
			await note.save();
		});

		const createdNotes = await Promise.all(notePromises);

		if (createdNotes.length > 0) return res.status(200).json({ message: "New note created for all users" });
		else return res.status(201).json({ message: "Failed to create note for all users" });
	} else {
		const user = await User.findById(id).exec();
		if (!user) return res.status(201).json({ message: "User not found" });

		const note = await Notification.create({ user: id, title, text, author });

		if (note) {
			await note.save();
			return res.status(200).json({ message: `New notification created for ${user.username}` });
		} else return res.status(400).json({ message: "Invalid note data received" });
	}
};

// updateNote: Update a note
export const updateNotification = async (req, res) => {
	const { id, user, title, text, completed } = req.body.data;

	// Confirm data
	if (!id) return res.status(400).json({ message: "ID field is required" });
	if (!user) return res.status(400).json({ message: "User field is required" });
	if (!title) return res.status(400).json({ message: "Title field is required" });
	if (!text) return res.status(400).json({ message: "Text field is required" });
	if (typeof completed !== "boolean") return res.status(400).json({ message: "Completed field as to be true or false" });

	// Confirm note exists to update
	const note = await Notification.findById(id).exec();
	if (!note) return res.status(400).json({ message: "Note not found" });

	// Check for duplicate title
	const duplicate = await Notification.findOne({ title }).collation({ locale: "en", strength: 2 }).lean().exec();

	// Allow renaming of the original note
	if (duplicate && duplicate?._id.toString() !== id) return res.status(409).json({ message: "Title already exists, select another" });

	note.user = user;
	note.title = title;
	note.text = text;
	note.completed = completed;
	const updatedNote = await note.save();

	res.json(`'${updatedNote.title}' updated`);
};

// deleteNote: Delete a note
export const deleteNotification = async (req, res) => {
	const { id } = req.body.data;

	// Confirm data
	if (!id) {
		const result = await Note.deleteMany({});

		if (result.deletedCount > 0) res.json(`All notes deleted`);
		else res.status(400).json({ message: "No notes found to delete" });
	} else {
		const note = await Notification.findById(id).exec();
		if (!note) return res.status(400).json({ message: "Note not found" });

		await note.deleteOne();
		res.json(`Note with ID ${id} deleted`);
	}
};
