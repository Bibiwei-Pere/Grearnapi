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
		referalbalance: {
			type: Number,
			default: 0,
		},
		transactions: {
			type: [
				{
					month: {
						type: String,
					},
					depositHistory: {
						type: Number,
						default: 0,
					},
					withdrwalHistory: {
						type: Number,
						default: 0,
					},
					walletBal: {
						type: Number,
						default: 0,
					},
					profitBal: {
						type: Number,
						default: 0,
					},
				},
			],
			default: [
				{
					month: "Jan",
					walletBal: 0,
					profitBal: 0,
					depositHistory: 0,
					withdrwalHistory: 0,
				},
				{
					month: "Feb",
					walletBal: 0,
					profitBal: 0,
					depositHistory: 0,
					withdrwalHistory: 0,
				},
				{
					month: "Mar",
					walletBal: 0,
					profitBal: 0,
					depositHistory: 0,
					withdrwalHistory: 0,
				},
				{
					month: "Apr",
					walletBal: 0,
					profitBal: 0,
					depositHistory: 0,
					withdrwalHistory: 0,
				},
				{
					month: "May",
					walletBal: 0,
					profitBal: 0,
					depositHistory: 0,
					withdrwalHistory: 0,
				},
				{
					month: "Jun",
					walletBal: 0,
					profitBal: 0,
					depositHistory: 0,
					withdrwalHistory: 0,
				},
				{
					month: "Jul",
					walletBal: 0,
					profitBal: 0,
					depositHistory: 0,
					withdrwalHistory: 0,
				},
				{
					month: "Aug",
					walletBal: 0,
					profitBal: 0,
					depositHistory: 0,
					withdrwalHistory: 0,
				},
				{
					month: "Sep",
					walletBal: 0,
					profitBal: 0,
					depositHistory: 0,
					withdrwalHistory: 0,
				},
				{
					month: "Oct",
					walletBal: 0,
					profitBal: 0,
					depositHistory: 0,
					withdrwalHistory: 0,
				},
				{
					month: "Nov",
					walletBal: 0,
					profitBal: 0,
					depositHistory: 0,
					withdrwalHistory: 0,
				},
				{
					month: "Dec",
					walletBal: 0,
					profitBal: 0,
					depositHistory: 0,
					withdrwalHistory: 0,
				},
			],
		},
		refreshToken: String,
	},
	{
		timestamps: true,
	}
);

export default mongoose.model("User", userSchema);
