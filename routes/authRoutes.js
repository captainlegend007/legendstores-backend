import { isAuth, Login, Logout, Register } from "../controllers/authController.js";
import express from "express";
import userAuth from "../middleware/userAuth.js";

const authRouter = express.Router();

authRouter.post("/register", Register);
authRouter.post("/login", Login);
authRouter.post("/logout", Logout);
authRouter.get("/is-auth", userAuth, isAuth);

export default authRouter;
