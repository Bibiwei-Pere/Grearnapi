import Statistics from "../models/Statistics.js";
import { generateSignedUrl } from "./fileUpload.js";
import Investment from "../models/Investment.js";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

export const cron = async () => {
  await updateProfit();
  await updateFiles();
};

const updateProfit = async () => {
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

          await User.updateOne(
            { _id: user._id },
            {
              $set: {
                walletbalance: user.walletbalance,
                activeInvestment: user.activeInvestment,
                lockedbalance: user.lockedbalance,
                profitbalance: user.profitbalance,
              },
            }
          );
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

const updateFiles = async () => {
  try {
    const users = await User.find().select("-password").lean();
    if (!users?.length) return console.log("No users found");
    await Promise.all(
      users.map(async (user) => {
        if (user.avatar && user.avatar.name) user.avatar.url = await generateSignedUrl(user.avatar.name);

        return User.updateOne(
          { _id: user._id },
          {
            $set: {
              avatar: user.avatar,
            },
          }
        );
      })
    );

    const investments = await Investment.find().lean();
    if (!investments?.length) return console.log("No investments found");
    await Promise.all(
      investments.map(async (investment) => {
        if (investment.image && investment.image.name)
          investment.image.url = await generateSignedUrl(investment.image.name);

        return Investment.updateOne(
          { _id: investment._id },
          {
            $set: {
              image: investment.image,
            },
          }
        );
      })
    );

    console.log("Avatar URLs updated successfully");
  } catch (error) {
    console.log("Error updating course URLs:", error);
  }
};
