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

export const createNewTransaction = async (req, res) => {
	const { id, product, transactionType, amount, tx_ref, roi, duration } = req.body.data;

	if (!id) return res.status(201).json({ message: "User field is required" });
	if (!product) return res.status(201).json({ message: "Product field is required" });
	if (!transactionType) return res.status(201).json({ message: "TransactionType field is required" });
	if (!amount) return res.status(201).json({ message: "Amount field is required" });

	const amountValue = parseFloat(amount);

	const currentUser = await User.findById(id).exec();
	if (!currentUser) return res.status(201).json({ message: "CurrentUser not found" });
	if (transactionType !== "Deposit" && currentUser.walletBalance < amountValue) return res.status(201).json({ message: "Wallet balance is low. Please fund" });
	else {
		await currentUser.save();
		const transaction = await Transaction.create({ user: id, product, transactionType, amount: amountValue, tx_ref, roi, duration });

		if (transaction) {
			await transaction.save();
			return res.status(200).json(transaction.id);
		} else return res.status(201).json({ message: "Invalid transaction received" });
	}
};

export const updateTransaction = async (req, res) => {
	const { OrderID, completed, refund } = req.body.data;

	if (!OrderID) return res.status(201).json({ message: "OrderID field is required" });
	if (typeof completed !== "boolean") return res.status(201).json({ message: "Completed field as to be true or false" });

	const transaction = await Transaction.findById(OrderID).exec();
	if (!transaction) return res.status(201).json({ message: "Transaction not found" });

	const currentUser = await User.findById(transaction.user).exec();
	if (!currentUser) return res.status(201).json({ message: "CurrentUser not found" });
	if (currentUser.walletbalance < transaction.amount) return res.status(201).json({ message: "Insufficient funds!" });

	if (transaction.transactionType !== "Deposit") {
		currentUser.walletbalance -= transaction.amount;

		if (completed && transaction.transactionType === "Investment") {
			const roi = (transaction.roi / 100) * transaction.amount;
			transaction.active = true;
			currentUser.activeInvestment += 1;
			currentUser.lockedbalance += transaction.amount;
			currentUser.profitbalance += roi;
		}
	} else if (completed && transaction.transactionType === "Deposit") currentUser.walletbalance += transaction.amount;

	if (refund === true) {
		currentUser.walletbalance += transaction.amount;
		transaction.completed = false;
	} else transaction.completed = completed;

	await currentUser.save();
	await transaction.save();
	res.status(200).json({ message: "Transaction succesfully updated" });
};

export const deleteTransaction = async (req, res) => {
	const { OrderID: id } = req.body.data;

	if (!id) {
		const result = await Transaction.deleteMany({});
		console.log(result);
		if (result.deletedCount > 0) res.json(`All transactions deleted`);
		else res.status(400).json({ message: "No transaction found to delete" });
	} else {
		const transactions = await Transaction.findById(id).exec();
		if (!transactions) return res.status(400).json({ message: "Transaction not found" });
		await transactions.deleteOne();
		res.json(`Transaction deleted successfuly`);
	}
};
