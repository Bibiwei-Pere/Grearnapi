import User from "../models/User.js";
import Investment from "../models/Investment.js";

export const getAllInvestment = async (req, res) => {
  const investments = await Investment.find().sort({ createdAt: -1 }).lean();
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
  const { userId, product, geo_location, minimum_invest, roi, info, image, gain, duration, isActive } = req.body;

  if (!userId) return res.status(400).json({ message: "User field is required" });
  if (!product) return res.status(400).json({ message: "Product field is required" });
  if (!minimum_invest) return res.status(400).json({ message: "Minimum_invest field is required" });
  if (!roi) return res.status(400).json({ message: "Roi field is required" });
  if (!gain) return res.status(400).json({ message: "Gain field is required" });
  if (!duration) return res.status(400).json({ message: "Duration field is required" });

  let parseMinimum_invest = parseInt(minimum_invest);
  let parseRoi = parseInt(roi);
  let parseGain = parseInt(gain);
  let parseDuration = parseInt(duration);

  const currentUser = await User.findById(userId).exec();
  if (!currentUser) return res.status(400)({ message: "CurrentUser not found" });
  else {
    await currentUser.save();

    const investment = await Investment.create({
      user: userId,
      product,
      geo_location,
      minimum_invest: parseMinimum_invest,
      roi: parseRoi,
      info,
      image,
      gain: parseGain,
      duration: parseDuration,
      isActive: isActive === "Published" ? true : false,
    });

    if (investment) {
      await investment.save();
      return res.status(200).json({ message: "New investment successfully created" });
    } else return res.status(400)({ message: "Invalid investment received" });
  }
};

export const updateInvestment = async (req, res) => {
  const { OrderID, completed, product, geo_location, minimum_invest, roi, info, image, gain, isActive } = req.body;

  if (!OrderID) return res.status(400).json({ message: "OrderID field is required" });
  if (typeof completed !== "boolean")
    return res.status(400).json({ message: "Completed field as to be true or false" });

  const investment = await Investment.findById(OrderID).exec();
  if (!investment) return res.status(400).json({ message: "Investment not found" });

  if (completed) investment.completed = completed;
  if (product) investment.product = product;
  if (geo_location) investment.geo_location = geo_location;
  if (minimum_invest) investment.minimum_invest = minimum_invest;
  if (roi) investment.roi = roi;
  if (info) investment.info = info;
  if (image) investment.image = image;
  if (gain) investment.gain = gain;
  if (isActive) investment.isActive = isActive === "Published" ? true : false;

  await investment.save();
  res.status(200).json({ message: "Investment succesfully updated" });
};

export const deleteInvestment = async (req, res) => {
  const { investmentId } = req.params;

  const investments = await Investment.findById(investmentId).exec();
  if (!investments) return res.status(400).json({ message: "Investment not found" });
  await investments.deleteOne();
  res.status(200).json(`Investment deleted successfuly`);
};
