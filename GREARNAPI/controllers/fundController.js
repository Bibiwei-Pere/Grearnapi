import axios from "axios";
import path from "path";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

const { FLUTTER_WAVE_URL, FLW_SECRET_KEY } = process.env;

export const getBanks = async (req, res) => {
	try {
		const options = {
			method: "GET",
			url: `${FLUTTER_WAVE_URL}/banks/NG`,
			headers: {
				Authorization: `Bearer ${FLW_SECRET_KEY}`,
				"Content-Type": "application/json",
			},
		};

		const response = await axios(options);
		return response.data;
	} catch (error) {
		console.log("Failed to get banks", error);
	}
};

export const updateProfit = async () => {
	try {
		const users = await User.find().select("-password").lean();
		if (!users?.length) return console.log("No users found");

		const usersWithActiveInvestment = users.filter((user) => user.activeInvestment > 0);
		usersWithActiveInvestment.forEach(async (user) => {
			const transactions = await Transaction.find({ user: user._id }).exec();

			const activeTransactions = transactions.filter((transaction) => transaction.active === true);
			activeTransactions.forEach(async (transaction) => {
				if (transaction.duration > 0) {
					transaction.duration -= 1;
					await Transaction.updateOne({ _id: transaction._id }, { $set: { duration: transaction.duration } });
				} else if (transaction.duration === 0) {
					transaction.active = false;
					const roi = (transaction.roi / 100) * transaction.amount;
					const newBalance = transaction.amount + roi;

					user.walletbalance += newBalance;
					user.activeInvestment -= 1;
					user.lockedbalance -= transaction.amount;
					user.profitbalance -= roi;

					await User.updateOne({ _id: user._id }, { $set: { walletbalance: user.walletbalance, activeInvestment: user.activeInvestment, lockedbalance: user.lockedbalance, profitbalance: user.profitbalance } });
					await Transaction.updateOne({ _id: transaction._id }, { $set: { active: transaction.active } });
				} else console.log("No Active transactions");
			});

			// await User.updateOne({ _id: user._id }, { $set: { walletbalance: user.walletbalance, activeInvestment: 0, lockedbalance: 0, profitbalance: user.profitbalance } });

			// console.log(user.lockedbalance);
			// console.log(user.profitbalance);
			// console.log(user.activeInvestment);
		});
	} catch (error) {
		console.log(error);
	}
};
