import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
		},
		firstname: {
			type: String,
		},
		lastname: {
			type: String,
		},
		phone: {
			type: Number,
		},
		password: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		roles: {
			type: [String],
			default: ["User"],
		},
		walletbalance: {
			type: Number,
			default: 0,
		},
		lockedbalance: {
			type: Number,
			default: 0,
		},
		profitbalance: {
			type: Number,
			default: 0,
		},
		dob: {
			type: String,
		},
		country: {
			type: String,
			default: "+234",
		},
		accountnumber: {
			type: String,
		},
		accountname: {
			type: String,
		},
		bankname: {
			type: String,
		},
		refreshToken: String,
		avatar: {
			type: String,
			default: "https://res.cloudinary.com/dxz2vce9i/image/upload/v1718620172/fg7kkhasl2z5fkwmcggc.jpg",
		},
		activeInvestment: {
			type: Number,
			default: 0,
		},
	},
	{
		timestamps: true,
	}
);

export default mongoose.model("User", userSchema);
