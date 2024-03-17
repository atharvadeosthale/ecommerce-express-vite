import { Router } from "express";
import {
  addAddress,
  addToCart,
  deleteAddress,
  getCart,
  getUser,
  removeFromCart,
} from "../functions/user";
import { getAddresses } from "../functions/user";
import { authenticatedUser } from "../middlewares/auth";

const router = Router();

router.get("/", authenticatedUser, getUser);
router.get("/address", authenticatedUser, getAddresses);
router.post("/address", authenticatedUser, addAddress);
router.delete("/address/:id", authenticatedUser, deleteAddress);
router.get("/cart", authenticatedUser, getCart);
router.post("/cart", authenticatedUser, addToCart);
router.delete("/cart/:id", authenticatedUser, removeFromCart);

export default router;
