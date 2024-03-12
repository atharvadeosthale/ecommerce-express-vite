import { Router } from "express";
import {
  checkAccount,
  createAccount,
  updateAccount,
} from "../functions/payments";
import { authenticatedUser } from "../middlewares/auth";
import { checkPaymentsReady } from "../middlewares/payments";

const router = Router();

router.post("/createAccount", authenticatedUser, createAccount);
router.get(
  "/checkAccount",
  authenticatedUser,
  checkPaymentsReady,
  checkAccount
);
router.post("/updateAccount", authenticatedUser, updateAccount);

export default router;
