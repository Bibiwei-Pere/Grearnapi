import "dotenv/config";
import "express-async-errors";
import express from "express";
import corsOptions from "./config/corsOptions.js";
import path from "path";
import cors from "cors";
import { logEvents, logger, errorHandler } from "./middleware/logger.js";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import { dirname } from "path";
import connectDB from "./config/dbConn.js";
import mongoose from "mongoose";
import rootRoutes from "./routes/root.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import investmentRoutes from "./routes/investmentRoutes.js";
import passwordRoute from "./routes/forgotPwdRoute.js";
import fundRoutes from "./routes/fundRoutes.js";
import upload from "./routes/fileUpload.js";
import statistics from "./routes/statistics.js";
import review from "./routes/review.js";
import ticket from "./routes/ticket.js";
import signal from "./routes/signal.js";
import { cron } from "./controllers/cron.js";
import crons from "node-cron";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3500;
connectDB();

app.use(logger);
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use("/", express.static(path.join(__dirname, "public")));
app.use("/", rootRoutes);
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/notification", notificationRoutes);
app.use("/transaction", transactionRoutes);
app.use("/fund", fundRoutes);
app.use("/pwd", passwordRoute);
app.use("/investment", investmentRoutes);
app.use("/cron", cron);
app.use("/upload", upload);
app.use("/statistics", statistics);
app.use("/review", review);
app.use("/ticket", ticket);
app.use("/signal", signal);

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) res.sendFile(path.join(__dirname, "views", "404.html"));
  else if (req.accepts("json")) res.json({ message: "404 Not Found" });
  else res.type("txt").send("404 Not Found");
});

app.use(errorHandler);

// crons.schedule("*/5 * * * * *", () => {
//   cron();
// });

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
});

mongoose.connection.on("error", (err) => {
  console.log(err);
  logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, "mongoErrLog.log");
});
