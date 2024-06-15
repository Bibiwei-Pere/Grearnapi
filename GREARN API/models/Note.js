import mongoose from "mongoose";
import AutoIncrement from "mongoose-sequence";
import { Schema, model } from "mongoose";

const noteSchema = new Schema(
	{
		// Each note belongs to a user with a special number ObjectId that matches that user
		user: {
			type: Schema.Types.ObjectId,
			// required: true,
			ref: "User",
		},
		title: {
			type: String,
			required: true,
		},
		text: {
			type: String,
			required: true,
		},
		completed: {
			type: Boolean,
			default: false,
		},
	},

	// Keeps time of when each notes was created & if any changes was made
	{
		timestamps: true,
	}
);

// give numbers to each ticket starting from 500
noteSchema.plugin(AutoIncrement(mongoose), {
	inc_field: "ticket",
	id: "ticketNums",
	start_seq: 1,
});

export default model("Note", noteSchema);
