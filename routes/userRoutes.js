import express from "express";
import userAuth from "../middleware/userAuth.js";
import {
  getUserData,
  changeUserData,
  addToCart,
  removeFromCart,
  addToWishlist,
  removeFromWishlist,
  addWishListToCart,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/data", userAuth, getUserData);
userRouter.put("/update-data", userAuth, changeUserData);
userRouter.post("/add-to-cart", userAuth, addToCart);
userRouter.post("/remove-from-cart", userAuth, removeFromCart);
userRouter.post("/add-to-wishlist", userAuth, addToWishlist);
userRouter.post("/remove-from-wishlist", userAuth, removeFromWishlist);
userRouter.post("/add-wishlist-to-cart", userAuth, addWishListToCart);

export default userRouter;
