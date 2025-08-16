import userModel from "../models/userModels.js";
import bcrypt from "bcryptjs";

export const getUserData = async (req, res) => {
  const userId = req.user.id;

  if (!userId) {
    return res.json({ success: false, message: "Not Authorized, Please Login" });
  }
  const user = await userModel.findById(userId);

  if (!user) {
    return res.json({ succes: false, message: "Not Authorized, Please Login" });
  }
  try {
    res.json({
      success: true,
      userData: {
        name: user.name,
        email: user.email,
        address: user.address,
        cart: user.cart,
        wishlist: user.wishlist,
      },
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const changeUserData = async (req, res) => {
  const userId = req.user.id;
  const { name, address, email, password } = req.body;

  if (!userId) {
    return res.json({ success: false, message: "Not Authorized, Please Login" });
  }
  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res.send({ success: false, message: "User not found" });
    }
    if (!password) {
      return res.json({
        success: false,
        message: "Current password is required to update details.",
      });
    }
    const passwordCheck = await bcrypt.compare(password, user.password);

    if (!passwordCheck) {
      return res.json({ success: false, message: "Current password is incorrect" });
    }

    // let hashedPassword = user.password;

    // if (newPassword) {
    //   if (newPassword.length < 5) {
    //     return res.json({
    //       success: false,
    //       message: "New password not up to minimum character of 5",
    //     });
    //   }
    //   hashedPassword = await bcrypt.hash(newPassword, 10);
    // }

    const newName = name !== undefined && name.length > 0 ? name : user.name;
    const newEmail = email !== undefined && email.length > 0 ? email : user.email;
    const newAddress =
      (address !== undefined && address.length) > 0 ? address : user.address;

    const updatedData = await userModel.findByIdAndUpdate(
      userId,
      {
        name: newName,
        address: newAddress,
        email: newEmail,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedData) {
      return res.json({ success: false, message: "User not found" });
    }
    return res.status(200).json({
      success: true,
      userData: {
        name: updatedData.name,
        email: updatedData.email,
        address: updatedData.address,
      },
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const addToCart = async (req, res) => {
  const { item, quantity } = req.body;
  const userId = req.user.id;

  if (!userId) {
    return res.json({ success: false, message: "Not Authorized. Please login" });
  }

  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const itemAlreadyInCart = user.cart.some((cart) => {
      return cart.item === item;
    });

    if (itemAlreadyInCart) {
      return res.json({ success: false, message: "Item Already Exists" });
    }
    const newItem = await userModel.findByIdAndUpdate(
      userId,
      {
        $push: {
          cart: {
            item,
            quantity,
          },
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!newItem) {
      return res.json({ success: false, message: "An error occured" });
    }

    return res.json({
      success: true,
      message: "Added to Cart",
      userData: { cart: newItem.cart },
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  const { item } = req.body;
  const userId = req.user.id;

  if (!userId) {
    return res.json({ success: false, message: "Not Authorized. Please login" });
  }

  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    // const productObjectIdToRemove = new mongoose.Types.ObjectId(item);
    const deleteItem = await userModel.findByIdAndUpdate(
      userId,
      {
        $pull: {
          cart: { item },
        },
      },
      { new: true, runValidators: true }
    );

    if (!deleteItem) {
      return res.json({ success: false, message: "An error occured" });
    }

    return res.status(200).json({
      success: true,
      message: "Removed From Cart",
      userData: { cart: deleteItem.cart },
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const addToWishlist = async (req, res) => {
  const { item, quantity } = req.body;
  const userId = req.user.id;

  if (!userId) {
    return res.json({ success: false, message: "Not Authorized. Please login" });
  }

  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const itemAlreadyInWishlist = user.wishlist.some((wishlist) => {
      return wishlist.item === item;
    });

    if (itemAlreadyInWishlist) {
      return res.json({ success: false, message: "Item Already Exists" });
    }
    const newItem = await userModel.findByIdAndUpdate(
      userId,
      {
        $push: {
          wishlist: {
            item,
            quantity,
          },
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!newItem) {
      return res.json({ success: false, message: "An error occured" });
    }

    return res.json({
      success: true,
      message: "Added to Wishlist",
      userData: { wishlist: newItem.wishlist },
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const removeFromWishlist = async (req, res) => {
  const { item } = req.body;
  const userId = req.user.id;

  if (!userId) {
    return res.json({ success: false, message: "Not Authorized. Please login" });
  }

  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    // const productObjectIdToRemove = new mongoose.Types.ObjectId(item);
    const deleteItem = await userModel.findByIdAndUpdate(
      userId,
      {
        $pull: {
          wishlist: { item },
        },
      },
      { new: true, runValidators: true }
    );

    if (!deleteItem) {
      return res.json({ success: false, message: "An error occured" });
    }

    return res.status(200).json({
      success: true,
      message: "Removed From Cart",
      userData: { cart: deleteItem.wishlist },
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const addWishListToCart = async (req, res) => {
  const userId = req.user.id;

  if (!userId) {
    return res.json({ success: false, message: "Not Authorized. Please login" });
  }

  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const itemAlreadyInWishlist = user.wishlist.some((wishlist) => {
      return wishlist.item.toString() === user.cart;
    });

    if (!itemAlreadyInWishlist) {
      return res.json({ success: false, message: "Item Already Exists" });
    }

    if (user.wishlist.length === 0) {
      return res.json({
        success: true,
        message: "Wishlist is already empty",
      });
    }

    const currentCartProductIds = new Set(
      user.cart.map((cartItem) => cartItem.item.toString())
    );

    const itemsToAddToCart = [];
    let itemsSkipped = 0;

    user.wishlist.forEach((wishlistItem) => {
      const productId = wishlistItem.item.toString();

      if (currentCartProductIds.has(productId)) {
        itemsSkipped++;
        console.log(`Skipping wishlist item ${productId} as it's already in the cart.`);
      } else {
        itemsToAddToCart.push({ item: wishlistItem.item, quantity: 1 });
      }
    });

    let successMessage = "";
    if (itemsToAddToCart.length > 0 && itemsSkipped > 0) {
      successMessage = `Moved ${itemsToAddToCart.length} item(s) to cart. ${itemsSkipped} item(s) were already in cart and skipped.`;
    } else if (itemsToAddToCart.length > 0) {
      successMessage = `Moved ${itemsToAddToCart.length} item(s) from Wishlist to Cart successfully!`;
    } else if (itemsSkipped > 0) {
      successMessage = `All wishlist items were already in cart. Nothing new was added.`;
    } else {
      successMessage = "No eligible items found in wishlist to move to cart.";
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      {
        $set: {
          cart: [...user.cart, ...itemsToAddToCart],
          wishlist: [],
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedUser) {
      return res.json({
        success: false,
        message: "An error occurred during the update process.",
      });
    }

    return res.json({
      success: true,
      message: successMessage,
      userData: {
        cart: updatedUser.cart,
        wishlist: updatedUser.wishlist,
      },
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
