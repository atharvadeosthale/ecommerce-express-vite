import { Router } from "express";
import { addAddress, deleteAddress, getCart, getUser } from "../functions/user";
import { getAddresses } from "../functions/user";

const router = Router();

router.get("/", getUser);
router.get("/address", getAddresses);
router.post("/address", addAddress);
router.delete("/address/:id", deleteAddress);
router.get("/cart", getCart);
router.post("/cart", getCart);
router.delete("/cart/:id", getCart);

export default router;
