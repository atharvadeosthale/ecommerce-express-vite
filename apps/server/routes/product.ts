import { Router } from "express";
import { createProduct } from "../functions/product";
import { authenticatedUser } from "../middlewares/auth";
import { getProducts } from "../functions/product";
import { updateProduct } from "../functions/product";
import { checkPaymentsReady } from "../middlewares/payments";

const router = Router();

router.post("/", authenticatedUser, checkPaymentsReady, createProduct);
router.get("/", getProducts);
router.get("/:id", getProducts);
router.patch("/:id", authenticatedUser, updateProduct);

export default router;
