import Statistics from "../models/Statistics.js";

export const getStatistics = async (_req, res) => {
  try {
    let statistics = await Statistics.findOne();
    if (!statistics) return res.status(200).json([]);
    res.json(statistics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
