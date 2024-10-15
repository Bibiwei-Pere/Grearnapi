import Statistics from "../models/Statistics.js";
import { generateSignedUrl } from "./fileUpload.js";
import Investment from "../models/Investment.js";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

export const cron = async () => {
  await updateProfit();
  await allStatistics();
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

const allStatistics = async () => {
  try {
    // Try to find the existing statistics document
    let statistics = await Statistics.findOne();

    if (!statistics) {
      statistics = new Statistics();
    } else {
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      // Update the total number of users
      statistics.userStats.totalUsers = await User.countDocuments().exec();

      // Update the number of active users (logged in today)
      statistics.userStats.activeUsers = await User.countDocuments({
        lastLogin: { $gte: startOfDay },
        isActive: true,
      }).exec();

      // Update the number of inactive users (either not logged in today or marked as inactive)
      statistics.userStats.inactiveUsers = await User.countDocuments({
        $or: [{ lastLogin: { $lt: startOfDay } }, { isActive: false }],
      }).exec();

      // Count total users who deleted their account (for churn rate)
      statistics.userStats.userChunRate = await User.countDocuments({ isDeleted: true }).exec();

      // Fetch all users and calculate the course completion rate using `activeCourseList`
      const users = await User.find().exec();
      let totalCourses = 0;
      let completedCourses = 0;

      users.forEach((user) => {
        if (user.activeCourseList.length) {
          totalCourses += user.activeCourseList.length; // Total courses for all users
          // Count courses where `duration` is 2 (considered completed)
          completedCourses += user.activeCourseList.filter((course) => course.duration === 2).length;
        }
      });

      // Calculate course completion rate as a percentage
      statistics.userStats.courseCompleted =
        totalCourses > 0
          ? ((completedCourses / totalCourses) * 100).toFixed(2) // Convert to percentage
          : 0;

      // Calculate user enrollment rate
      const usersEnrolledToday = await User.countDocuments({
        createdAt: { $gte: startOfDay },
      }).exec();

      statistics.userStats.userEnrollRate =
        statistics.userStats.totalUsers > 0
          ? ((usersEnrolledToday / statistics.userStats.totalUsers) * 100).toFixed(2) // Convert to percentage
          : 0;

      // REVIEWS
      // Update the total number of users
      // const reviewCounts = await Promise.all([
      //   Reviews.countDocuments({ star: 1 }).exec(),
      //   Reviews.countDocuments({ star: 2 }).exec(),
      //   Reviews.countDocuments({ star: 3 }).exec(),
      //   Reviews.countDocuments({ star: 4 }).exec(),
      //   Reviews.countDocuments({ star: 5 }).exec(),
      // ]);

      // // Update reviewStats in statistics
      // statistics.reviewStats.total = reviewCounts.reduce((a, b) => a + b, 0); // Total reviews
      // statistics.reviewStats.one = reviewCounts[0]; // Star 1 count
      // statistics.reviewStats.two = reviewCounts[1]; // Star 2 count
      // statistics.reviewStats.three = reviewCounts[2]; // Star 3 count
      // statistics.reviewStats.four = reviewCounts[3]; // Star 4 count
      // statistics.reviewStats.five = reviewCounts[4]; // Star 5 count
    }

    console.log(statistics);
    await statistics.save(); // Save the updated statistics document

    return statistics;
  } catch (error) {
    console.error("Error fetching statistics:", error);
    throw new Error("Failed to fetch statistics.");
  }
};
