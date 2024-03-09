import { Router } from "express";
import { createProduct } from "../functions/createProduct";
import { authenticatedUser } from "../middlewares/auth";
import { getProducts } from "../functions/getProducts";
import { updateProduct } from "../functions/updateProduct";

const router = Router();

router.post("/", authenticatedUser, createProduct);
router.get("/", getProducts);
router.get("/:id", getProducts);
router.patch("/:id", authenticatedUser, updateProduct);

export default router;
