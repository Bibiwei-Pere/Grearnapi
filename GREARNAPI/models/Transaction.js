import mongoose from "mongoose";
import AutoCount from "mongoose-sequence";

const transactionSchema = new mongoose.Schema(
	{
		// Each note belongs to a user with a special number ObjectId that matches that user
		user: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
		product: {
			type: String,
			required: true,
		},
		transactionType: {
			type: String,
			required: true,
		},
		amount: {
			type: Number,
			required: true,
		},
		tx_ref: {
			type: String,
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
transactionSchema.plugin(AutoCount(mongoose), {
	inc_field: "transaction",
	id: "transactionNums",
	start_seq: 1,
});

export default mongoose.model("Transaction", transactionSchema);
