import { NextFunction, Request, Response } from "express";
import { stripe } from "../stripe/stripe";

export const checkPaymentsReady = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) return;

  const { stripeAccountId } = req.user;

  if (stripeAccountId === "") {
    return res.status(400).json({ error: "Payments not setup" });
  }

  const account = await stripe.accounts.retrieve(stripeAccountId);

  if (!account.details_submitted) {
    return res
      .status(400)
      .json({ error: "Account details not submitted yet!" });
  }

  // Do not do charges check in development because test mode accounts
  // don't get approved.
  if ((process.env.ENVIRONMENT as string) !== "development") {
    if (!account.charges_enabled) {
      return res.status(400).json({ error: "Charges not enabled yet!" });
    }
  }

  next();
};
