import User from "../models/User.js";
import Investment from "../models/Investment.js";

export const getAllInvestment = async (req, res) => {
	const investments = await Investment.find().lean();
	if (!investments?.length) return res.status(400).json({ message: "No investments found" });

	const investmentWithUser = await Promise.all(
		investments.map(async (investment) => {
			const user = await User.findById(investment.user).lean().exec();
			return { ...investment, username: user.username };
		})
	);
	res.json(investmentWithUser);
};

export const createNewInvestment = async (req, res) => {
	const { id, product, geo_location, minimum_invest, roi, info, image, gain, duration } = req.body.data;

	if (!id) return res.status(201).json({ message: "User field is required" });
	if (!product) return res.status(201).json({ message: "Product field is required" });
	if (!minimum_invest) return res.status(201).json({ message: "Minimum_invest field is required" });
	if (!roi) return res.status(201).json({ message: "Roi field is required" });
	if (!gain) return res.status(201).json({ message: "Gain field is required" });
	if (!duration) return res.status(201).json({ message: "Duration field is required" });

	let parseMinimum_invest = parseInt(minimum_invest);
	let parseRoi = parseInt(roi);
	let parseGain = parseInt(gain);
	let parseDuration = parseInt(duration);

	const currentUser = await User.findById(id).exec();
	if (!currentUser) return res.status(201)({ message: "CurrentUser not found" });
	else {
		await currentUser.save();
		const investment = await Investment.create({ user: id, product, geo_location, minimum_invest: parseMinimum_invest, roi: parseRoi, info, image, gain: parseGain, duration: parseDuration });

		if (investment) {
			await investment.save();
			return res.status(200).json({ message: "New investment successfully created" });
		} else return res.status(201)({ message: "Invalid investment received" });
	}
};

export const updateInvestment = async (req, res) => {
	const { OrderID, completed, product, geo_location, minimum_invest, roi, info, image, gain } = req.body.data;

	if (!OrderID) return res.status(201).json({ message: "OrderID field is required" });
	if (typeof completed !== "boolean") return res.status(201).json({ message: "Completed field as to be true or false" });

	const investment = await Investment.findById(OrderID).exec();
	if (!investment) return res.status(201).json({ message: "Investment not found" });

	if (completed) investment.completed = completed;
	if (product) investment.product = product;
	if (geo_location) investment.geo_location = geo_location;
	if (minimum_invest) investment.minimum_invest = minimum_invest;
	if (roi) investment.roi = roi;
	if (info) investment.info = info;
	if (image) investment.image = image;
	if (gain) investment.gain = gain;

	await investment.save();
	res.status(200).json({ message: "Investment succesfully updated" });
};

export const deleteInvestment = async (req, res) => {
	const { OrderID: id } = req.body.data;

	if (!id) {
		const result = await Investment.deleteMany({});
		console.log(result);
		if (result.deletedCount > 0) res.json(`All investments deleted`);
		else res.status(400).json({ message: "No investment found to delete" });
	} else {
		const investments = await Investment.findById(id).exec();
		if (!investments) return res.status(400).json({ message: "Investment not found" });
		await investments.deleteOne();
		res.json(`Investment deleted successfuly`);
	}
};
