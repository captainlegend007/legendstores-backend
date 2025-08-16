import express from "express";
import authRouter from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import "dotenv/config";
import userRouter from "./routes/userRoutes.js";
import cors from "cors";

const app = express();

const PORT = 8080;

connectDB();

const allowedOrigins = ["http://localhost:5173"];
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("API Working");
});
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

// app.listen(PORT, () => {
//   console.log("App Running");
// });
