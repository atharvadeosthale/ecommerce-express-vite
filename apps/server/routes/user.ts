import { Router } from "express";
import { addAddress, deleteAddress, getCart, getUser } from "../functions/user";
import { getAddresses } from "../functions/user";
import { authenticatedUser } from "../middlewares/auth";

const router = Router();

router.get("/", authenticatedUser, getUser);
router.get("/address", authenticatedUser, getAddresses);
router.post("/address", authenticatedUser, addAddress);
router.delete("/address/:id", authenticatedUser, deleteAddress);
router.get("/cart", authenticatedUser, getCart);
router.post("/cart", authenticatedUser, getCart);
router.delete("/cart/:id", authenticatedUser, getCart);

export default router;
