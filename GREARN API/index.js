import "dotenv/config";
import "express-async-errors";
import express from "express";
// import corsOptions from "./config/corsOptions.js";
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
import noteRoutes from "./routes/noteRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import passwordRoute from "./routes/forgotPwdRoute.js";
import serviceRoutes from "./routes/serviceRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3500;
connectDB();

app.use(logger);
app.use(express.json());
// app.use(cors(corsOptions));
app.use(cors());
app.use(cookieParser());
app.use("/", express.static(path.join(__dirname, "public")));
app.use("/", rootRoutes);
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/notes", noteRoutes);
app.use("/settings", settingsRoutes);
app.use("/transaction", transactionRoutes);
app.use("/service", serviceRoutes);
app.use("/pwd", passwordRoute);

app.all("*", (req, res) => {
	res.status(404);
	if (req.accepts("html")) res.sendFile(path.join(__dirname, "views", "404.html"));
	else if (req.accepts("json")) res.json({ message: "404 Not Found" });
	else res.type("txt").send("404 Not Found");
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
	console.log("Connected to MongoDB");
	app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
});

mongoose.connection.on("error", (err) => {
	console.log(err);
	logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, "mongoErrLog.log");
});
