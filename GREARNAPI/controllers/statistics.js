import User from "../models/User.js";
import Transaction from "../models/Transaction.js";

export const getStatistics = async (_req, res) => {
  try {
    // Fetch statistics
    const totalUsers = await User.countDocuments();
    const totalInactiveUsers = await User.countDocuments({ isActive: false });
    // const totalActiveUsers = await User.countDocuments({ isActive: true });
    // const totalInvestments = await Investment.countDocuments();
    const totalCompletedTransactions = await Transaction.countDocuments({ completed: true });

    // 2. Total active users in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const totalActiveUsers = await User.countDocuments({
      lastLogin: { $gte: thirtyDaysAgo }, // Users who logged in within the last 30 days
    });

    // 3. Total revenue generated from completed transactions with courseId
    const totalRevenue = await Transaction.aggregate([
      {
        $match: {
          completed: true, // Completed transactions
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amount" }, // Sum up the total amount
        },
      },
    ]);

    const revenue = totalRevenue.length > 0 ? totalRevenue[0].totalRevenue : 0; // Handle case where no revenue

    const totalAmountEarned = await Transaction.aggregate([
      { $match: { completed: true } }, // Filter for completed transactions
      { $group: { _id: null, totalEarned: { $sum: "$amount" } } }, // Sum the amount field
    ]);

    const amountEarned = totalAmountEarned[0]?.totalEarned || 0;

    // Return all statistics as a JSON response
    res.json({
      totalUsers,
      totalInactiveUsers,
      totalActiveUsers,
      totalInvestments: revenue,
      totalCompletedTransactions,
      totalAmountEarned: amountEarned,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
