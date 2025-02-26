import "dotenv/config";
import express from "express";
import { CLIENT_URL, PORT } from "./constants/env";
import connectDb from "./config/db";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorHandler from "./middleware/errorHandler";
import authRoutes from "./routes/auth";
import authenticate from "./middleware/authenticate";
import userRoutes from "./routes/user";
import sessionRoutes from "./routes/session";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", authenticate, userRoutes);
app.use("/api/v1/sessions", authenticate, sessionRoutes);
app.use(errorHandler);
app.listen(PORT, async () => {
  console.log(`Server is running on ${PORT}`);
  await connectDb();
});
