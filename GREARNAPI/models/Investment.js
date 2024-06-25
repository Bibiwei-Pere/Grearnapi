import mongoose from "mongoose";
import AutoCount from "mongoose-sequence";

const investmentSchema = new mongoose.Schema(
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
		image: {
			type: String,
			default: "https://res.cloudinary.com/dxz2vce9i/image/upload/v1718620172/fg7kkhasl2z5fkwmcggc.jpg",
		},
		geo_location: {
			type: String,
			default: "South-west",
		},
		minimum_invest: {
			type: Number,
			required: true,
		},
		roi: {
			type: Number,
			default: 4,
		},
		duration: {
			type: Number,
			default: 0,
		},
		info: {
			type: String,
			default: "Details about this product is coming soon",
		},
		completed: {
			type: Boolean,
			default: false,
		},
		gain: {
			type: Number,
			default: 50,
		},
	},

	{
		timestamps: true,
	}
);

// give numbers to each ticket starting from 500
investmentSchema.plugin(AutoCount(mongoose), {
	inc_field: "investment",
	id: "investmentNums",
	start_seq: 1,
});

export default mongoose.model("Investment", investmentSchema);
