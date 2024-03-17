import { Router } from "express";
import { checkAccount, createAccount } from "../functions/payments";
import { authenticatedUser } from "../middlewares/auth";
import { checkPaymentsReady } from "../middlewares/payments";

const router = Router();

router.post("/", authenticatedUser, createAccount);
router.get("/", authenticatedUser, checkPaymentsReady, checkAccount);

export default router;
