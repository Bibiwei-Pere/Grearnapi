import User from "../models/User.js";
import Note from "../models/Note.js";

// getAllNotes: Get all notes from MongoDB
export const getAllNotes = async (req, res) => {
	// Get all notes from MongoDB
	const notes = await Note.find().lean();

	// If no notes
	if (!notes?.length) return res.status(400).json({ message: "No notes found" });

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
export const createNewNote = async (req, res) => {
	const { user, title, text } = req.body;

	// Check if fields are empty
	if (!title) return res.status(400).json({ message: "Title field is required" });
	if (!text) return res.status(400).json({ message: "Text field is required" });
	if (!user) {
		const users = await User.find().lean().exec();

		// Create and store the new note for each user
		const notePromises = users.map(async (user) => {
			const note = await Note.create({ user: user._id, title, text });
			await note.save();
		});

		const createdNotes = await Promise.all(notePromises);

		if (createdNotes.length > 0) return res.status(201).json({ message: "New note created for all users" });
		else return res.status(400).json({ message: "Failed to create note for all users" });
	} else {
		const note = await Note.create({ user, title, text });

		if (note) {
			await note.save();
			return res.status(201).json({ message: `New note created for ${user}` });
		} else return res.status(400).json({ message: "Invalid note data received" });
	}
};

// updateNote: Update a note
export const updateNote = async (req, res) => {
	const { id, user, title, text, completed } = req.body;

	// Confirm data
	if (!id) return res.status(400).json({ message: "ID field is required" });
	if (!user) return res.status(400).json({ message: "User field is required" });
	if (!title) return res.status(400).json({ message: "Title field is required" });
	if (!text) return res.status(400).json({ message: "Text field is required" });
	if (typeof completed !== "boolean") return res.status(400).json({ message: "Completed field as to be true or false" });

	// Confirm note exists to update
	const note = await Note.findById(id).exec();
	if (!note) return res.status(400).json({ message: "Note not found" });

	// Check for duplicate title
	const duplicate = await Note.findOne({ title }).collation({ locale: "en", strength: 2 }).lean().exec();

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
export const deleteNote = async (req, res) => {
	const { id } = req.body;

	// Confirm data
	if (!id) {
		const result = await Note.deleteMany({});

		if (result.deletedCount > 0) res.json(`All notes deleted`);
		else res.status(400).json({ message: "No notes found to delete" });
	} else {
		const note = await Note.findById(id).exec();
		if (!note) return res.status(400).json({ message: "Note not found" });

		await note.deleteOne();
		res.json(`Note with ID ${id} deleted`);
	}
};
