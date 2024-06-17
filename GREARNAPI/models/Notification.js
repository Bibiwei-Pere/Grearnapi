import mongoose from "mongoose";
import AutoIncrement from "mongoose-sequence";
import { Schema, model } from "mongoose";

const notificationSchema = new Schema(
	{
		// Each note belongs to a user with a special number ObjectId that matches that user
		user: {
			type: Schema.Types.ObjectId,
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
		author: {
			type: String,
			required: true,
		},
		read: {
			type: Boolean,
			default: false,
		},
	},

	{
		timestamps: true,
	}
);

// give numbers to each ticket starting from 500
notificationSchema.plugin(AutoIncrement(mongoose), {
	inc_field: "ticket",
	id: "ticketNums",
	start_seq: 1,
});

export default model("Notification", notificationSchema);
