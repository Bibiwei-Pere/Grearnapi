import User from "../models/User.js";
import Transaction from "../models/Transaction.js";

export const getAllTransaction = async (req, res) => {
	const transactions = await Transaction.find().lean();
	if (!transactions?.length) return res.status(400).json({ message: "No transaction transaction found" });

	const transactionWithUser = await Promise.all(
		transactions.map(async (transaction) => {
			const user = await User.findById(transaction.user).lean().exec();
			return { ...transaction, username: user.username };
		})
	);
	res.json(transactionWithUser);
};

export const createNewTransaction = async (req) => {
	const { user, provider_code, transactionType, amount, number } = req.body;

	if (!user) throw new Error("User field is required");
	if (!provider_code) throw new Error("Provider_code field is required");
	if (!transactionType) throw new Error("TransactionType field is required");
	if (!amount) throw new Error("Amount field is required");

	const admin = await User.findOne({ username: "Admin" }).lean().exec();
	if (!admin) throw new Error("Admin not found");

	const currentUser = await User.findById(user).exec();
	if (!currentUser) throw new Error("CurrentUser not found");
	if (transactionType !== "Deposit" && currentUser.walletBalance < amount) throw new Error("Wallet balance is low. Please fund");
	else {
		await currentUser.save();
		const transaction = await Transaction.create({ user, product: provider_code, transactionType, amount, number });

		if (transaction) return transaction.id;
		else throw new Error("Invalid transaction received");
	}
};

export const updateTransaction = async (id, refund, req, res) => {
	const { provider_code, amount, completed, discount } = req.body;
	if (typeof completed !== "boolean") return res.status(400).json({ message: "Completed field as to be true or false" });

	const transaction = await Transaction.findById(id).exec();
	if (!transaction) return res.status(400).json({ message: "Transaction not found" });
	console.log("TRANSACTION1", transaction);

	const currentUser = await User.findById(transaction.user).exec();
	if (!currentUser) return res.status(400).json({ message: "CurrentUser not found" });

	const calcDiscount = amount * (discount / 100);
	const newAmount = amount - calcDiscount;
	if (provider_code && amount && !discount && transaction.transactionType !== "Deposit") currentUser.walletBalance -= amount;
	else if (completed && transaction.transactionType === "Deposit") currentUser.walletBalance += amount;
	else if (provider_code && amount && discount) currentUser.walletBalance -= newAmount;
	else console.log("Error in MTN transaction");

	console.log("New wallet bal", currentUser.walletBalance);

	if (refund === true) {
		currentUser.walletBalance += amount;
		transaction.completed = false;
	} else transaction.completed = completed;

	await currentUser.save();
	await transaction.save();
	// res.json(`'${updatedTransaction.id}' updated`);
};

export const deleteTransaction = async (req, res) => {
	const { id } = req.body;

	if (!id) {
		const result = await Transaction.deleteMany({});
		if (result.deletedCount > 0) res.json(`All transactions deleted`);
		else res.status(400).json({ message: "No transaction found to delete" });
	} else {
		const transactions = await Transaction.findById(id).exec();
		if (!transactions) return res.status(400).json({ message: "Transaction not found" });
		await transactions.deleteOne();
		res.json(`Transaction deleted successfuly`);
	}
};
